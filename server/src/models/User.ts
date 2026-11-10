import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ISkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified?: boolean;
}

export interface IReadinessBreakdown {
  skillsScore: number;
  interviewScore: number;
  resumeScore: number;
  projectsScore: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'instructor' | 'employer';
  phone?: string;
  college?: string;
  degree?: string;
  department?: string;
  graduationYear?: number;
  country?: string;
  educationStatus?: string;
  learningInterests: string[];
  goals?: string;
  skills: ISkill[];
  careerInterests: string[];
  preferredRoles: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  careerReadinessScore: number;
  readinessBreakdown: IReadinessBreakdown;
  credits: number;
  plan: 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM';
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
      enum: ['student', 'admin', 'instructor', 'employer'],
      default: 'student',
    },
    phone: {
      type: String,
      default: '',
    },
    college: {
      type: String,
      default: 'National Institute of Technology',
    },
    degree: {
      type: String,
      default: 'B.Tech',
    },
    department: {
      type: String,
      default: 'Computer Science and Engineering',
    },
    graduationYear: {
      type: Number,
      default: 2026,
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
      default: ['Artificial Intelligence & ML', 'Full Stack Development'],
    },
    goals: {
      type: String,
      default: 'Targeting Software Engineer & AI Engineer roles at top product companies.',
    },
    skills: {
      type: [
        {
          name: { type: String, required: true },
          proficiency: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Intermediate',
          },
          verified: { type: Boolean, default: false },
        },
      ],
      default: [
        { name: 'JavaScript / TypeScript', proficiency: 'Advanced', verified: true },
        { name: 'React', proficiency: 'Advanced', verified: true },
        { name: 'Node.js & Express', proficiency: 'Intermediate', verified: true },
        { name: 'Python', proficiency: 'Intermediate', verified: false },
        { name: 'Data Structures & Algorithms', proficiency: 'Intermediate', verified: true },
      ],
    },
    careerInterests: {
      type: [String],
      default: ['Full Stack Developer', 'AI / ML Engineer', 'Software Engineer'],
    },
    preferredRoles: {
      type: [String],
      default: ['Software Engineer', 'Frontend Engineer', 'Full Stack Engineer'],
    },
    linkedin: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: '',
    },
    careerReadinessScore: {
      type: Number,
      default: 78,
    },
    readinessBreakdown: {
      skillsScore: { type: Number, default: 80 },
      interviewScore: { type: Number, default: 84 },
      resumeScore: { type: Number, default: 72 },
      projectsScore: { type: Number, default: 76 },
    },
    credits: {
      type: Number,
      default: 5,
    },
    plan: {
      type: String,
      enum: ['FREE', 'STARTER', 'PRO', 'PREMIUM'],
      default: 'FREE',
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
