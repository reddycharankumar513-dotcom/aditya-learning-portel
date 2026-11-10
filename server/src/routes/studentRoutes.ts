import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getStudentProfile,
  updateStudentProfile,
  getAssessments,
  submitAssessment,
} from '../controllers/studentController.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/assessments', getAssessments);
router.post('/assessments', submitAssessment);

export default router;
