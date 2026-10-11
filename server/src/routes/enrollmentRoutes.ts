import { Router } from 'express';
import { 
  enroll, getMyEnrollments, checkEnrollment, updateProgress 
} from '../controllers/enrollmentController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/:courseId/enroll', requireAuth, enroll);
router.get('/me', requireAuth, getMyEnrollments);
router.get('/check/:courseId', optionalAuth, checkEnrollment);
router.patch('/:courseId/progress', requireAuth, updateProgress);

export default router;
