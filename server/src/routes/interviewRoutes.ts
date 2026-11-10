import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  createInterview,
  getInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
} from '../controllers/interviewController.js';

const router = Router();

router.use(requireAuth);

router.post('/', createInterview);
router.get('/history', getInterviewHistory);
router.get('/:id', getInterview);
router.post('/:id/answer', submitAnswer);
router.post('/:id/complete', completeInterview);

export default router;
