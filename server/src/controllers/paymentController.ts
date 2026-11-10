import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { ENV } from '../config/env.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { entitlementService } from '../services/entitlementService.js';

// Available Student & Credit Products
export const CATALOG_PRODUCTS = {
  plans: {
    STARTER: {
      id: 'plan_starter_monthly',
      name: 'Starter',
      tier: 'STARTER' as const,
      price: 199,
      interval: 'monthly',
      credits: 25,
      description: '25 AI Mock Interview Drills with Voice Mode & Unlimited ATS Scans',
    },
    PRO: {
      id: 'plan_pro_monthly',
      name: 'Pro Career',
      tier: 'PRO' as const,
      price: 399,
      interval: 'monthly',
      credits: 999, // unlimited
      description: 'Unlimited AI Drills, Video Beta, Personalized Roadmaps & Recruiter Reach',
    },
    PREMIUM: {
      id: 'plan_premium_monthly',
      name: 'Premium Career',
      tier: 'PREMIUM' as const,
      price: 699,
      interval: 'monthly',
      credits: 999,
      description: '1-on-1 Human Architecture Review & Direct Hiring Partner Referrals',
    },
  },
  creditPacks: {
    PACK_10: {
      id: 'pack_10_credits',
      name: '10 Interview Credits Pack',
      price: 149,
      credits: 10,
      description: '10 Additional AI Mock Interview Drills (Valid for 1 year)',
    },
    PACK_25: {
      id: 'pack_25_credits',
      name: '25 Interview Credits Pack',
      price: 299,
      credits: 25,
      description: '25 Additional AI Mock Interview Drills (Valid for 1 year)',
    },
  },
};

// Initialize Razorpay client with fallback handling
let razorpayInstance: Razorpay | null = null;
try {
  razorpayInstance = new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET,
  });
} catch (err: any) {
  console.warn('[Razorpay Notice]: Operating in development test mode:', err.message);
}

export const getPricingCatalog = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    currency: 'INR',
    plans: Object.values(CATALOG_PRODUCTS.plans),
    creditPacks: Object.values(CATALOG_PRODUCTS.creditPacks),
    keyId: ENV.RAZORPAY_KEY_ID,
  });
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { itemType, itemId } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Find requested product
    let product: any = null;
    let creditsGranted = 0;

    if (itemType === 'plan_subscription') {
      product = Object.values(CATALOG_PRODUCTS.plans).find((p) => p.id === itemId);
      if (product) creditsGranted = product.credits;
    } else if (itemType === 'credit_pack') {
      product = Object.values(CATALOG_PRODUCTS.creditPacks).find((p) => p.id === itemId);
      if (product) creditsGranted = product.credits;
    }

    if (!product) {
      res.status(400).json({ message: 'Invalid product or tier requested.' });
      return;
    }

    const amountInPaise = product.price * 100;
    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let razorpayOrderId = `order_test_${Date.now()}`;

    // Create Razorpay Order via SDK if configured, or use authenticated test order
    if (razorpayInstance && ENV.RAZORPAY_KEY_ID.startsWith('rzp_live')) {
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          userId: userId.toString(),
          itemType,
          itemId,
        },
      });
      razorpayOrderId = order.id;
    }

    // Persist pending payment in database
    const payment = await Payment.create({
      user: userId,
      razorpayOrderId,
      amount: product.price,
      currency: 'INR',
      status: 'pending',
      itemType,
      itemId,
      itemTitle: product.name,
      priceSnapshot: product.price,
      creditsGranted,
      receiptId,
    });

    res.status(201).json({
      success: true,
      order: {
        id: razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        keyId: ENV.RAZORPAY_KEY_ID,
        itemTitle: product.name,
        priceRupees: product.price,
      },
      paymentId: payment._id,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error initiating Razorpay order', error: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      res.status(400).json({ message: 'Missing payment verification credentials.' });
      return;
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      res.status(404).json({ message: 'Payment order record not found.' });
      return;
    }

    // Ownership check
    if (payment.user.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Unauthorized payment verification attempt.' });
      return;
    }

    // Already succeeded check (Idempotency)
    if (payment.status === 'success') {
      res.json({
        success: true,
        message: 'Payment already verified and entitlements active.',
        payment,
      });
      return;
    }

    // Cryptographic HMAC SHA-256 Signature Verification
    let isValid = false;
    if (razorpaySignature) {
      const expectedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isValid = expectedSignature === razorpaySignature;
    }

    // In test mode, allow verification with proper warning if running simulated test checkout
    if (!isValid && (razorpayOrderId.startsWith('order_test_') || ENV.RAZORPAY_KEY_ID.includes('test'))) {
      isValid = true;
    }

    if (!isValid) {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ message: 'Invalid Razorpay signature. Verification failed.' });
      return;
    }

    // Authoritative payment confirmed: Update state and grant entitlements
    payment.status = 'success';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature || 'verified_test_signature';
    await payment.save();

    // Grant user plan or credits
    if (payment.itemType === 'plan_subscription') {
      const plan = Object.values(CATALOG_PRODUCTS.plans).find((p) => p.id === payment.itemId);
      if (plan) {
        await entitlementService.grantEntitlement(
          userId,
          plan.tier,
          plan.credits,
          payment._id.toString()
        );
      }
    } else if (payment.itemType === 'credit_pack') {
      await entitlementService.grantEntitlement(
        userId,
        undefined,
        payment.creditsGranted,
        payment._id.toString()
      );
    }

    const entitlements = await entitlementService.getUserEntitlements(userId);

    res.json({
      success: true,
      message: 'Payment verified successfully! Entitlements granted.',
      payment,
      entitlements,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyStr = JSON.stringify(req.body);

    if (signature) {
      const expected = crypto
        .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
        .update(bodyStr)
        .digest('hex');

      if (expected !== signature) {
        res.status(400).json({ message: 'Invalid webhook signature.' });
        return;
      }
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const entity = req.body.payload?.payment?.entity;
      const orderId = entity?.order_id;

      if (orderId) {
        const payment = await Payment.findOne({ razorpayOrderId: orderId });
        if (payment && payment.status !== 'success') {
          payment.status = 'success';
          payment.razorpayPaymentId = entity.id;
          await payment.save();

          await entitlementService.grantEntitlement(
            payment.user,
            undefined,
            payment.creditsGranted,
            payment._id.toString()
          );
        }
      }
    }

    res.json({ status: 'ok', received: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Webhook processing error', error: error.message });
  }
};

export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving payments', error: error.message });
  }
};
