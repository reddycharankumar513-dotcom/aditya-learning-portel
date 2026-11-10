import mongoose, { Document, Schema } from 'mongoose';

export interface IBulletSuggestion {
  original: string;
  improved: string;
  reason: string;
}

export interface IResumeAnalysis extends Document {
  user: mongoose.Types.ObjectId;
  fileName: string;
  targetRole: string;
  targetJobDescription?: string;
  atsScore: number;
  matchPercentage: number;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  bulletPointSuggestions: IBulletSuggestion[];
  experienceSummary?: string;
  educationSummary?: string;
  createdAt: Date;
}

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: 'resume.pdf',
    },
    targetRole: {
      type: String,
      required: true,
      default: 'Full Stack Developer',
    },
    targetJobDescription: {
      type: String,
      default: '',
    },
    atsScore: {
      type: Number,
      required: true,
      default: 75,
    },
    matchPercentage: {
      type: Number,
      default: 70,
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    bulletPointSuggestions: [
      {
        original: String,
        improved: String,
        reason: String,
      },
    ],
    experienceSummary: String,
    educationSummary: String,
  },
  { timestamps: true }
);

export const ResumeAnalysis = mongoose.model<IResumeAnalysis>('ResumeAnalysis', ResumeAnalysisSchema);
