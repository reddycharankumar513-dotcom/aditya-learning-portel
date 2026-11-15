import { AIProvider } from './AIProvider.js';
import { AnthropicProvider } from './AnthropicProvider.js';
import { OpenAIProvider } from './OpenAIProvider.js';
import { GeminiProvider } from './GeminiProvider.js';
import { RuleEngineProvider } from './RuleEngineProvider.js';

export class AIProviderFactory {
  private static providers: Map<string, AIProvider> = new Map<string, AIProvider>([
    ['anthropic', new AnthropicProvider()],
    ['openai', new OpenAIProvider()],
    ['gemini', new GeminiProvider()],
    ['rule-engine', new RuleEngineProvider()],
  ]);

  /**
   * Get the primary configured AI provider
   */
  static getPrimaryProvider(): AIProvider {
    const forced = (process.env.AI_PROVIDER || '').toLowerCase();
    if (forced && this.providers.has(forced)) {
      const p = this.providers.get(forced)!;
      if (p.isConfigured()) return p;
    }

    // Auto-discovery order: Anthropic -> OpenAI -> Gemini -> RuleEngine
    const anthropic = this.providers.get('anthropic')!;
    if (anthropic.isConfigured()) return anthropic;

    const openai = this.providers.get('openai')!;
    if (openai.isConfigured()) return openai;

    const gemini = this.providers.get('gemini')!;
    if (gemini.isConfigured()) return gemini;

    return this.providers.get('rule-engine')!;
  }

  /**
   * Get all fallback providers in order of preference
   */
  static getFallbackProviders(excludeName: string): AIProvider[] {
    const list: AIProvider[] = [];
    const order = ['anthropic', 'openai', 'gemini', 'rule-engine'];

    for (const name of order) {
      if (name === excludeName) continue;
      const p = this.providers.get(name);
      if (p && p.isConfigured()) {
        list.push(p);
      }
    }

    // Ensure rule-engine is always present at the tail
    if (!list.some((p) => p.name === 'rule-engine')) {
      list.push(this.providers.get('rule-engine')!);
    }

    return list;
  }
}
