import mongoose, { Document, Schema } from 'mongoose';

export interface IPlatformSetting extends Document {
  registrationEnabled: boolean;
  studentRegistrationEnabled: boolean;
  employerRegistrationEnabled: boolean;
  emailVerificationRequired: boolean;
  defaultCurrency: string;
  supportedCurrencies: string[];
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maxFileUploadSizeMB: number;
  allowedFileFormats: string[];
  announcementBanner: {
    active: boolean;
    message: string;
    type: 'info' | 'warning' | 'success';
    link?: string;
  };
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const PlatformSettingSchema = new Schema<IPlatformSetting>(
  {
    registrationEnabled: { type: Boolean, default: true },
    studentRegistrationEnabled: { type: Boolean, default: true },
    employerRegistrationEnabled: { type: Boolean, default: true },
    emailVerificationRequired: { type: Boolean, default: false },
    defaultCurrency: { type: String, default: 'INR' },
    supportedCurrencies: { type: [String], default: ['INR', 'USD'] },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'Learnova is undergoing scheduled maintenance. We will be back shortly.' },
    maxFileUploadSizeMB: { type: Number, default: 10 },
    allowedFileFormats: { type: [String], default: ['pdf', 'docx', 'png', 'jpg', 'jpeg'] },
    announcementBanner: {
      active: { type: Boolean, default: false },
      message: { type: String, default: '' },
      type: { type: String, enum: ['info', 'warning', 'success'], default: 'info' },
      link: { type: String, default: '' },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const PlatformSetting = mongoose.model<IPlatformSetting>('PlatformSetting', PlatformSettingSchema);
