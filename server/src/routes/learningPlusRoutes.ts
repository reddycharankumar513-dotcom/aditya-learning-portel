import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getPersonalizedRoadmap,
  toggleRoadmapMilestone,
  getCodingProblems,
  runCodeSubmission,
  getProjectMentorRecommendations,
} from '../controllers/learningPlusController.js';

const router = Router();

router.use(requireAuth);

router.get('/roadmap', getPersonalizedRoadmap);
router.post('/roadmap/toggle', toggleRoadmapMilestone);
router.get('/coding/problems', getCodingProblems);
router.post('/coding/submit', runCodeSubmission);
router.get('/projects/recommendations', getProjectMentorRecommendations);

export default router;
