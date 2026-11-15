export interface AICompletionOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  model?: string;
}

export interface AICompletionResult<T = any> {
  success: boolean;
  data: T;
  rawText: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCostUSD: number;
}

export interface AIProvider {
  readonly name: string;
  readonly defaultModel: string;
  isConfigured(): boolean;
  generateStructuredCompletion<T>(
    prompt: string,
    systemPrompt: string,
    options?: AICompletionOptions
  ): Promise<AICompletionResult<T>>;
}
