import { Router } from 'express';
import { getInternships, apply, getMyApplications } from '../controllers/internshipController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getInternships);
router.post('/:id/apply', requireAuth, apply);
router.get('/my-applications', requireAuth, getMyApplications);

export default router;
