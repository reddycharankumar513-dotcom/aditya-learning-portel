import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { resumeController, resumeUploadMiddleware } from '../controllers/resumeController.js';

const router = Router();

// Protect all resume routes with JWT authentication
router.use(requireAuth);

router.post('/upload', resumeUploadMiddleware, resumeController.uploadAndAnalyze);
router.post('/analyze', resumeUploadMiddleware, resumeController.uploadAndAnalyze); // Legacy route alias
router.get('/', resumeController.getResumes);
router.get('/history', resumeController.getResumeAnalyses); // Legacy route alias
router.get('/:id', resumeController.getResumeById);
router.post('/:id/match-job', resumeController.matchJobDescription);
router.post('/:id/improve', resumeController.improveResume);
router.put('/:id/sections', resumeController.updateSections);
router.get('/:id/export', resumeController.exportResume);

export default router;
