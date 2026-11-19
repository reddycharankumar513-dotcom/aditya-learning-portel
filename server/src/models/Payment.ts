import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  staffId?: mongoose.Types.ObjectId;
  customerName?: string;
  customerPhone?: string;
  paymentSource?: 'web' | 'mobile';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number; // in INR rupees
  amountInPaise?: number; // in paise (amount * 100)
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  itemType: 'plan_subscription' | 'credit_pack' | 'course' | 'mobile_collection' | 'custom_payment';
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
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    paymentSource: {
      type: String,
      enum: ['web', 'mobile'],
      default: 'web',
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
    amountInPaise: {
      type: Number,
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
      enum: ['plan_subscription', 'credit_pack', 'course', 'mobile_collection', 'custom_payment'],
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
