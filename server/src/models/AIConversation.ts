import mongoose, { Document, Schema } from 'mongoose';

export interface IAIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IAIConversation extends Document {
  user?: mongoose.Types.ObjectId;
  title: string;
  messages: IAIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const AIConversationSchema = new Schema<IAIConversation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      default: 'Technical Discussion',
      trim: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
