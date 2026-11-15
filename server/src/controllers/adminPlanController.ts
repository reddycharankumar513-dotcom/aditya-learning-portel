import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { Plan, IPlan } from '../models/Plan.js';
import { CreditPackage } from '../models/CreditPackage.js';
import { Subscription } from '../models/Subscription.js';
import { auditLogService } from '../services/auditLogService.js';

const DEFAULT_PLANS: Array<Partial<IPlan>> = [
  {
    code: 'FREE',
    name: 'Explorer Free',
    monthlyPriceINR: 0,
    yearlyPriceINR: 0,
    description: 'Essential platform foundation with introductory AI mock interviews.',
    features: ['5 Initial AI Credits', 'Basic Skill Assessments', 'Standard Resume ATS Scan', 'Public Community Access'],
    trialDays: 0,
    interviewCredits: 5,
    voiceInterviewEnabled: false,
    videoInterviewEnabled: false,
    resumeAnalysisLimit: 2,
    courseAccess: 'free_only',
    isActive: true,
    isPopular: false,
    sortOrder: 1,
  },
  {
    code: 'STARTER',
    name: 'Career Starter',
    monthlyPriceINR: 199,
    yearlyPriceINR: 1999,
    description: 'Accelerated job preparation for students and fresh college graduates.',
    features: ['20 Monthly AI Credits', 'Full Engineering Question Banks', 'Voice AI Interviews', 'Personalized Roadmap Generator', 'ATS Resume Keyword Matching'],
    trialDays: 7,
    interviewCredits: 20,
    voiceInterviewEnabled: true,
    videoInterviewEnabled: false,
    resumeAnalysisLimit: 10,
    courseAccess: 'standard',
    isActive: true,
    isPopular: false,
    sortOrder: 2,
  },
  {
    code: 'PRO',
    name: 'Career Pro',
    monthlyPriceINR: 399,
    yearlyPriceINR: 3999,
    description: 'Comprehensive career acceleration with multi-language coding sandbox.',
    features: ['50 Monthly AI Credits', 'Technical & System Design Interviews', 'Video Mock Interviews', 'Multilingual Coding Sandbox', 'Recruiter Verified Portfolio Listing'],
    trialDays: 0,
    interviewCredits: 50,
    voiceInterviewEnabled: true,
    videoInterviewEnabled: true,
    resumeAnalysisLimit: 25,
    courseAccess: 'standard',
    isActive: true,
    isPopular: true,
    sortOrder: 3,
  },
  {
    code: 'PREMIUM',
    name: 'Executive Elite',
    monthlyPriceINR: 699,
    yearlyPriceINR: 6999,
    description: 'Uncapped career intelligence with personalized AI project mentorship.',
    features: ['Unlimited AI Mock Interviews', 'AI Project Architecture Mentor', 'Priority Recruiter Highlighting', '1-on-1 Portfolio Verification', 'All Certification Access'],
    trialDays: 0,
    interviewCredits: 150,
    voiceInterviewEnabled: true,
    videoInterviewEnabled: true,
    resumeAnalysisLimit: 100,
    courseAccess: 'all',
    isActive: true,
    isPopular: false,
    sortOrder: 4,
  },
];

const DEFAULT_CREDIT_PACKAGES = [
  {
    name: '5 AI Interview Credits',
    quantity: 5,
    priceINR: 99,
    promotionalPriceINR: 79,
    validityDays: 90,
    description: 'Perfect for quick interview practice sessions before an upcoming interview.',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: '15 AI Interview Credits',
    quantity: 15,
    priceINR: 179,
    promotionalPriceINR: 149,
    validityDays: 180,
    description: 'Comprehensive practice pack covering technical, behavioral, and system design.',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: '40 AI Interview Credits',
    quantity: 40,
    priceINR: 399,
    promotionalPriceINR: 299,
    validityDays: 365,
    description: 'Best value bundle for intensive placement and recruitment season preparation.',
    isActive: true,
    sortOrder: 3,
  },
];

export const adminPlanController = {
  /**
   * GET /api/admin/plans
   * List all subscription plans, seeding defaults if empty
   */
  async getPlans(req: AuthenticatedRequest, res: Response) {
    try {
      let plans: any = await Plan.find().sort({ sortOrder: 1 });

      if (plans.length === 0) {
        plans = await Plan.insertMany(DEFAULT_PLANS as any);
      }

      return res.status(200).json({ success: true, plans });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/plans
   * Create new subscription plan
   */
  async createPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const plan = await Plan.create(req.body);

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'PLAN_CREATE',
        resourceType: 'Plan',
        resourceId: plan._id.toString(),
        afterValue: plan.toObject(),
      });

      return res.status(201).json({ success: true, message: 'Plan created successfully', plan });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/plans/:id
   * Update subscription plan prices, limits, and features
   */
  async updatePlan(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const existing = await Plan.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }

      const beforeValue = existing.toObject();
      const updated = await Plan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'PLAN_UPDATE',
        resourceType: 'Plan',
        resourceId: id,
        beforeValue,
        afterValue: updated?.toObject(),
      });

      return res.status(200).json({ success: true, message: 'Plan updated successfully', plan: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * PATCH /api/admin/plans/:id/status
   * Activate or archive subscription plan
   */
  async togglePlanStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const plan = await Plan.findByIdAndUpdate(id, { isActive: Boolean(isActive) }, { new: true });
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: isActive ? 'PLAN_ACTIVATE' : 'PLAN_ARCHIVE',
        resourceType: 'Plan',
        resourceId: id,
        afterValue: { isActive },
      });

      return res.status(200).json({ success: true, message: `Plan ${isActive ? 'activated' : 'archived'}.`, plan });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/credit-packages
   * List credit packages, seeding defaults if empty
   */
  async getCreditPackages(req: AuthenticatedRequest, res: Response) {
    try {
      let packages = await CreditPackage.find().sort({ sortOrder: 1 });

      if (packages.length === 0) {
        packages = await CreditPackage.insertMany(DEFAULT_CREDIT_PACKAGES);
      }

      return res.status(200).json({ success: true, packages });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/credit-packages
   * Create credit package
   */
  async createCreditPackage(req: AuthenticatedRequest, res: Response) {
    try {
      const pkg = await CreditPackage.create(req.body);

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'CREDIT_PACKAGE_CREATE',
        resourceType: 'CreditPackage',
        resourceId: pkg._id.toString(),
        afterValue: pkg.toObject(),
      });

      return res.status(201).json({ success: true, message: 'Credit package created', package: pkg });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/credit-packages/:id
   * Update credit package
   */
  async updateCreditPackage(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await CreditPackage.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'CREDIT_PACKAGE_UPDATE',
        resourceType: 'CreditPackage',
        resourceId: id,
        afterValue: updated.toObject(),
      });

      return res.status(200).json({ success: true, message: 'Package updated', package: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/subscriptions
   * Subscriptions list with user and plan details
   */
  async getSubscriptions(req: AuthenticatedRequest, res: Response) {
    try {
      const { status = 'all', page = '1', limit = '20' } = req.query;
      const query: any = {};
      if (status !== 'all') {
        query.status = status;
      }

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 20;

      const [subscriptions, total] = await Promise.all([
        Subscription.find(query)
          .populate('userId', 'name email college phone')
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum),
        Subscription.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        subscriptions,
        pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
