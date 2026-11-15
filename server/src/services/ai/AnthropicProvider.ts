import { AIProvider, AICompletionOptions, AICompletionResult } from './AIProvider.js';
import { ENV } from '../../config/env.js';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
  readonly defaultModel = 'claude-3-5-sonnet-20241022';

  isConfigured(): boolean {
    const key = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
    return !!key && key.trim().length > 10 && !key.includes('your_anthropic_api_key');
  }

  async generateStructuredCompletion<T>(
    prompt: string,
    systemPrompt: string,
    options?: AICompletionOptions
  ): Promise<AICompletionResult<T>> {
    const key = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
    if (!this.isConfigured()) {
      throw new Error('Anthropic API key is not configured');
    }

    const model = options?.model || this.defaultModel;
    const maxTokens = options?.maxTokens || 4000;
    const temperature = options?.temperature ?? 0.2;
    const timeoutMs = options?.timeoutMs || 45000;

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key.trim(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt + '\n\nIMPORTANT: Respond with valid, parseable JSON only. Do not wrap with markdown backticks or explanations.',
          messages: [
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
        throw new Error(`Anthropic API error (${response.status}): ${errText}`);
      }

      const data: any = await response.json();
      const latencyMs = Date.now() - startTime;
      const rawText = data.content?.[0]?.text || '';

      // Parse JSON from text
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedData = JSON.parse(cleaned) as T;

      const promptTokens = data.usage?.input_tokens || Math.round(prompt.length / 4);
      const completionTokens = data.usage?.output_tokens || Math.round(rawText.length / 4);
      const totalTokens = promptTokens + completionTokens;

      // Sonnet 3.5 pricing: ~$3/M input, ~$15/M output
      const estimatedCostUSD = (promptTokens * 0.000003) + (completionTokens * 0.000015);

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
        throw new Error(`Anthropic API request timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  }
}
