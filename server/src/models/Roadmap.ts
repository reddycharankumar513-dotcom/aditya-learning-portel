import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmapTopic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedHours: number;
  resources: Array<{ title: string; url?: string; type: 'doc' | 'video' | 'exercise' }>;
}

export interface IRoadmapStage {
  id: string;
  title: string;
  level: 'Foundations' | 'Intermediate Architecture' | 'Production Systems' | 'Interview Mastery';
  description: string;
  topics: IRoadmapTopic[];
}

export interface IRoadmap extends Document {
  user: mongoose.Types.ObjectId;
  targetRole: string;
  weeklyHours: number;
  progressPercentage: number;
  stages: IRoadmapStage[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'Full Stack Developer',
    },
    weeklyHours: {
      type: Number,
      default: 10,
    },
    progressPercentage: {
      type: Number,
      default: 25,
    },
    stages: [
      {
        id: String,
        title: String,
        level: {
          type: String,
          enum: ['Foundations', 'Intermediate Architecture', 'Production Systems', 'Interview Mastery'],
        },
        description: String,
        topics: [
          {
            id: String,
            title: String,
            description: String,
            completed: { type: Boolean, default: false },
            estimatedHours: Number,
            resources: [
              {
                title: String,
                url: String,
                type: { type: String, enum: ['doc', 'video', 'exercise'] },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
