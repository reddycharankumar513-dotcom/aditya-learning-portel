import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const signToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, country, educationStatus, learningInterests } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required fields.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email address already exists.' });
      return;
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      country: country || 'India',
      educationStatus: educationStatus || 'College Student',
      learningInterests: Array.isArray(learningInterests) && learningInterests.length > 0
        ? learningInterests
        : ['Artificial Intelligence & ML'],
      role: 'student', // Never allow self-assignment of admin role
    });

    const token = signToken(newUser);

    // Return user without password
    const userJson = newUser.toObject();
    delete (userJson as any).password;

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: userJson,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide both email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const token = signToken(user);
    const userJson = user.toObject();
    delete (userJson as any).password;

    res.json({
      message: 'Logged in successfully.',
      token,
      user: userJson,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error during login.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' });
    return;
  }
  res.json({ user: req.user });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' });
    return;
  }

  try {
    const { name, country, educationStatus, learningInterests, goals } = req.body;

    if (name) req.user.name = name;
    if (country) req.user.country = country;
    if (educationStatus) req.user.educationStatus = educationStatus;
    if (goals !== undefined) req.user.goals = goals;
    if (Array.isArray(learningInterests)) req.user.learningInterests = learningInterests;

    await req.user.save();

    res.json({
      message: 'Profile updated successfully.',
      user: req.user,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update profile.' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Please provide your email address.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return generic message for security to avoid account enumeration
      res.json({
        message: 'If an account exists with this email, reset instructions and token have been issued.',
      });
      return;
    }

    // Generate secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Password reset token generated. Use this token to set a new password.',
      resetToken, // Returned for dev testing convenience
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error processing reset request.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: 'Reset token and new password are required.' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired password reset token.' });
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You may now log in with your new credentials.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error resetting password.' });
  }
};
