import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillGap {
  skill: string;
  category: string;
  status: 'Strong' | 'Needs Practice' | 'Critical Gap';
  recommendation: string;
}

export interface ITopicPerformance {
  topic: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface ILearningRecommendation {
  topic: string;
  reason: string;
  suggestedResource: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface IAssessmentQuestion {
  id: number;
  question: string;
  skillCategory: string;
  topic: string;
  difficulty: string;
  type: 'mcq_single' | 'mcq_multiple' | 'true_false' | 'scenario' | 'coding_analysis' | 'short_answer';
  options?: string[];
  correctAnswer: any; // Secure answer key stored strictly on backend
  selectedAnswer?: any;
  isCorrect?: boolean;
  marksAwarded?: number;
  explanation: string;
  evaluationCriteria?: string;
  feedback?: string;
  maxMarks: number;
}

export interface IAssessment extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  role: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  status: 'created' | 'in_progress' | 'completed' | 'abandoned';
  questions: IAssessmentQuestion[];
  score: number;
  maxScore: number;
  percentage: number;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  topicBreakdown: ITopicPerformance[];
  skillGaps: ISkillGap[];
  learningRecommendations: ILearningRecommendation[];
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  toSafeStudentView(): any;
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
    role: {
      type: String,
      required: true,
      default: 'Full Stack Developer',
    },
    skill: {
      type: String,
      required: true,
      default: 'Full Stack & Software Engineering',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    status: {
      type: String,
      enum: ['created', 'in_progress', 'completed', 'abandoned'],
      default: 'created',
      index: true,
    },
    questions: [
      {
        id: { type: Number, required: true },
        question: { type: String, required: true },
        skillCategory: { type: String, default: 'General' },
        topic: { type: String, default: 'Fundamentals' },
        difficulty: { type: String, default: 'Intermediate' },
        type: {
          type: String,
          enum: ['mcq_single', 'mcq_multiple', 'true_false', 'scenario', 'coding_analysis', 'short_answer'],
          default: 'mcq_single',
        },
        options: { type: [String], default: [] },
        correctAnswer: { type: Schema.Types.Mixed, required: true }, // Protected backend key
        selectedAnswer: { type: Schema.Types.Mixed },
        isCorrect: { type: Boolean },
        marksAwarded: { type: Number, default: 0 },
        explanation: { type: String, default: '' },
        evaluationCriteria: { type: String, default: '' },
        feedback: { type: String, default: '' },
        maxMarks: { type: Number, default: 2 },
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
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    topicBreakdown: [
      {
        topic: String,
        score: Number,
        maxScore: Number,
        percentage: Number,
      },
    ],
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
    learningRecommendations: [
      {
        topic: String,
        reason: String,
        suggestedResource: String,
        priority: {
          type: String,
          enum: ['High', 'Medium', 'Low'],
          default: 'Medium',
        },
      },
    ],
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Returns a sanitized view for students during an active assessment
 * Strips out correctAnswer and explanation so answers can NEVER be intercepted in DevTools
 */
AssessmentSchema.methods.toSafeStudentView = function () {
  const doc = this.toObject();
  if (doc.status !== 'completed') {
    doc.questions = doc.questions.map((q: any) => {
      const { correctAnswer, explanation, evaluationCriteria, ...safeQuestion } = q;
      return safeQuestion;
    });
  }
  return doc;
};

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
