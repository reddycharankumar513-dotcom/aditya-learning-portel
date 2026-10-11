import mongoose, { Document, Schema } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  subject: string;
  category: 'General Inquiry' | 'Courses' | 'Technical Support' | 'Partnerships' | 'Career Opportunities';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['General Inquiry', 'Courses', 'Technical Support', 'Partnerships', 'Career Opportunities'],
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const ContactInquiry = mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
