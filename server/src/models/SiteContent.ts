import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteContent extends Document {
  hero: {
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  benefits: Array<{ title: string; description: string; icon: string }>;
  testimonials: Array<{ name: string; role: string; company: string; quote: string; rating: number }>;
  faqs: Array<{ question: string; answer: string; category: string }>;
  footer: {
    tagline: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: { twitter?: string; linkedin?: string; github?: string; youtube?: string };
  };
  legal: {
    termsAndConditions: string;
    privacyPolicy: string;
    refundPolicy: string;
  };
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    hero: {
      headline: { type: String, default: 'Your Future Starts With What You Learn Today.' },
      subheadline: { type: String, default: 'Learn smarter. Practice with AI. Build your skills. Prepare for your dream career with Learnova.' },
      primaryCtaText: { type: String, default: 'Start Learning Free' },
      secondaryCtaText: { type: String, default: 'Explore AI Interviews' },
    },
    benefits: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: 'Sparkles' },
      },
    ],
    testimonials: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        company: { type: String, required: true },
        quote: { type: String, required: true },
        rating: { type: Number, default: 5 },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        category: { type: String, default: 'General' },
      },
    ],
    footer: {
      tagline: { type: String, default: 'Learn. Build. Prove. Get Hired.' },
      contactEmail: { type: String, default: 'support@learnova.in' },
      contactPhone: { type: String, default: '+91 98765 43210' },
      address: { type: String, default: 'Tech Hub, Hyderabad, India' },
      socialLinks: {
        twitter: { type: String, default: 'https://twitter.com/learnova_ai' },
        linkedin: { type: String, default: 'https://linkedin.com/company/learnova' },
        github: { type: String, default: 'https://github.com/reddycharankumar513-dotcom' },
        youtube: { type: String, default: '' },
      },
    },
    legal: {
      termsAndConditions: { type: String, default: 'Standard terms of educational use and career platform.' },
      privacyPolicy: { type: String, default: 'Learnova privacy commitment and student data confidentiality.' },
      refundPolicy: { type: String, default: '7-day money-back guarantee for unused course subscriptions and credit packs.' },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
