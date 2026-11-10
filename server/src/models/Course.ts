import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  id: string;
  title: string;
  duration: string;
  type: 'lecture' | 'exercise' | 'reading';
  content?: string;
}

export interface IAssignment {
  id: string;
  title: string;
  instructions: string;
  starterCode?: string;
}

export interface IModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: ILesson[];
  assignment?: IAssignment;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  iconName: string;
  modules: IModule[];
  learningObjectives: string[];
  prerequisites: string[];
  isPublished: boolean;
  instructorName?: string;
  instructorRole?: string;
  enrolledCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: '6 Weeks',
    },
    iconName: {
      type: String,
      default: 'BookOpen',
    },
    modules: [
      {
        id: String,
        title: String,
        description: String,
        duration: String,
        lessons: [
          {
            id: String,
            title: String,
            duration: String,
            type: {
              type: String,
              enum: ['lecture', 'exercise', 'reading'],
              default: 'lecture',
            },
            content: String,
          },
        ],
        assignment: {
          id: String,
          title: String,
          instructions: String,
          starterCode: String,
        },
      },
    ],
    learningObjectives: {
      type: [String],
      default: [],
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    instructorName: {
      type: String,
      default: 'ADITYA Academic Lead',
    },
    instructorRole: {
      type: String,
      default: 'Senior Technical Instructor',
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
