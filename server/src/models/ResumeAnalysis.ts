import mongoose, { Document, Schema } from 'mongoose';

export interface IBulletSuggestion {
  original: string;
  improved: string;
  reason: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface ISectionScores {
  skillsRelevance: number;        // out of 25
  projectsExperience: number;     // out of 20
  experienceInternships: number;  // out of 15
  educationCertifications: number;// out of 10
  resumeStructure: number;        // out of 10
  jobAlignment: number;           // out of 10
  writingQuality: number;         // out of 10
}

export interface IResumeAnalysis extends Document {
  user: mongoose.Types.ObjectId;
  resume?: mongoose.Types.ObjectId;
  fileName: string;
  targetRole: string;
  targetJobDescription?: string;
  overallScore: number;
  atsScore: number;
  sectionScores: ISectionScores;
  matchPercentage: number;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  weaknesses: string[];
  bulletPointSuggestions: IBulletSuggestion[];
  tailoringRecommendations: string[];
  experienceSummary?: string;
  educationSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
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
    overallScore: {
      type: Number,
      required: true,
      default: 75,
    },
    atsScore: {
      type: Number,
      required: true,
      default: 75,
    },
    sectionScores: {
      skillsRelevance: { type: Number, default: 20 },
      projectsExperience: { type: Number, default: 15 },
      experienceInternships: { type: Number, default: 12 },
      educationCertifications: { type: Number, default: 8 },
      resumeStructure: { type: Number, default: 8 },
      jobAlignment: { type: Number, default: 8 },
      writingQuality: { type: Number, default: 8 },
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
    weaknesses: {
      type: [String],
      default: [],
    },
    bulletPointSuggestions: [
      {
        original: String,
        improved: String,
        reason: String,
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
    tailoringRecommendations: {
      type: [String],
      default: [],
    },
    experienceSummary: String,
    educationSummary: String,
  },
  { timestamps: true }
);

export const ResumeAnalysis = mongoose.model<IResumeAnalysis>('ResumeAnalysis', ResumeAnalysisSchema);
