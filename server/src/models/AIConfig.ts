import mongoose, { Document, Schema } from 'mongoose';

export interface IAIProvider {
  id: string;
  name: string;
  model: string;
  isActive: boolean;
  isDefault: boolean;
  isFallback: boolean;
  maxTokens: number;
  temperature: number;
  timeoutMs: number;
}

export interface IAIScoringWeights {
  technicalKnowledge: number;
  answerRelevance: number;
  problemSolving: number;
  communicationClarity: number;
  answerStructure: number;
  timeManagement: number;
}

export interface IAIPrompt {
  key: string;
  name: string;
  version: number;
  content: string;
  isActive: boolean;
  updatedAt: Date;
}

export interface IAIConfig extends Document {
  providers: IAIProvider[];
  features: {
    mockInterviews: boolean;
    learningAssistant: boolean;
    resumeAnalyzer: boolean;
    projectMentor: boolean;
    codingAssistant: boolean;
  };
  scoringWeights: IAIScoringWeights;
  interviewSettings: {
    defaultDurationMinutes: number;
    defaultQuestionCount: number;
    defaultDifficulty: string;
    allowCustomRoles: boolean;
    voiceEnabled: boolean;
    videoEnabled: boolean;
    creditCostPerInterview: number;
  };
  prompts: IAIPrompt[];
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const AIConfigSchema = new Schema<IAIConfig>(
  {
    providers: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        model: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        isDefault: { type: Boolean, default: false },
        isFallback: { type: Boolean, default: false },
        maxTokens: { type: Number, default: 2048 },
        temperature: { type: Number, default: 0.7 },
        timeoutMs: { type: Number, default: 30000 },
      },
    ],
    features: {
      mockInterviews: { type: Boolean, default: true },
      learningAssistant: { type: Boolean, default: true },
      resumeAnalyzer: { type: Boolean, default: true },
      projectMentor: { type: Boolean, default: true },
      codingAssistant: { type: Boolean, default: true },
    },
    scoringWeights: {
      technicalKnowledge: { type: Number, default: 30 },
      answerRelevance: { type: Number, default: 20 },
      problemSolving: { type: Number, default: 20 },
      communicationClarity: { type: Number, default: 15 },
      answerStructure: { type: Number, default: 10 },
      timeManagement: { type: Number, default: 5 },
    },
    interviewSettings: {
      defaultDurationMinutes: { type: Number, default: 20 },
      defaultQuestionCount: { type: Number, default: 5 },
      defaultDifficulty: { type: String, default: 'Fresher / Entry' },
      allowCustomRoles: { type: Boolean, default: true },
      voiceEnabled: { type: Boolean, default: false },
      videoEnabled: { type: Boolean, default: false },
      creditCostPerInterview: { type: Number, default: 1 },
    },
    prompts: [
      {
        key: { type: String, required: true },
        name: { type: String, required: true },
        version: { type: Number, default: 1 },
        content: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const AIConfig = mongoose.model<IAIConfig>('AIConfig', AIConfigSchema);
