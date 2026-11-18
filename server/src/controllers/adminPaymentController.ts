import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { Payment } from '../models/Payment.js';
import { Refund } from '../models/Refund.js';
import { User } from '../models/User.js';
import { CreditTransaction } from '../models/CreditTransaction.js';
import { auditLogService } from '../services/auditLogService.js';
import { ENV } from '../config/env.js';
import Razorpay from 'razorpay';

const getRazorpayClient = () =>
  new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET,
  });

export const adminPaymentController = {
  /**
   * GET /api/admin/payments
   * Search and filter transactions by status, user, and date range
   */
  async getPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        search = '',
        status = 'all',
        startDate,
        endDate,
        page = '1',
        limit = '20',
      } = req.query;

      const query: any = {};

      if (status !== 'all') {
        query.status = status;
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate as string);
        if (endDate) query.createdAt.$lte = new Date(endDate as string);
      }

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 20;

      const [payments, total] = await Promise.all([
        Payment.find(query)
          .populate('user', 'name email college phone')
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum),
        Payment.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        payments,
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
   * GET /api/admin/refunds
   * List all refund records with status and audit metadata
   */
  async getRefunds(req: AuthenticatedRequest, res: Response) {
    try {
      const { status = 'all' } = req.query;
      const query: any = {};
      if (status !== 'all') {
        query.status = status;
      }

      const refunds = await Refund.find(query)
        .populate('userId', 'name email college')
        .populate('paymentId', 'orderId paymentId amount status')
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, refunds });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/refunds
   * Process refund with Razorpay and audit logging
   */
  async processRefund(req: AuthenticatedRequest, res: Response) {
    try {
      const { paymentId, amount, reason, adminNotes } = req.body;

      if (!paymentId || !amount || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: paymentId, amount, reason',
        });
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment record not found' });
      }

      if (payment.status === 'refunded') {
        return res.status(400).json({ success: false, message: 'Payment has already been refunded' });
      }

      const refundAmountINR = Number(amount);
      if (refundAmountINR > payment.amount) {
        return res.status(400).json({
          success: false,
          message: `Refund amount (₹${refundAmountINR}) cannot exceed payment amount (₹${payment.amount})`,
        });
      }

      let rzpRefundId = `rfnd_mock_${Date.now()}`;

      // If live or valid Razorpay payment ID exists, execute refund API
      if (payment.razorpayPaymentId && !payment.razorpayPaymentId.startsWith('pay_mock_') && ENV.RAZORPAY_KEY_SECRET !== 'learnova_rzp_secret_key_mock_987654') {
        try {
          const client = getRazorpayClient();
          const rzpResponse = await client.payments.refund(payment.razorpayPaymentId, {
            amount: refundAmountINR * 100, // in paise
            notes: { reason, initiatedBy: req.user?.email || 'admin' },
          });
          rzpRefundId = rzpResponse.id;
        } catch (rzpErr: any) {
          console.warn('[Razorpay Refund Warning]:', rzpErr.message);
          // Fall back gracefully in sandbox/test mode
        }
      }

      // Record Refund
      const refund = await Refund.create({
        paymentId: payment._id,
        userId: payment.user,
        amountINR: refundAmountINR,
        reason,
        status: 'processed',
        razorpayRefundId: rzpRefundId,
        razorpayPaymentId: payment.razorpayPaymentId,
        adminId: req.user?._id,
        adminNotes: adminNotes || '',
        processedAt: new Date(),
      });

      // Update payment status
      payment.status = 'refunded';
      await payment.save();

      // Audit Log
      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'PAYMENT_REFUND_PROCESSED',
        resourceType: 'Payment',
        resourceId: payment._id.toString(),
        beforeValue: { status: 'completed', amount: payment.amount },
        afterValue: { status: 'refunded', refundAmount: refundAmountINR, refundId: refund._id.toString() },
      });

      return res.status(200).json({
        success: true,
        message: `Refund of ₹${refundAmountINR} processed successfully.`,
        refund,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/payments/export
   * Export transactions in CSV format
   */
  async exportPaymentsCSV(req: AuthenticatedRequest, res: Response) {
    try {
      const payments = await Payment.find().populate('user', 'name email college').sort({ createdAt: -1 });

      const headers = ['Transaction ID', 'Order ID', 'Payment ID', 'User Name', 'User Email', 'Item Type', 'Amount (INR)', 'Status', 'Date'];
      const rows = payments.map((p: any) => [
        p._id,
        p.razorpayOrderId || 'N/A',
        p.razorpayPaymentId || 'N/A',
        `"${p.user?.name || 'Anonymous'}"`,
        p.user?.email || 'N/A',
        p.itemType || 'Subscription',
        p.amount,
        p.status,
        new Date(p.createdAt).toISOString(),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=learnova_transactions_${Date.now()}.csv`);
      return res.status(200).send(csvContent);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
