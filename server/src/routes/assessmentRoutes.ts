import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { assessmentController } from '../controllers/assessmentController.js';

const router = Router();

// Protect all assessment endpoints
router.use(requireAuth);

router.post('/generate', assessmentController.generateAssessment);
router.get('/', assessmentController.getAssessments);
router.get('/history', assessmentController.getAssessments);
router.get('/:id', assessmentController.getAssessmentById);
router.get('/:id/results', assessmentController.getAssessmentById);
router.post('/:id/start', assessmentController.startAssessment);
router.post('/:id/submit', assessmentController.submitAssessment);

export default router;
