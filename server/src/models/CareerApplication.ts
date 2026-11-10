import mongoose, { Document, Schema } from 'mongoose';

export interface ICareerApplication extends Document {
  user: mongoose.Types.ObjectId;
  opportunity: mongoose.Types.ObjectId;
  status: 'saved' | 'applied' | 'assessment' | 'interview' | 'shortlisted' | 'offered' | 'rejected' | 'withdrawn';
  notes?: string;
  interviewDate?: Date;
  matchScore: number;
  matchReason?: string;
  appliedAt?: Date;
  updatedAt: Date;
}

const CareerApplicationSchema = new Schema<ICareerApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    opportunity: {
      type: Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['saved', 'applied', 'assessment', 'interview', 'shortlisted', 'offered', 'rejected', 'withdrawn'],
      default: 'saved',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    interviewDate: Date,
    matchScore: {
      type: Number,
      default: 75,
    },
    matchReason: String,
    appliedAt: Date,
  },
  { timestamps: true }
);

export const CareerApplication = mongoose.model<ICareerApplication>(
  'CareerApplication',
  CareerApplicationSchema
);
