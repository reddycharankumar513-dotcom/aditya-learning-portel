import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { AIConfig, IAIConfig } from '../models/AIConfig.js';
import { Interview } from '../models/Interview.js';
import { CreditTransaction } from '../models/CreditTransaction.js';
import { auditLogService } from '../services/auditLogService.js';

const DEFAULT_AI_CONFIG = {
  providers: [
    {
      id: 'gemini',
      name: 'Google Gemini',
      model: 'gemini-1.5-pro-latest',
      isActive: true,
      isDefault: true,
      isFallback: false,
      maxTokens: 2048,
      temperature: 0.7,
      timeoutMs: 30000,
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      model: 'claude-3-5-sonnet-20241022',
      isActive: true,
      isDefault: false,
      isFallback: true,
      maxTokens: 2048,
      temperature: 0.7,
      timeoutMs: 30000,
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4o',
      model: 'gpt-4o',
      isActive: false,
      isDefault: false,
      isFallback: false,
      maxTokens: 2048,
      temperature: 0.7,
      timeoutMs: 30000,
    },
  ],
  features: {
    mockInterviews: true,
    learningAssistant: true,
    resumeAnalyzer: true,
    projectMentor: true,
    codingAssistant: true,
  },
  scoringWeights: {
    technicalKnowledge: 30,
    answerRelevance: 20,
    problemSolving: 20,
    communicationClarity: 15,
    answerStructure: 10,
    timeManagement: 5,
  },
  interviewSettings: {
    defaultDurationMinutes: 20,
    defaultQuestionCount: 5,
    defaultDifficulty: 'Fresher / Entry',
    allowCustomRoles: true,
    voiceEnabled: false,
    videoEnabled: false,
    creditCostPerInterview: 1,
  },
  prompts: [
    {
      key: 'interview_evaluator',
      name: 'AI Mock Interview Evaluator System Prompt',
      version: 1,
      content: 'You are Learnova Executive Interview AI. Evaluate student responses across the 6 weighted dimensions. Provide diagnostic feedback and key concepts.',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      key: 'resume_ats_analyzer',
      name: 'Resume ATS & Google XYZ Rewriter Prompt',
      version: 1,
      content: 'Analyze resume text against job description keywords. Extract skills, identify gaps, and rewrite bullet points into Google XYZ formula.',
      isActive: true,
      updatedAt: new Date(),
    },
  ],
};

export const adminAIController = {
  /**
   * GET /api/admin/ai/config
   * Get active AI configuration, seeding defaults if not yet created
   */
  async getAIConfig(req: AuthenticatedRequest, res: Response) {
    try {
      let config = await AIConfig.findOne();

      if (!config) {
        config = await AIConfig.create(DEFAULT_AI_CONFIG);
      }

      return res.status(200).json({ success: true, config });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/ai/providers
   * Update AI providers list, defaults, and timeouts
   */
  async updateAIProviders(req: AuthenticatedRequest, res: Response) {
    try {
      const { providers } = req.body;
      if (!Array.isArray(providers)) {
        return res.status(400).json({ success: false, message: 'Providers must be an array' });
      }

      let config = await AIConfig.findOne();
      if (!config) {
        config = await AIConfig.create(DEFAULT_AI_CONFIG);
      }

      const beforeValue = { providers: config.providers };
      config.providers = providers;
      config.updatedBy = req.user?._id;
      await config.save();

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'AI_PROVIDERS_UPDATE',
        resourceType: 'AIConfig',
        resourceId: config._id.toString(),
        beforeValue,
        afterValue: { providers },
      });

      return res.status(200).json({ success: true, message: 'AI providers updated successfully', config });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/ai/scoring-weights
   * Update scoring rubric weights with validation (must strictly equal 100%)
   */
  async updateScoringWeights(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        technicalKnowledge,
        answerRelevance,
        problemSolving,
        communicationClarity,
        answerStructure,
        timeManagement,
      } = req.body;

      const sum =
        Number(technicalKnowledge) +
        Number(answerRelevance) +
        Number(problemSolving) +
        Number(communicationClarity) +
        Number(answerStructure) +
        Number(timeManagement);

      if (sum !== 100) {
        return res.status(400).json({
          success: false,
          message: `Scoring weights must sum to exactly 100%. Current sum: ${sum}%`,
        });
      }

      let config = await AIConfig.findOne();
      if (!config) {
        config = await AIConfig.create(DEFAULT_AI_CONFIG);
      }

      const beforeValue = { scoringWeights: config.scoringWeights };
      config.scoringWeights = {
        technicalKnowledge: Number(technicalKnowledge),
        answerRelevance: Number(answerRelevance),
        problemSolving: Number(problemSolving),
        communicationClarity: Number(communicationClarity),
        answerStructure: Number(answerStructure),
        timeManagement: Number(timeManagement),
      };
      config.updatedBy = req.user?._id;
      await config.save();

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'AI_SCORING_WEIGHTS_UPDATE',
        resourceType: 'AIConfig',
        resourceId: config._id.toString(),
        beforeValue,
        afterValue: { scoringWeights: config.scoringWeights },
      });

      return res.status(200).json({
        success: true,
        message: 'Scoring weights updated successfully (100% verified)',
        scoringWeights: config.scoringWeights,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/ai/features
   * Toggle AI feature availability
   */
  async updateAIFeatures(req: AuthenticatedRequest, res: Response) {
    try {
      let config = await AIConfig.findOne();
      if (!config) {
        config = await AIConfig.create(DEFAULT_AI_CONFIG);
      }

      const beforeValue = { features: config.features, interviewSettings: config.interviewSettings };
      if (req.body.features) config.features = { ...config.features, ...req.body.features };
      if (req.body.interviewSettings) config.interviewSettings = { ...config.interviewSettings, ...req.body.interviewSettings };

      config.updatedBy = req.user?._id;
      await config.save();

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'AI_SETTINGS_UPDATE',
        resourceType: 'AIConfig',
        resourceId: config._id.toString(),
        beforeValue,
        afterValue: { features: config.features, interviewSettings: config.interviewSettings },
      });

      return res.status(200).json({ success: true, message: 'AI settings updated', config });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/ai/usage
   * Aggregates AI usage stats across mock interviews and credit consumption
   */
  async getAIUsage(req: AuthenticatedRequest, res: Response) {
    try {
      const [interviewsCompleted, interviewsInProgress, categorySplit, creditConsumptions] = await Promise.all([
        Interview.countDocuments({ status: 'completed' }),
        Interview.countDocuments({ status: 'in-progress' }),
        Interview.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 }, avgScore: { $avg: '$overallScore' } } },
        ]),
        CreditTransaction.aggregate([
          { $match: { type: 'consume' } },
          { $group: { _id: '$feature', totalCredits: { $sum: '$amount' } } },
        ]),
      ]);

      return res.status(200).json({
        success: true,
        usage: {
          interviewsCompleted,
          interviewsInProgress,
          categorySplit,
          creditConsumptions,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
