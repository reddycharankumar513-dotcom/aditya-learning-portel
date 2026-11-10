import { Router } from 'express';
import { 
  chat, getConversations, getConversation, deleteConversation 
} from '../controllers/aiController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/chat', aiLimiter, optionalAuth, chat);
router.get('/conversations', requireAuth, getConversations);
router.get('/conversations/:id', optionalAuth, getConversation);
router.delete('/conversations/:id', requireAuth, deleteConversation);

export default router;
