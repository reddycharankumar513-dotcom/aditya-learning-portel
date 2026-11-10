import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  title: string;
  type: 'Technical Internship' | 'Apprenticeship' | 'Research Fellow' | 'Training Program';
  description: string;
  skills: string[];
  eligibility: string;
  duration: string;
  location: string;
  deadline: string;
  isPublished: boolean;
  createdAt: Date;
}

const InternshipSchema = new Schema<IInternship>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Technical Internship', 'Apprenticeship', 'Research Fellow', 'Training Program'],
      default: 'Technical Internship',
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      default: 'Enrolled in an ADITYA technical track',
    },
    duration: {
      type: String,
      default: '8-12 Weeks',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    deadline: {
      type: String,
      default: 'Rolling',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Internship = mongoose.model<IInternship>('Internship', InternshipSchema);
