import { AIProviderFactory } from './AIProviderFactory.js';
import { AIProvider, AICompletionOptions, AICompletionResult } from './AIProvider.js';
import { AIUsageTracker } from './AIUsageTracker.js';
import { PromptManager } from './PromptManager.js';
import { AIResponseValidator } from './AIResponseValidator.js';

export class AIService {
  /**
   * Execute an AI completion with automatic retries and multi-provider failover
   */
  static async executeCompletion<T>(params: {
    prompt: string;
    systemPrompt: string;
    feature: 'skill_assessment' | 'resume_analyzer' | 'interview' | 'coding_mentor' | 'general';
    userId?: string;
    options?: AICompletionOptions;
  }): Promise<AICompletionResult<T>> {
    const primaryProvider = AIProviderFactory.getPrimaryProvider();
    const providersToTry: AIProvider[] = [
      primaryProvider,
      ...AIProviderFactory.getFallbackProviders(primaryProvider.name),
    ];

    let lastError: any = null;

    for (let i = 0; i < providersToTry.length; i++) {
      const provider = providersToTry[i];
      const isFallback = i > 0;

      try {
        const result = await this.tryProviderWithRetry<T>(provider, params.prompt, params.systemPrompt, params.options);

        // Asynchronously track usage
        AIUsageTracker.logUsage({
          userId: params.userId,
          feature: params.feature,
          result,
          status: isFallback ? 'fallback' : 'success',
        });

        return result;
      } catch (err: any) {
        lastError = err;
        console.warn(`[AIService] Provider ${provider.name} failed (${err.message}). Trying next fallback...`);
      }
    }

    throw new Error(`All configured AI providers and fallbacks failed. Last error: ${lastError?.message}`);
  }

  /**
   * Try single provider with 1 retry on transient network/rate limit errors
   */
  private static async tryProviderWithRetry<T>(
    provider: AIProvider,
    prompt: string,
    systemPrompt: string,
    options?: AICompletionOptions
  ): Promise<AICompletionResult<T>> {
    try {
      return await provider.generateStructuredCompletion<T>(prompt, systemPrompt, options);
    } catch (err: any) {
      const isRateLimitOrTimeout = 
        err.message?.includes('429') || 
        err.message?.includes('timed out') || 
        err.message?.includes('ECONNRESET');

      if (isRateLimitOrTimeout) {
        // Wait 800ms before one quick retry
        await new Promise((r) => setTimeout(r, 800));
        return await provider.generateStructuredCompletion<T>(prompt, systemPrompt, options);
      }
      throw err;
    }
  }

  // =========================================================================
  // HIGH-LEVEL FEATURE WRAPPERS
  // =========================================================================

  /**
   * Generate Skill Assessment Questions
   */
  static async generateAssessmentQuestions(params: {
    role: string;
    skill: string;
    difficulty: string;
    count: number;
    userId?: string;
  }): Promise<{ questions: any[]; provider: string; model: string }> {
    const systemPrompt = PromptManager.getAssessmentSystemPrompt();
    const prompt = PromptManager.getAssessmentGenerationPrompt(params);

    const completion = await this.executeCompletion<{ questions: any[] }>({
      prompt,
      systemPrompt,
      feature: 'skill_assessment',
      userId: params.userId,
      options: { temperature: 0.2, maxTokens: 4000 },
    });

    const validation = AIResponseValidator.validateQuestions(completion.data);
    if (!validation.isValid) {
      console.warn('[AIService] Question schema validation failed, falling back to rule engine:', validation.error);
      const fallbackProvider = AIProviderFactory.getFallbackProviders('')[0];
      const fallbackCompletion = await fallbackProvider.generateStructuredCompletion<{ questions: any[] }>(
        prompt,
        systemPrompt
      );
      const fallbackValidation = AIResponseValidator.validateQuestions(fallbackCompletion.data);
      return {
        questions: fallbackValidation.questions,
        provider: fallbackProvider.name,
        model: fallbackProvider.defaultModel,
      };
    }

    return {
      questions: validation.questions,
      provider: completion.provider,
      model: completion.model,
    };
  }

  /**
   * Evaluate a Subjective or Coding Answer
   */
  static async evaluateAnswer(params: {
    question: string;
    expectedConcepts?: string;
    studentAnswer: string;
    maxScore?: number;
    userId?: string;
  }): Promise<any> {
    const systemPrompt = PromptManager.getEvaluationSystemPrompt();
    const prompt = PromptManager.getAnswerEvaluationPrompt(params);

    const completion = await this.executeCompletion<any>({
      prompt,
      systemPrompt,
      feature: 'skill_assessment',
      userId: params.userId,
      options: { temperature: 0.1, maxTokens: 1500 },
    });

    return completion.data;
  }

  /**
   * Analyze Candidate Resume
   */
  static async analyzeResume(params: {
    resumeText: string;
    targetRole?: string;
    targetJobDescription?: string;
    userId?: string;
  }): Promise<any> {
    const systemPrompt = PromptManager.getResumeAnalysisSystemPrompt();
    const prompt = PromptManager.getResumeAnalysisPrompt(params);

    const completion = await this.executeCompletion<any>({
      prompt,
      systemPrompt,
      feature: 'resume_analyzer',
      userId: params.userId,
      options: { temperature: 0.2, maxTokens: 4000 },
    });

    const validation = AIResponseValidator.validateResumeAnalysis(completion.data);
    return validation.analysis;
  }

  /**
   * Semantic Match against Job Description
   */
  static async matchJobDescription(params: {
    resumeText: string;
    jobDescription: string;
    userId?: string;
  }): Promise<any> {
    const systemPrompt = PromptManager.getResumeAnalysisSystemPrompt();
    const prompt = PromptManager.getJobMatchingPrompt(params);

    const completion = await this.executeCompletion<any>({
      prompt,
      systemPrompt,
      feature: 'resume_analyzer',
      userId: params.userId,
      options: { temperature: 0.1, maxTokens: 2000 },
    });

    return completion.data;
  }

  /**
   * Generate Resume Section Improvements
   */
  static async improveResumeSections(params: {
    resumeText: string;
    targetRole?: string;
    targetJobDescription?: string;
    userId?: string;
  }): Promise<any> {
    const systemPrompt = PromptManager.getResumeAnalysisSystemPrompt();
    const prompt = PromptManager.getResumeImprovementPrompt(params);

    const completion = await this.executeCompletion<any>({
      prompt,
      systemPrompt,
      feature: 'resume_analyzer',
      userId: params.userId,
      options: { temperature: 0.2, maxTokens: 3000 },
    });

    return completion.data;
  }
}
