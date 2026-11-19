import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const staffLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').toString().trim().toLowerCase();

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide staff email/username and password.',
      });
      return;
    }

    // Lookup staff by email or name
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: new RegExp(`^${identifier}$`, 'i') },
      ],
    }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Staff account not found.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
      return;
    }

    // Role-based verification: strictly restrict to staff or admin
    const isAuthorizedStaff =
      user.role === 'staff' ||
      user.role === 'admin' ||
      Boolean(user.adminRole);

    if (!isAuthorizedStaff) {
      res.status(403).json({
        success: false,
        message: 'Access restricted to authorized Learnova staff and administrators.',
      });
      return;
    }

    // Record last login timestamp
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Staff authenticated successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRole: user.adminRole,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during staff authentication.',
    });
  }
};

export const getStaffProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    // Quick stats on collections by this staff member
    const [totalCollections, count] = await Promise.all([
      Payment.aggregate([
        { $match: { staffId: req.user._id, status: 'success' } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
      ]),
      Payment.countDocuments({ staffId: req.user._id, status: 'success' }),
    ]);

    res.json({
      success: true,
      staff: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        adminRole: req.user.adminRole,
      },
      stats: {
        totalCollectedRupees: totalCollections[0]?.totalAmount || 0,
        successfulTransactions: count,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffCollections = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const payments = await Payment.find({
      $or: [{ staffId: req.user._id }, { user: req.user._id, paymentSource: 'mobile' }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      payments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
