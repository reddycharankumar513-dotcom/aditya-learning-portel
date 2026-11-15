import mongoose, { Document, Schema } from 'mongoose';

export interface IRefund extends Document {
  paymentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amountINR: number;
  reason: string;
  status: 'pending' | 'processed' | 'rejected';
  razorpayRefundId?: string;
  razorpayPaymentId?: string;
  adminId?: mongoose.Types.ObjectId;
  adminNotes?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<IRefund>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amountINR: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'rejected'],
      default: 'pending',
      index: true,
    },
    razorpayRefundId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

RefundSchema.index({ createdAt: -1 });

export const Refund = mongoose.model<IRefund>('Refund', RefundSchema);
