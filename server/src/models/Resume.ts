import mongoose, { Document, Schema } from 'mongoose';

export interface IParsedPersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface IParsedExperience {
  title: string;
  company: string;
  duration?: string;
  bullets: string[];
}

export interface IParsedProject {
  title: string;
  techStack?: string[];
  description?: string;
  bullets: string[];
}

export interface IParsedEducation {
  degree: string;
  institution: string;
  year?: string;
  grade?: string;
}

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey?: string;
  rawText: string;
  targetRole: string;
  targetJobDescription?: string;
  parsedSections: {
    personalInfo: IParsedPersonalInfo;
    summary: string;
    skills: string[];
    experience: IParsedExperience[];
    projects: IParsedProject[];
    education: IParsedEducation[];
    certifications: string[];
  };
  improvedContent?: {
    summary?: string;
    projects?: Array<{ title: string; bullets: string[] }>;
    acceptedSuggestions?: string[];
  };
  latestAnalysis?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      default: 'resume.pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    storageKey: {
      type: String,
    },
    rawText: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      default: 'Full Stack Developer',
    },
    targetJobDescription: {
      type: String,
      default: '',
    },
    parsedSections: {
      personalInfo: {
        name: String,
        email: String,
        phone: String,
        linkedin: String,
        github: String,
        portfolio: String,
        location: String,
      },
      summary: { type: String, default: '' },
      skills: { type: [String], default: [] },
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          bullets: [String],
        },
      ],
      projects: [
        {
          title: String,
          techStack: [String],
          description: String,
          bullets: [String],
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
          grade: String,
        },
      ],
      certifications: { type: [String], default: [] },
    },
    improvedContent: {
      summary: String,
      projects: [
        {
          title: String,
          bullets: [String],
        },
      ],
      acceptedSuggestions: [String],
    },
    latestAnalysis: {
      type: Schema.Types.ObjectId,
      ref: 'ResumeAnalysis',
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
