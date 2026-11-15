import { AIProvider, AICompletionOptions, AICompletionResult } from './AIProvider.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  readonly defaultModel = 'gpt-4o-mini';

  isConfigured(): boolean {
    const key = process.env.OPENAI_API_KEY;
    return !!key && key.trim().length > 10 && !key.includes('your_openai_api_key');
  }

  async generateStructuredCompletion<T>(
    prompt: string,
    systemPrompt: string,
    options?: AICompletionOptions
  ): Promise<AICompletionResult<T>> {
    const key = process.env.OPENAI_API_KEY;
    if (!this.isConfigured() || !key) {
      throw new Error('OpenAI API key is not configured');
    }

    const model = options?.model || this.defaultModel;
    const maxTokens = options?.maxTokens || 4000;
    const temperature = options?.temperature ?? 0.2;
    const timeoutMs = options?.timeoutMs || 45000;

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key.trim()}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: systemPrompt + '\n\nIMPORTANT: Output valid JSON object only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errText}`);
      }

      const data: any = await response.json();
      const latencyMs = Date.now() - startTime;
      const rawText = data.choices?.[0]?.message?.content || '{}';
      const parsedData = JSON.parse(rawText) as T;

      const promptTokens = data.usage?.prompt_tokens || Math.round(prompt.length / 4);
      const completionTokens = data.usage?.completion_tokens || Math.round(rawText.length / 4);
      const totalTokens = promptTokens + completionTokens;

      // gpt-4o-mini pricing: ~$0.15/M input, ~$0.60/M output
      const estimatedCostUSD = (promptTokens * 0.00000015) + (completionTokens * 0.0000006);

      return {
        success: true,
        data: parsedData,
        rawText,
        provider: this.name,
        model,
        promptTokens,
        completionTokens,
        totalTokens,
        latencyMs,
        estimatedCostUSD,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`OpenAI API request timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  }
}
