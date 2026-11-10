import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  businessEmail: string;
  website: string;
  industry: string;
  description: string;
  recruiterName: string;
  designation: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    businessEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      default: 'Information Technology & Software',
    },
    description: {
      type: String,
      default: '',
    },
    recruiterName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      default: 'Technical Hiring Manager',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
