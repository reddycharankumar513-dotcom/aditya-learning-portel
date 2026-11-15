import mongoose, { Document, Schema } from 'mongoose';

export interface IAIUsageLog extends Document {
  user?: mongoose.Types.ObjectId;
  feature: 'skill_assessment' | 'resume_analyzer' | 'interview' | 'coding_mentor' | 'general';
  provider: string;
  aiModel: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCostUSD: number;
  status: 'success' | 'failed' | 'fallback';
  errorMessage?: string;
  createdAt: Date;
}

const AIUsageLogSchema = new Schema<IAIUsageLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    feature: {
      type: String,
      required: true,
      enum: ['skill_assessment', 'resume_analyzer', 'interview', 'coding_mentor', 'general'],
      index: true,
    },
    provider: {
      type: String,
      required: true,
    },
    aiModel: {
      type: String,
      required: true,
    },
    promptTokens: {
      type: Number,
      default: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    latencyMs: {
      type: Number,
      default: 0,
    },
    estimatedCostUSD: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'fallback'],
      default: 'success',
      index: true,
    },
    errorMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for telemetry aggregation
AIUsageLogSchema.index({ createdAt: -1 });

export const AIUsageLog = mongoose.model<IAIUsageLog>('AIUsageLog', AIUsageLogSchema);
