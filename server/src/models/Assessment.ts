import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillGap {
  skill: string;
  category: string;
  status: 'Strong' | 'Needs Practice' | 'Critical Gap';
  recommendation: string;
}

export interface IAssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  isCorrect?: boolean;
  explanation: string;
}

export interface IAssessment extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  domain: string;
  questions: IAssessmentQuestion[];
  score: number;
  maxScore: number;
  percentage: number;
  skillGaps: ISkillGap[];
  completedAt: Date;
  createdAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
      default: 'Full Stack & AI Development',
    },
    questions: [
      {
        id: { type: Number, required: true },
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true },
        selectedAnswer: { type: Number },
        isCorrect: { type: Boolean },
        explanation: { type: String, default: '' },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 10,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    skillGaps: [
      {
        skill: String,
        category: String,
        status: {
          type: String,
          enum: ['Strong', 'Needs Practice', 'Critical Gap'],
        },
        recommendation: String,
      },
    ],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
