import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { Course } from '../models/Course.js';
import { Opportunity } from '../models/Opportunity.js';
import { CareerApplication } from '../models/CareerApplication.js';
import { auditLogService } from '../services/auditLogService.js';

export const adminContentController = {
  /**
   * GET /api/admin/courses
   * List all courses with module counts and enrollment metrics
   */
  async getCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const courses = await Course.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, courses });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/courses
   * Create course with audit logging
   */
  async createCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const course = await Course.create(req.body);

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'COURSE_CREATE',
        resourceType: 'Course',
        resourceId: course._id.toString(),
        afterValue: course.toObject(),
      });

      return res.status(201).json({ success: true, message: 'Course created successfully', course });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/admin/courses/:id
   * Update course details, modules, syllabus
   */
  async updateCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'COURSE_UPDATE',
        resourceType: 'Course',
        resourceId: id,
        afterValue: updated.toObject(),
      });

      return res.status(200).json({ success: true, message: 'Course updated successfully', course: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * DELETE /api/admin/courses/:id
   * Archive or delete course
   */
  async deleteCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'COURSE_DELETE',
        resourceType: 'Course',
        resourceId: id,
      });

      return res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/jobs
   * List all jobs and internships with applicant counts
   */
  async getOpportunities(req: AuthenticatedRequest, res: Response) {
    try {
      const opportunities = await Opportunity.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, opportunities });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/admin/jobs
   * Create new job or internship opportunity
   */
  async createOpportunity(req: AuthenticatedRequest, res: Response) {
    try {
      const opp = await Opportunity.create(req.body);

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'OPPORTUNITY_CREATE',
        resourceType: 'Opportunity',
        resourceId: opp._id.toString(),
        afterValue: opp.toObject(),
      });

      return res.status(201).json({ success: true, message: 'Opportunity created', opportunity: opp });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * PATCH /api/admin/jobs/:id/status
   * Toggle job status (active, closed, draft)
   */
  async updateOpportunityStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const opp = await Opportunity.findByIdAndUpdate(id, { status }, { new: true });
      if (!opp) {
        return res.status(404).json({ success: false, message: 'Opportunity not found' });
      }

      await auditLogService.log({
        adminId: req.user?._id,
        adminEmail: req.user?.email || 'admin',
        adminRole: req.user?.adminRole,
        action: 'OPPORTUNITY_STATUS_UPDATE',
        resourceType: 'Opportunity',
        resourceId: id,
        afterValue: { status },
      });

      return res.status(200).json({ success: true, message: 'Status updated', opportunity: opp });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/admin/applications
   * Track applications across all listings
   */
  async getApplications(req: AuthenticatedRequest, res: Response) {
    try {
      const applications = await CareerApplication.find()
        .populate('user', 'name email college phone careerReadinessScore')
        .populate('opportunity', 'title company category')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, applications });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};
