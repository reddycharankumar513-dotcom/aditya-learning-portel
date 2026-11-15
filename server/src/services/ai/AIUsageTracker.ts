import mongoose from 'mongoose';
import { AIUsageLog } from '../../models/AIUsageLog.js';
import { AICompletionResult } from './AIProvider.js';

export class AIUsageTracker {
  /**
   * Log AI request asynchronously to MongoDB
   */
  static async logUsage(params: {
    userId?: string;
    feature: 'skill_assessment' | 'resume_analyzer' | 'interview' | 'coding_mentor' | 'general';
    result: AICompletionResult<any>;
    status?: 'success' | 'failed' | 'fallback';
    errorMessage?: string;
  }): Promise<void> {
    try {
      // Only persist to database if MongoDB connection is open and active
      if (mongoose.connection.readyState !== 1) {
        return;
      }

      await AIUsageLog.create({
        user: params.userId || undefined,
        feature: params.feature,
        provider: params.result.provider,
        aiModel: params.result.model,
        promptTokens: params.result.promptTokens,
        completionTokens: params.result.completionTokens,
        totalTokens: params.result.totalTokens,
        latencyMs: params.result.latencyMs,
        estimatedCostUSD: params.result.estimatedCostUSD,
        status: params.status || 'success',
        errorMessage: params.errorMessage,
      });
    } catch (err: any) {
      // Non-blocking telemetry log error
      console.warn('[AIUsageTracker] Non-critical error recording usage log:', err.message);
    }
  }
}
