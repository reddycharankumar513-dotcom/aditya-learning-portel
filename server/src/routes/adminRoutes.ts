import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { requireAdminPermission } from '../middleware/adminPermissionMiddleware.js';

// Modular Admin Controllers
import { adminDashboardController } from '../controllers/adminDashboardController.js';
import { adminUserController } from '../controllers/adminUserController.js';
import { adminPlanController } from '../controllers/adminPlanController.js';
import { adminPaymentController } from '../controllers/adminPaymentController.js';
import { adminAIController } from '../controllers/adminAIController.js';
import { adminContentController } from '../controllers/adminContentController.js';
import { adminPlatformController } from '../controllers/adminPlatformController.js';

// Legacy Controller compatibility
import {
  getMetrics,
  getAdminInquiries,
  updateAdminInquiryStatus,
  updateAdminUserRole,
} from '../controllers/adminController.js';

const router = Router();

// Enforce authentication & administrator role globally on all admin endpoints
router.use(requireAuth, requireAdmin);

// -------------------------------------------------------------
// 1. Dashboard & Analytics
// -------------------------------------------------------------
router.get('/metrics', getMetrics); // Legacy metrics support
router.get('/dashboard/stats', requireAdminPermission('dashboard.read'), adminDashboardController.getDashboardStats);

// -------------------------------------------------------------
// 2. User & Student Management
// -------------------------------------------------------------
router.get('/users/students', requireAdminPermission('users.read'), adminUserController.getStudents);
router.get('/users/students/:id', requireAdminPermission('users.read'), adminUserController.getStudentById);
router.patch('/users/students/:id/status', requireAdminPermission('users.update'), adminUserController.updateStudentStatus);
router.post('/users/students/:id/adjust-credits', requireAdminPermission('credits.update'), adminUserController.adjustStudentCredits);
router.patch('/users/:id/role', requireAdminPermission('*'), updateAdminUserRole);

// -------------------------------------------------------------
// 3. Employer Management
// -------------------------------------------------------------
router.get('/employers', requireAdminPermission('employers.read'), adminUserController.getEmployers);
router.patch('/employers/:id/verification', requireAdminPermission('employers.verify'), adminUserController.updateEmployerVerification);

// -------------------------------------------------------------
// 4. Pricing, Plans & Credit Packages
// -------------------------------------------------------------
router.get('/plans', requireAdminPermission('plans.read'), adminPlanController.getPlans);
router.post('/plans', requireAdminPermission('plans.create'), adminPlanController.createPlan);
router.put('/plans/:id', requireAdminPermission('plans.update'), adminPlanController.updatePlan);
router.patch('/plans/:id/status', requireAdminPermission('plans.update'), adminPlanController.togglePlanStatus);

router.get('/credit-packages', requireAdminPermission('plans.read'), adminPlanController.getCreditPackages);
router.post('/credit-packages', requireAdminPermission('plans.create'), adminPlanController.createCreditPackage);
router.put('/credit-packages/:id', requireAdminPermission('plans.update'), adminPlanController.updateCreditPackage);
router.get('/subscriptions', requireAdminPermission('payments.read'), adminPlanController.getSubscriptions);

// -------------------------------------------------------------
// 5. Payment Management & Refunds
// -------------------------------------------------------------
router.get('/payments', requireAdminPermission('payments.read'), adminPaymentController.getPayments);
router.get('/payments/export', requireAdminPermission('payments.read'), adminPaymentController.exportPaymentsCSV);
router.get('/refunds', requireAdminPermission('refunds.read'), adminPaymentController.getRefunds);
router.post('/refunds', requireAdminPermission('refunds.create'), adminPaymentController.processRefund);

// -------------------------------------------------------------
// 6. AI Command Center & Prompts
// -------------------------------------------------------------
router.get('/ai/config', requireAdminPermission('ai.configure'), adminAIController.getAIConfig);
router.put('/ai/providers', requireAdminPermission('ai.configure'), adminAIController.updateAIProviders);
router.put('/ai/scoring-weights', requireAdminPermission('ai.configure'), adminAIController.updateScoringWeights);
router.put('/ai/features', requireAdminPermission('ai.configure'), adminAIController.updateAIFeatures);
router.get('/ai/usage', requireAdminPermission('ai.configure'), adminAIController.getAIUsage);

// -------------------------------------------------------------
// 7. Course & Content Academy
// -------------------------------------------------------------
router.get('/courses', requireAdminPermission('courses.read'), adminContentController.getCourses);
router.post('/courses', requireAdminPermission('courses.create'), adminContentController.createCourse);
router.put('/courses/:id', requireAdminPermission('courses.update'), adminContentController.updateCourse);
router.delete('/courses/:id', requireAdminPermission('courses.delete'), adminContentController.deleteCourse);

// -------------------------------------------------------------
// 8. Jobs, Internships & Applications
// -------------------------------------------------------------
router.get('/jobs', requireAdminPermission('jobs.read'), adminContentController.getOpportunities);
router.post('/jobs', requireAdminPermission('jobs.publish'), adminContentController.createOpportunity);
router.patch('/jobs/:id/status', requireAdminPermission('jobs.update'), adminContentController.updateOpportunityStatus);
router.get('/applications', requireAdminPermission('jobs.read'), adminContentController.getApplications);
router.get('/inquiries', getAdminInquiries);
router.patch('/inquiries/:id', updateAdminInquiryStatus);

// -------------------------------------------------------------
// 9. Website Content (CMS) & Platform Settings
// -------------------------------------------------------------
router.get('/content', requireAdminPermission('content.read'), adminPlatformController.getSiteContent);
router.put('/content', requireAdminPermission('content.update'), adminPlatformController.updateSiteContent);
router.get('/settings', requireAdminPermission('settings.update'), adminPlatformController.getPlatformSettings);
router.put('/settings', requireAdminPermission('settings.update'), adminPlatformController.updatePlatformSettings);

// -------------------------------------------------------------
// 10. Support Tickets & Notifications
// -------------------------------------------------------------
router.get('/support', requireAdminPermission('support.read'), adminPlatformController.getSupportTickets);
router.get('/support/:id', requireAdminPermission('support.read'), adminPlatformController.getSupportTicketById);
router.post('/support/:id/reply', requireAdminPermission('support.reply'), adminPlatformController.replySupportTicket);
router.post('/notifications', requireAdminPermission('announcements.create'), adminPlatformController.createBroadcastNotification);

// -------------------------------------------------------------
// 11. Security, Audit Logs & Role Management
// -------------------------------------------------------------
router.get('/audit-logs', requireAdminPermission('audit.read'), adminPlatformController.getAuditLogs);
router.get('/roles', requireAdminPermission('*'), adminPlatformController.getAdminRoles);
router.patch('/roles/:id', requireAdminPermission('*'), adminPlatformController.updateAdminRole);

export default router;
