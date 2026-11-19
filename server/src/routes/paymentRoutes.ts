import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getPricingCatalog,
  getRazorpayConfig,
  createOrder,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
  getPaymentStatus,
} from '../controllers/paymentController.js';

const router = Router();

// Public routes
router.get('/plans', getPricingCatalog);
router.get('/config', getRazorpayConfig);
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/history', requireAuth, getPaymentHistory);
router.get('/:id/status', requireAuth, getPaymentStatus);

export default router;
