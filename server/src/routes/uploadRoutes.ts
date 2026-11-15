import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Presigned upload URL generation (authenticated)
router.post('/presign', requireAuth, uploadController.getPresignedUploadUrl);

// Presigned download URL generation (authenticated with ownership/role check)
router.get('/download-url', requireAuth, uploadController.getPresignedDownloadUrl);

export default router;
