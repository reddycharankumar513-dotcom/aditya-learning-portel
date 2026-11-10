import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number; // in INR rupees
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  itemType: 'plan_subscription' | 'credit_pack' | 'course';
  itemId: string;
  itemTitle: string;
  priceSnapshot: number;
  creditsGranted: number;
  receiptId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySignature: String,
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    itemType: {
      type: String,
      enum: ['plan_subscription', 'credit_pack', 'course'],
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    priceSnapshot: {
      type: Number,
      required: true,
    },
    creditsGranted: {
      type: Number,
      default: 0,
    },
    receiptId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
