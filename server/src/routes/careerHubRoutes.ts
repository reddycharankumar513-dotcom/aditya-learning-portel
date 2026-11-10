import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getOpportunities,
  applyToOpportunity,
  getMyApplications,
  updateApplicationStage,
} from '../controllers/careerHubController.js';

const router = Router();

// Public / Authenticated read
router.get('/opportunities', getOpportunities);

// Protected student application actions
router.post('/applications/apply', requireAuth, applyToOpportunity);
router.get('/applications/my', requireAuth, getMyApplications);
router.patch('/applications/stage', requireAuth, updateApplicationStage);

export default router;
