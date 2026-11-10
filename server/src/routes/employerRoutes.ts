import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerDashboard,
  getEmployerJobs,
  createJobListing,
  discoverTalent,
  getRecruitmentPipeline,
  updateCandidateStage,
} from '../controllers/employerController.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', getEmployerProfile);
router.put('/profile', updateEmployerProfile);
router.get('/dashboard', getEmployerDashboard);
router.get('/jobs', getEmployerJobs);
router.post('/jobs', createJobListing);
router.get('/talent', discoverTalent);
router.get('/pipeline', getRecruitmentPipeline);
router.patch('/pipeline/stage', updateCandidateStage);

export default router;
