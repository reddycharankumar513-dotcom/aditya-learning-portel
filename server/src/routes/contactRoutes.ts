import { Router } from 'express';
import { submitInquiry } from '../controllers/contactController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', apiLimiter, submitInquiry);

export default router;
