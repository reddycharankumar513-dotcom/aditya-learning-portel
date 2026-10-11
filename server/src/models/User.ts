import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'instructor';
  country?: string;
  educationStatus?: string;
  learningInterests: string[];
  goals?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'instructor'],
      default: 'student',
    },
    country: {
      type: String,
      default: 'India',
    },
    educationStatus: {
      type: String,
      default: 'College Student',
    },
    learningInterests: {
      type: [String],
      default: ['Artificial Intelligence & ML'],
    },
    goals: {
      type: String,
      default: '',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (this.password && this.password.startsWith('$2')) {
    return bcrypt.compare(candidate, this.password);
  }
  return candidate === this.password;
};

export const User = mongoose.model<IUser>('User', UserSchema);
