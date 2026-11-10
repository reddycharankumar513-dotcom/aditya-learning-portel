import mongoose, { Document, Schema } from 'mongoose';

export interface IOpportunity extends Document {
  title: string;
  company: string;
  companyLogo?: string;
  category: 'Internship' | 'Full-time' | 'Graduate Program' | 'Entry-level';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  experienceLevel: 'Fresher / Entry' | '1-2 Years' | '3+ Years';
  description: string;
  requiredSkills: string[];
  compensation?: string;
  applicationDeadline: Date;
  applicationUrl?: string;
  isVerified: boolean;
  postedByEmployer?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: String,
    category: {
      type: String,
      enum: ['Internship', 'Full-time', 'Graduate Program', 'Entry-level'],
      default: 'Internship',
      index: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote',
    },
    location: {
      type: String,
      default: 'India / Remote',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher / Entry', '1-2 Years', '3+ Years'],
      default: 'Fresher / Entry',
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: {
      type: [String],
      required: true,
      index: true,
    },
    compensation: {
      type: String,
      default: '₹25,000 - ₹45,000 / month',
    },
    applicationDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    applicationUrl: String,
    isVerified: {
      type: Boolean,
      default: true,
    },
    postedByEmployer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
