import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  analyzeResume,
  getResumeAnalyses,
} from '../controllers/resumeController.js';

const router = Router();

router.use(requireAuth);

router.post('/analyze', analyzeResume);
router.get('/history', getResumeAnalyses);

export default router;
