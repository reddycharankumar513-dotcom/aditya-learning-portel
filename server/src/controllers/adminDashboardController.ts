import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { Interview } from '../models/Interview.js';
import { Opportunity } from '../models/Opportunity.js';
import { CareerApplication } from '../models/CareerApplication.js';
import { Payment } from '../models/Payment.js';
import { Refund } from '../models/Refund.js';
import { Subscription } from '../models/Subscription.js';
import { CreditTransaction } from '../models/CreditTransaction.js';

export const adminDashboardController = {
  /**
   * GET /api/admin/dashboard/stats
   * Aggregates real platform statistics from MongoDB
   */
  async getDashboardStats(req: Request, res: Response) {
    try {
      const { timeframe = '30d' } = req.query;

      // Calculate start date based on timeframe filter
      let startDate = new Date();
      if (timeframe === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (timeframe === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeframe === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (timeframe === '90d') {
        startDate.setDate(startDate.getDate() - 90);
      } else if (timeframe === '1y') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      } else {
        startDate = new Date(0); // All time
      }

      const [
        totalStudents,
        activeStudents,
        totalEmployers,
        verifiedEmployers,
        totalAdmins,
        freeUsers,
        paidSubscribers,
        activeSubscriptions,
        cancelledSubscriptions,
        paymentStats,
        refundStats,
        totalCourses,
        totalEnrollments,
        interviewsCompleted,
        creditsConsumed,
        activeJobs,
        totalApplications,
      ] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'student', isSuspended: false }),
        Company.countDocuments(),
        Company.countDocuments({ isVerified: true }),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ role: 'student', plan: 'FREE' }),
        User.countDocuments({ role: 'student', plan: { $ne: 'FREE' } }),
        Subscription.countDocuments({ status: 'active' }),
        Subscription.countDocuments({ status: 'cancelled' }),

        // Payments aggregate
        Payment.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
            },
          },
        ]),

        // Refund aggregate
        Refund.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amountINR' },
            },
          },
        ]),

        Course.countDocuments(),
        Enrollment.countDocuments(),
        Interview.countDocuments({ status: 'completed' }),
        CreditTransaction.aggregate([
          { $match: { type: 'consume' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Opportunity.countDocuments({ status: 'active' }),
        CareerApplication.countDocuments(),
      ]);

      // Calculate total revenue and payment counts
      let totalRevenueINR = 0;
      let successfulPayments = 0;
      let failedPayments = 0;

      paymentStats.forEach((p) => {
        if (p._id === 'completed' || p._id === 'success') {
          totalRevenueINR += p.totalAmount;
          successfulPayments += p.count;
        } else if (p._id === 'failed') {
          failedPayments += p.count;
        }
      });

      // Calculate monthly recurring revenue (MRR)
      const activeMonthlySubs = await Subscription.find({ status: 'active' });
      let mrrINR = 0;
      activeMonthlySubs.forEach((sub) => {
        if (sub.billingInterval === 'yearly') {
          mrrINR += Math.round(sub.amountINR / 12);
        } else {
          mrrINR += sub.amountINR;
        }
      });

      // Total refunds
      const totalRefundsCount = refundStats.reduce((acc, curr) => acc + curr.count, 0);
      const totalRefundsINR = refundStats
        .filter((r) => r._id === 'processed')
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

      // 7-day registration trend
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentRegistrations = await User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            students: {
              $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] },
            },
            employers: {
              $sum: { $cond: [{ $eq: ['$role', 'employer'] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          users: {
            totalStudents,
            activeStudents,
            totalEmployers,
            verifiedEmployers,
            totalAdmins,
            freeUsers,
            paidSubscribers,
          },
          subscriptions: {
            activeSubscriptions,
            cancelledSubscriptions,
            mrrINR,
          },
          financials: {
            totalRevenueINR,
            successfulPayments,
            failedPayments,
            refundsCount: totalRefundsCount,
            refundsAmountINR: totalRefundsINR,
          },
          learning: {
            totalCourses,
            totalEnrollments,
            interviewsCompleted,
            creditsConsumed: creditsConsumed[0]?.total || 0,
          },
          recruitment: {
            activeJobs,
            totalApplications,
          },
          recentTrends: recentRegistrations,
        },
      });
    } catch (err: any) {
      console.error('[Admin Dashboard Error]:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to aggregate dashboard analytics',
      });
    }
  },
};
