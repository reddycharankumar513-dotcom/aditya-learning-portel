import { Router } from 'express';
import {
  getMetrics,
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getAdminInternships,
  createAdminInternship,
  updateAdminInternship,
  deleteAdminInternship,
  getAdminApplications,
  updateAdminApplicationStatus,
  getAdminUsers,
  updateAdminUserRole,
  getAdminInquiries,
  updateAdminInquiryStatus,
} from '../controllers/adminController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Apply auth and admin enforcement to all administrative endpoints
router.use(requireAuth, requireAdmin);

router.get('/metrics', getMetrics);

// Courses
router.get('/courses', getAdminCourses);
router.post('/courses', createAdminCourse);
router.patch('/courses/:id', updateAdminCourse);
router.delete('/courses/:id', deleteAdminCourse);

// Internships
router.get('/internships', getAdminInternships);
router.post('/internships', createAdminInternship);
router.patch('/internships/:id', updateAdminInternship);
router.delete('/internships/:id', deleteAdminInternship);

// Applications
router.get('/applications', getAdminApplications);
router.patch('/applications/:id', updateAdminApplicationStatus);

// Users
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateAdminUserRole);

// Inquiries
router.get('/inquiries', getAdminInquiries);
router.patch('/inquiries/:id', updateAdminInquiryStatus);

export default router;
