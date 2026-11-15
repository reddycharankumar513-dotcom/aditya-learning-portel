import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  code: string;
  name: string;
  monthlyPriceINR: number;
  yearlyPriceINR: number;
  description: string;
  features: string[];
  trialDays: number;
  interviewCredits: number;
  voiceInterviewEnabled: boolean;
  videoInterviewEnabled: boolean;
  resumeAnalysisLimit: number;
  courseAccess: 'free_only' | 'standard' | 'all';
  isActive: boolean;
  isPopular: boolean;
  discountPercentage: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    monthlyPriceINR: {
      type: Number,
      required: true,
      min: 0,
    },
    yearlyPriceINR: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    trialDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    interviewCredits: {
      type: Number,
      default: 5,
      min: 0,
    },
    voiceInterviewEnabled: {
      type: Boolean,
      default: false,
    },
    videoInterviewEnabled: {
      type: Boolean,
      default: false,
    },
    resumeAnalysisLimit: {
      type: Number,
      default: 3,
      min: 0,
    },
    courseAccess: {
      type: String,
      enum: ['free_only', 'standard', 'all'],
      default: 'free_only',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Plan = mongoose.model<IPlan>('Plan', PlanSchema);
