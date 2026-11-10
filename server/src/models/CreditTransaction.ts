import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditTransaction extends Document {
  user: mongoose.Types.ObjectId;
  amount: number; // positive for credit, negative for debit
  reason: 'initial_bonus' | 'payment_purchase' | 'interview_consumption' | 'refund' | 'admin_adjustment';
  referenceId?: string; // paymentId or interviewId
  description: string;
  balanceAfter: number;
  createdAt: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      enum: ['initial_bonus', 'payment_purchase', 'interview_consumption', 'refund', 'admin_adjustment'],
      required: true,
    },
    referenceId: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const CreditTransaction = mongoose.model<ICreditTransaction>(
  'CreditTransaction',
  CreditTransactionSchema
);
