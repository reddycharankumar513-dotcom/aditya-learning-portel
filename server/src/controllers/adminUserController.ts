import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Enrollment } from '../models/Enrollment.js';
import { Interview } from '../models/Interview.js';
import { Opportunity } from '../models/Opportunity.js';
import { CreditTransaction } from '../models/CreditTransaction.js';
import { Payment } from '../models/Payment.js';
import { auditLogService } from '../services/auditLogService.js';

export const adminUserController = {
  /**
   * GET /api/admin/users/students
   * Paginated student directory with search and plan filters
   */
  async getStudents(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        search = '',
        plan,
        status,
        page = '1',
        limit = '15',
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const query: any = { role: 'student' };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { college: { $regex: search, $options: 'i' } },
        ];
      }

      if (plan && plan !== 'all') {
        query.plan = plan;
      }

      if (status === 'suspended') {
        query.isSuspended = true;
      } else if (status === 'active') {
        query.isSuspended = false;
      }

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 15;
      const skip = (pageNum - 1) * limitNum;

      const [students, total] = await Promise.all([
        User.find(query)
          .select('-password -resetPasswordToken -resetPasswordExpire')
          .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(limitNum),
        User.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        students,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/users/students/:id
   * Complete student profile with academic, interview, and transaction history
   */
  async getStudentById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const student = await User.findById(id).select('-password');

      if (!student || student.role !== 'student') {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      const [enrollments, interviews, creditHistory, payments] = await Promise.all([
        Enrollment.find({ user: id }).populate('course', 'title category level thumbnail'),
        Interview.find({ user: id }).sort({ createdAt: -1 }).limit(10),
        CreditTransaction.find({ user: id }).sort({ createdAt: -1 }).limit(15),
        Payment.find({ user: id }).sort({ createdAt: -1 }).limit(10),
      ]);

      return res.status(200).json({
        success: true,
        student,
        enrollments,
        interviews,
        creditHistory,
        payments,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PATCH /api/admin/users/students/:id/status
   * Activate or suspend student account
   */
  async updateStudentStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isSuspended, suspensionReason } = req.body;

      const student = await User.findById(id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      const beforeStatus = { isSuspended: student.isSuspended, suspensionReason: student.suspensionReason };

      student.isSuspended = Boolean(isSuspended);
      student.suspensionReason = isSuspended ? (suspensionReason || 'Account suspended by administrator.') : '';
      await student.save();

      // Audit Log
      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: isSuspended ? 'USER_SUSPEND' : 'USER_REACTIVATE',
        resourceType: 'User',
        resourceId: id,
        beforeValue: beforeStatus,
        afterValue: { isSuspended: student.isSuspended, suspensionReason: student.suspensionReason },
      });

      return res.status(200).json({
        success: true,
        message: `Student account ${isSuspended ? 'suspended' : 'reactivated'} successfully.`,
        student,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/users/students/:id/adjust-credits
   * Adjust student AI credits with audit logging
   */
  async adjustStudentCredits(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { amount, reason, type = 'grant' } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
      }

      const student = await User.findById(id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      const delta = type === 'grant' ? Number(amount) : -Number(amount);
      const newCredits = Math.max(0, student.credits + delta);
      const oldCredits = student.credits;

      student.credits = newCredits;
      await student.save();

      // Record credit ledger transaction
      await CreditTransaction.create({
        user: student._id,
        amount: Math.abs(delta),
        type: type === 'grant' ? 'purchase' : 'consume',
        feature: 'admin_adjustment',
        description: reason || `Manual adjustment by administrator (${req.user?.email})`,
      });

      // Audit Log
      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'CREDITS_MANUAL_ADJUSTMENT',
        resourceType: 'User',
        resourceId: id,
        beforeValue: { credits: oldCredits },
        afterValue: { credits: newCredits, reason },
      });

      return res.status(200).json({
        success: true,
        message: `Updated student credits from ${oldCredits} to ${newCredits}.`,
        credits: newCredits,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/employers
   * Directory of employer accounts and company verification states
   */
  async getEmployers(req: AuthenticatedRequest, res: Response) {
    try {
      const { search = '', verificationStatus = 'all' } = req.query;

      const query: any = {};
      if (search) {
        query.$or = [
          { companyName: { $regex: search, $options: 'i' } },
          { businessEmail: { $regex: search, $options: 'i' } },
          { industry: { $regex: search, $options: 'i' } },
        ];
      }

      if (verificationStatus === 'verified') {
        query.isVerified = true;
      } else if (verificationStatus === 'pending') {
        query.isVerified = false;
      }

      const companies = await Company.find(query).populate('user', 'name email isSuspended createdAt').sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        companies,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PATCH /api/admin/employers/:id/verification
   * Approve or reject company verification
   */
  async updateEmployerVerification(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isVerified, verificationNotes } = req.body;

      const company = await Company.findById(id);
      if (!company) {
        return res.status(404).json({ success: false, message: 'Company record not found' });
      }

      const beforeValue = { isVerified: company.isVerified };
      company.isVerified = Boolean(isVerified);
      await company.save();

      // Audit Log
      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: isVerified ? 'EMPLOYER_VERIFY_APPROVE' : 'EMPLOYER_VERIFY_REJECT',
        resourceType: 'Company',
        resourceId: id,
        beforeValue,
        afterValue: { isVerified: company.isVerified, verificationNotes },
      });

      return res.status(200).json({
        success: true,
        message: `Company verification ${isVerified ? 'approved' : 'revoked'} successfully.`,
        company,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
