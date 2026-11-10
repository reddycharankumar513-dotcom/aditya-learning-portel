import { Router } from 'express';
import { 
  getDashboard, getRecommendations, getProjects, 
  addProject, deleteProject 
} from '../controllers/learningController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', requireAuth, getDashboard);
router.get('/recommendations', requireAuth, getRecommendations);
router.get('/projects', requireAuth, getProjects);
router.post('/projects', requireAuth, addProject);
router.delete('/projects/:id', requireAuth, deleteProject);

export default router;
