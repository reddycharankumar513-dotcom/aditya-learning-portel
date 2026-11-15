import { AIProvider, AICompletionOptions, AICompletionResult } from './AIProvider.js';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  readonly defaultModel = 'gemini-1.5-flash';

  isConfigured(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return !!key && key.trim().length > 10 && !key.includes('your_gemini_api_key');
  }

  async generateStructuredCompletion<T>(
    prompt: string,
    systemPrompt: string,
    options?: AICompletionOptions
  ): Promise<AICompletionResult<T>> {
    const key = process.env.GEMINI_API_KEY;
    if (!this.isConfigured() || !key) {
      throw new Error('Gemini API key is not configured');
    }

    const model = options?.model || this.defaultModel;
    const timeoutMs = options?.timeoutMs || 45000;

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt + '\n\nOutput valid JSON only.' }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: options?.temperature ?? 0.2,
            maxOutputTokens: options?.maxTokens || 4000,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const data: any = await response.json();
      const latencyMs = Date.now() - startTime;
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsedData = JSON.parse(rawText) as T;

      const promptTokens = data.usageMetadata?.promptTokenCount || Math.round(prompt.length / 4);
      const completionTokens = data.usageMetadata?.candidatesTokenCount || Math.round(rawText.length / 4);
      const totalTokens = promptTokens + completionTokens;

      // Gemini 1.5 Flash pricing: free tier or ~$0.075/M input, ~$0.30/M output
      const estimatedCostUSD = (promptTokens * 0.000000075) + (completionTokens * 0.0000003);

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
        throw new Error(`Gemini API request timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  }
}
