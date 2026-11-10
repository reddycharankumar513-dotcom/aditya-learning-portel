import mongoose from 'mongoose';
import { User, IUser } from '../models/User.js';
import { CreditTransaction } from '../models/CreditTransaction.js';

export interface EntitlementCheckResult {
  allowed: boolean;
  reason?: string;
  plan: string;
  credits: number;
}

export const PLAN_FEATURE_MATRIX: Record<string, string[]> = {
  FREE: ['text_interviews', 'basic_assessment', 'basic_resume_scan', 'courses_view'],
  STARTER: ['text_interviews', 'voice_interviews', 'unlimited_resume_scans', 'skill_gaps', 'courses_view'],
  PRO: [
    'text_interviews',
    'voice_interviews',
    'video_interviews',
    'personalized_roadmaps',
    'coding_sandbox',
    'talent_discovery',
    'unlimited_resume_scans',
    'courses_view',
  ],
  PREMIUM: [
    'text_interviews',
    'voice_interviews',
    'video_interviews',
    'personalized_roadmaps',
    'coding_sandbox',
    'talent_discovery',
    'unlimited_resume_scans',
    'human_architecture_review',
    'priority_referrals',
    'courses_view',
  ],
};

export const entitlementService = {
  getUserEntitlements: async (userId: string | mongoose.Types.ObjectId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const plan = user.plan || 'FREE';
    const features = PLAN_FEATURE_MATRIX[plan] || PLAN_FEATURE_MATRIX.FREE;

    return {
      plan,
      credits: user.credits,
      features,
      careerReadinessScore: user.careerReadinessScore,
    };
  },

  checkFeatureAccess: async (
    userId: string | mongoose.Types.ObjectId,
    featureKey: string
  ): Promise<EntitlementCheckResult> => {
    const user = await User.findById(userId);
    if (!user) {
      return { allowed: false, reason: 'User not found', plan: 'FREE', credits: 0 };
    }

    const plan = user.plan || 'FREE';
    const features = PLAN_FEATURE_MATRIX[plan] || PLAN_FEATURE_MATRIX.FREE;

    if (!features.includes(featureKey)) {
      return {
        allowed: false,
        reason: `The feature "${featureKey}" requires the ${featureKey.includes('video') ? 'PRO' : 'STARTER'} plan or above.`,
        plan,
        credits: user.credits,
      };
    }

    return {
      allowed: true,
      plan,
      credits: user.credits,
    };
  },

  getRemainingCredits: async (userId: string | mongoose.Types.ObjectId): Promise<number> => {
    const user = await User.findById(userId);
    return user ? user.credits : 0;
  },

  consumeCredit: async (
    userId: string | mongoose.Types.ObjectId,
    amount: number = 1,
    reason: 'interview_consumption' | 'admin_adjustment',
    referenceId?: string
  ): Promise<{ success: boolean; balanceAfter: number }> => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Unlimited credits for PRO and PREMIUM tiers
    if (user.plan === 'PRO' || user.plan === 'PREMIUM') {
      return { success: true, balanceAfter: user.credits };
    }

    if (user.credits < amount) {
      throw new Error(`Insufficient AI credits. You have ${user.credits} credits remaining.`);
    }

    user.credits -= amount;
    await user.save();

    await CreditTransaction.create({
      user: user._id,
      amount: -amount,
      reason,
      referenceId,
      description: `Consumed ${amount} credit(s) for AI mock interview`,
      balanceAfter: user.credits,
    });

    return { success: true, balanceAfter: user.credits };
  },

  grantEntitlement: async (
    userId: string | mongoose.Types.ObjectId,
    planName?: 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM',
    creditsGranted: number = 0,
    paymentId?: string
  ): Promise<{ success: boolean; newPlan: string; newCredits: number }> => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (planName) {
      user.plan = planName;
    }

    if (creditsGranted > 0) {
      user.credits += creditsGranted;
      await CreditTransaction.create({
        user: user._id,
        amount: creditsGranted,
        reason: 'payment_purchase',
        referenceId: paymentId,
        description: `Purchased ${creditsGranted} AI interview credit(s)`,
        balanceAfter: user.credits,
      });
    }

    await user.save();

    return {
      success: true,
      newPlan: user.plan,
      newCredits: user.credits,
    };
  },
};
