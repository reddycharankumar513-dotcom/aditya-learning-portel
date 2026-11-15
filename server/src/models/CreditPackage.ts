import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditPackage extends Document {
  name: string;
  quantity: number;
  priceINR: number;
  promotionalPriceINR?: number;
  validityDays: number;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CreditPackageSchema = new Schema<ICreditPackage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceINR: {
      type: Number,
      required: true,
      min: 0,
    },
    promotionalPriceINR: {
      type: Number,
      min: 0,
    },
    validityDays: {
      type: Number,
      default: 90,
      min: 1,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const CreditPackage = mongoose.model<ICreditPackage>('CreditPackage', CreditPackageSchema);
