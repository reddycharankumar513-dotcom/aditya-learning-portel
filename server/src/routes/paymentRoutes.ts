import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getPricingCatalog,
  createOrder,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
} from '../controllers/paymentController.js';

const router = Router();

// Public routes
router.get('/plans', getPricingCatalog);
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/history', requireAuth, getPaymentHistory);

export default router;
