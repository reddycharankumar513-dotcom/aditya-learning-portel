import mongoose, { Document, Schema } from 'mongoose';

export interface IBroadcastNotification extends Document {
  title: string;
  message: string;
  type: 'announcement' | 'feature' | 'maintenance' | 'offer';
  targetRole: 'all' | 'student' | 'employer';
  targetPlan?: 'all' | 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM';
  sentBy: mongoose.Types.ObjectId;
  recipientCount: number;
  deliveryChannel: 'in_app' | 'email' | 'both';
  createdAt: Date;
}

const BroadcastNotificationSchema = new Schema<IBroadcastNotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['announcement', 'feature', 'maintenance', 'offer'],
      default: 'announcement',
    },
    targetRole: {
      type: String,
      enum: ['all', 'student', 'employer'],
      default: 'all',
    },
    targetPlan: {
      type: String,
      enum: ['all', 'FREE', 'STARTER', 'PRO', 'PREMIUM'],
      default: 'all',
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    deliveryChannel: {
      type: String,
      enum: ['in_app', 'email', 'both'],
      default: 'in_app',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const BroadcastNotification = mongoose.model<IBroadcastNotification>(
  'BroadcastNotification',
  BroadcastNotificationSchema
);
