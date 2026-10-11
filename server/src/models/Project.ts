import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  techStack: string[];
  status: 'In Progress' | 'Completed' | 'Planning';
  repoUrl?: string;
  demoUrl?: string;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
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
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Planning'],
      default: 'In Progress',
    },
    repoUrl: String,
    demoUrl: String,
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
