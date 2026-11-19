import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  staffLogin,
  getStaffProfile,
  getStaffCollections,
} from '../controllers/staffController.js';

const router = Router();

// Public staff login
router.post('/login', staffLogin);

// Protected staff routes
router.get('/profile', requireAuth, getStaffProfile);
router.get('/payments', requireAuth, getStaffCollections);

export default router;
