import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewQuestion {
  id: number;
  question: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'System Design' | 'Coding' | 'Problem Solving';
  studentAnswer?: string;
  timeSpentSeconds?: number;
  score?: number;
  feedback?: string;
  suggestedAnswer?: string;
  keyConcepts?: string[];
}

export interface ICategoryScores {
  technicalKnowledge: number;
  answerRelevance: number;
  problemSolving: number;
  communicationClarity: number;
  answerStructure: number;
  timeManagement: number;
}

export interface IInterview extends Document {
  user: mongoose.Types.ObjectId;
  role: string;
  experienceLevel: 'Fresher / Entry' | '1-2 Years' | '3+ Years';
  difficulty: 'Standard' | 'Challenging' | 'Expert';
  type: 'Technical' | 'HR' | 'Behavioral' | 'Coding' | 'Role-based' | 'Mixed';
  mode: 'Text' | 'Voice' | 'Video';
  jobDescription?: string;
  durationMinutes: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  questions: IInterviewQuestion[];
  overallScore: number;
  categoryScores: ICategoryScores;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  recommendedPracticeTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      default: 'Full Stack Developer',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher / Entry', '1-2 Years', '3+ Years'],
      default: 'Fresher / Entry',
    },
    difficulty: {
      type: String,
      enum: ['Standard', 'Challenging', 'Expert'],
      default: 'Standard',
    },
    type: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'Coding', 'Role-based', 'Mixed'],
      default: 'Technical',
    },
    mode: {
      type: String,
      enum: ['Text', 'Voice', 'Video'],
      default: 'Text',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      default: 20,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        id: { type: Number, required: true },
        question: { type: String, required: true },
        category: {
          type: String,
          enum: ['Technical', 'HR', 'Behavioral', 'System Design', 'Coding', 'Problem Solving'],
          default: 'Technical',
        },
        studentAnswer: { type: String, default: '' },
        timeSpentSeconds: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
        suggestedAnswer: { type: String, default: '' },
        keyConcepts: { type: [String], default: [] },
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    categoryScores: {
      technicalKnowledge: { type: Number, default: 0 },
      answerRelevance: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      communicationClarity: { type: Number, default: 0 },
      answerStructure: { type: Number, default: 0 },
      timeManagement: { type: Number, default: 0 },
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    missingConcepts: {
      type: [String],
      default: [],
    },
    recommendedPracticeTopics: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
