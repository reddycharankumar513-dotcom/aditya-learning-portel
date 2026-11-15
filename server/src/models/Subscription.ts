import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planCode: string;
  billingInterval: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'halted' | 'pending';
  amountINR: number;
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    billingInterval: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'halted', 'pending'],
      default: 'active',
      index: true,
    },
    amountINR: {
      type: Number,
      required: true,
      min: 0,
    },
    razorpaySubscriptionId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, status: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
