import mongoose, { Document, Schema } from 'mongoose';

export interface ICodingSubmission extends Document {
  user: mongoose.Types.ObjectId;
  problemId: string;
  problemTitle: string;
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'sql';
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  testsPassed: number;
  totalTests: number;
  runtimeMs: number;
  memoryKb?: number;
  createdAt: Date;
}

const CodingSubmissionSchema = new Schema<ICodingSubmission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'sql'],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'],
      required: true,
    },
    testsPassed: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    runtimeMs: {
      type: Number,
      default: 0,
    },
    memoryKb: Number,
  },
  { timestamps: true }
);

export const CodingSubmission = mongoose.model<ICodingSubmission>(
  'CodingSubmission',
  CodingSubmissionSchema
);
