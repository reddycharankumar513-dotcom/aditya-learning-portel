import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  progress: number;
  completedModules: string[];
  status: 'active' | 'completed';
  enrolledAt: Date;
  completedAt?: Date;
  lastActivityAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedModules: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollment for same user and course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
