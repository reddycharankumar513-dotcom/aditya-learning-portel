import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { SiteContent } from '../models/SiteContent.js';
import { PlatformSetting } from '../models/PlatformSetting.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { BroadcastNotification } from '../models/BroadcastNotification.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { User } from '../models/User.js';
import { auditLogService } from '../services/auditLogService.js';

export const adminPlatformController = {
  /**
   * GET /api/admin/content
   * Retrieve CMS content for website and legal pages
   */
  async getSiteContent(req: AuthenticatedRequest, res: Response) {
    try {
      let content = await SiteContent.findOne();
      if (!content) {
        content = await SiteContent.create({
          hero: {
            headline: 'Your Future Starts With What You Learn Today.',
            subheadline: 'Learn smarter. Practice with AI. Build your skills. Prepare for your dream career with Learnova.',
            primaryCtaText: 'Start Learning Free',
            secondaryCtaText: 'Explore AI Interviews',
          },
          benefits: [
            { title: 'Learn Modern Skills', description: 'Curated technical tracks covering Full Stack, AI/ML, and Cloud Computing.', icon: 'BookOpen' },
            { title: 'Prove With AI', description: 'Real-time mock interviews with 6-rubric diagnostic scoring and feedback.', icon: 'Sparkles' },
            { title: 'Get Hired Fast', description: 'Direct talent matching with verified companies and one-click applications.', icon: 'Briefcase' },
          ],
          faqs: [
            { question: 'What is Learnova?', answer: 'Learnova is an AI Career Intelligence Platform connecting education, practical engineering, and direct hiring.', category: 'General' },
            { question: 'How do AI Mock Interviews work?', answer: 'You choose your engineering role and answer dynamic questions. Our AI evaluates technical knowledge, relevance, and problem solving across 6 rubrics.', category: 'Interviews' },
            { question: 'Are verified portfolios visible to employers?', answer: 'Yes, once you enable recruiter sharing consent in your portfolio settings, verified recruiters can discover your profile.', category: 'Placement' },
          ],
          testimonials: [
            { name: 'Priya Sharma', role: 'Software Engineer', company: 'Google', quote: 'Learnova mock interviews gave me the exact confidence and technical depth needed for my interviews.', rating: 5 },
            { name: 'Rohit Verma', role: 'AI Developer', company: 'Microsoft', quote: 'The ATS resume analyzer and XYZ bullet rewriter transformed my job applications completely.', rating: 5 },
          ],
        });
      }
      return res.status(200).json({ success: true, content });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/content
   * Update CMS content
   */
  async updateSiteContent(req: AuthenticatedRequest, res: Response) {
    try {
      let content = await SiteContent.findOne();
      if (!content) {
        content = new SiteContent();
      }

      const beforeValue = content.toObject();
      Object.assign(content, req.body);
      content.updatedBy = req.user?._id;
      await content.save();

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'SITE_CONTENT_UPDATE',
        resourceType: 'SiteContent',
        resourceId: content._id.toString(),
        beforeValue,
        afterValue: content.toObject(),
      });

      return res.status(200).json({ success: true, message: 'Website content updated', content });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/settings
   * Retrieve platform settings
   */
  async getPlatformSettings(req: AuthenticatedRequest, res: Response) {
    try {
      let settings = await PlatformSetting.findOne();
      if (!settings) {
        settings = await PlatformSetting.create({
          registrationEnabled: true,
          studentRegistrationEnabled: true,
          employerRegistrationEnabled: true,
          emailVerificationRequired: false,
          defaultCurrency: 'INR',
          supportedCurrencies: ['INR', 'USD'],
          maintenanceMode: false,
          maxFileUploadSizeMB: 10,
        });
      }
      return res.status(200).json({ success: true, settings });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/settings
   * Update platform settings
   */
  async updatePlatformSettings(req: AuthenticatedRequest, res: Response) {
    try {
      let settings = await PlatformSetting.findOne();
      if (!settings) {
        settings = new PlatformSetting();
      }

      const beforeValue = settings.toObject();
      Object.assign(settings, req.body);
      settings.updatedBy = req.user?._id;
      await settings.save();

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'PLATFORM_SETTINGS_UPDATE',
        resourceType: 'PlatformSetting',
        resourceId: settings._id.toString(),
        beforeValue,
        afterValue: settings.toObject(),
      });

      return res.status(200).json({ success: true, message: 'Platform settings updated', settings });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/support
   * List support tickets with status and priority filters
   */
  async getSupportTickets(req: AuthenticatedRequest, res: Response) {
    try {
      const { status = 'all', priority = 'all', category = 'all' } = req.query;

      const query: any = {};
      if (status !== 'all') query.status = status;
      if (priority !== 'all') query.priority = priority;
      if (category !== 'all') query.category = category;

      const tickets = await SupportTicket.find(query).populate('assignedTo', 'name email').sort({ createdAt: -1 });

      return res.status(200).json({ success: true, tickets });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/support/:id
   * Get single support ticket with complete reply thread
   */
  async getSupportTicketById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await SupportTicket.findById(id).populate('assignedTo', 'name email');
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }
      return res.status(200).json({ success: true, ticket });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/support/:id/reply
   * Add response or internal note to support ticket
   */
  async replySupportTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { message, isInternal = false, newStatus } = req.body;

      if (!message) {
        return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
      }

      const ticket = await SupportTicket.findById(id);
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      ticket.replies.push({
        sender: 'admin',
        senderId: req.user?._id as any,
        senderName: req.user?.name || 'Support Administrator',
        message,
        isInternal: Boolean(isInternal),
        createdAt: new Date(),
      });

      if (newStatus) {
        ticket.status = newStatus;
      } else if (!isInternal) {
        ticket.status = 'waiting_for_user';
      }

      await ticket.save();

      return res.status(200).json({ success: true, message: 'Reply submitted successfully', ticket });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/notifications
   * Broadcast targeted notification to platform users
   */
  async createBroadcastNotification(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, message, type = 'announcement', targetRole = 'all', targetPlan = 'all', deliveryChannel = 'in_app' } = req.body;

      if (!title || !message) {
        return res.status(400).json({ success: false, message: 'Title and message are required' });
      }

      // Count potential recipients
      const userQuery: any = {};
      if (targetRole !== 'all') userQuery.role = targetRole;
      if (targetPlan !== 'all') userQuery.plan = targetPlan;

      const recipientCount = await User.countDocuments(userQuery);

      const notification = await BroadcastNotification.create({
        title,
        message,
        type,
        targetRole,
        targetPlan,
        sentBy: req.user?._id as any,
        recipientCount,
        deliveryChannel,
      });

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'BROADCAST_NOTIFICATION_SENT',
        resourceType: 'BroadcastNotification',
        resourceId: notification._id.toString(),
        afterValue: { title, targetRole, recipientCount },
      });

      return res.status(201).json({
        success: true,
        message: `Broadcast notification dispatched to ${recipientCount} users.`,
        notification,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/audit-logs
   * Audit log trail with pagination and filtering
   */
  async getAuditLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const { action = 'all', page = '1', limit = '25' } = req.query;

      const query: any = {};
      if (action !== 'all') {
        query.action = action;
      }

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 25;

      const [logs, total] = await Promise.all([
        AdminAuditLog.find(query)
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum),
        AdminAuditLog.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        logs,
        pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/roles
   * List administrators and their roles
   */
  async getAdminRoles(req: AuthenticatedRequest, res: Response) {
    try {
      const admins = await User.find({ role: 'admin' }).select('name email adminRole permissions isSuspended createdAt lastLoginAt');
      return res.status(200).json({ success: true, admins });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PATCH /api/admin/roles/:id
   * Update administrator role and custom permissions
   */
  async updateAdminRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { adminRole, permissions } = req.body;

      const adminUser = await User.findById(id);
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(404).json({ success: false, message: 'Administrator not found' });
      }

      const beforeValue = { adminRole: adminUser.adminRole, permissions: adminUser.permissions };

      if (adminRole) adminUser.adminRole = adminRole;
      if (Array.isArray(permissions)) adminUser.permissions = permissions;

      await adminUser.save();

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'ADMIN_ROLE_PERMISSIONS_UPDATE',
        resourceType: 'User',
        resourceId: id,
        beforeValue,
        afterValue: { adminRole: adminUser.adminRole, permissions: adminUser.permissions },
      });

      return res.status(200).json({
        success: true,
        message: 'Admin permissions updated successfully.',
        admin: adminUser,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
