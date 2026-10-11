import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  internship: mongoose.Types.ObjectId;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Declined';
  resumeUrl?: string;
  notes?: string;
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    internship: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Shortlisted', 'Accepted', 'Declined'],
      default: 'Submitted',
    },
    resumeUrl: String,
    notes: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate application from same user for same opportunity
ApplicationSchema.index({ user: 1, internship: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
