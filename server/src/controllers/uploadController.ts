import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { s3Service, AllowedFileCategory } from '../services/s3Service.js';

export const uploadController = {
  /**
   * POST /api/upload/presign
   * Get presigned URL for direct browser-to-S3 upload
   */
  async getPresignedUploadUrl(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id || req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const { category, fileName, mimeType, fileSize } = req.body;

      if (!category || !fileName || !mimeType || !fileSize) {
        return res.status(400).json({
          success: false,
          message: 'Missing required upload parameters: category, fileName, mimeType, fileSize',
        });
      }

      const validCategories: AllowedFileCategory[] = ['resume', 'portfolio', 'certificate', 'project', 'employer_doc'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        });
      }

      const presignedData = await s3Service.generatePresignedUploadUrl({
        userId,
        category,
        fileName,
        mimeType,
        fileSize: Number(fileSize),
      });

      return res.status(200).json({
        success: true,
        message: 'Presigned upload URL generated successfully',
        data: presignedData,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to generate upload URL',
      });
    }
  },

  /**
   * GET /api/upload/download-url
   * Get presigned URL for secure download
   */
  async getPresignedDownloadUrl(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id || req.user?._id?.toString();
      const userRole = req.user?.role;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const key = req.query.key as string;
      if (!key) {
        return res.status(400).json({ success: false, message: 'Missing S3 object key query parameter' });
      }

      // Authorization check: Students can download their own files; employers/admins can download resumes & public docs
      const isOwner = key.includes(`/${userId}/`);
      const isRecruiterOrAdmin = userRole === 'employer' || userRole === 'admin';

      if (!isOwner && !isRecruiterOrAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not have permission to access this file',
        });
      }

      const downloadUrl = await s3Service.generatePresignedDownloadUrl(key);

      return res.status(200).json({
        success: true,
        downloadUrl,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to generate download URL',
      });
    }
  },
};
