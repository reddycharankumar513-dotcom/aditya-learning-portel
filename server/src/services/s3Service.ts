import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENV } from '../config/env.js';

export type AllowedFileCategory = 'resume' | 'portfolio' | 'certificate' | 'project' | 'employer_doc';

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  resume: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  portfolio: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
  certificate: ['application/pdf', 'image/png', 'image/jpeg'],
  project: ['application/pdf', 'application/zip', 'image/png', 'image/jpeg'],
  employer_doc: ['application/pdf', 'image/png', 'image/jpeg'],
};

export const FILE_SIZE_LIMITS: Record<AllowedFileCategory, number> = {
  resume: 5 * 1024 * 1024, // 5MB
  portfolio: 10 * 1024 * 1024, // 10MB
  certificate: 5 * 1024 * 1024, // 5MB
  project: 15 * 1024 * 1024, // 15MB
  employer_doc: 10 * 1024 * 1024, // 10MB
};

// Initialize S3 Client with standard AWS credential provider chain (IAM role on ECS, env vars locally)
const s3Client = new S3Client({
  region: ENV.AWS_REGION,
});

export const s3Service = {
  /**
   * Validate file upload request parameters
   */
  validateUploadRequest(category: AllowedFileCategory, mimeType: string, fileSize: number): { valid: boolean; error?: string } {
    const allowedMimes = ALLOWED_MIME_TYPES[category];
    if (!allowedMimes || !allowedMimes.includes(mimeType)) {
      return {
        valid: false,
        error: `Invalid file type "${mimeType}" for category "${category}". Allowed: ${allowedMimes?.join(', ') || 'none'}`,
      };
    }

    const maxBytes = FILE_SIZE_LIMITS[category];
    if (fileSize > maxBytes) {
      return {
        valid: false,
        error: `File size ${Math.round(fileSize / (1024 * 1024))}MB exceeds maximum limit of ${Math.round(maxBytes / (1024 * 1024))}MB for ${category}.`,
      };
    }

    return { valid: true };
  },

  /**
   * Generate an S3 object key with path isolation by user and category
   */
  generateObjectKey(userId: string, category: AllowedFileCategory, fileName: string): string {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    return `uploads/${category}/${userId}/${timestamp}_${sanitizedFileName}`;
  },

  /**
   * Generate short-lived presigned PUT URL for browser-to-S3 direct upload
   * Expiration default: 15 minutes (900 seconds)
   */
  async generatePresignedUploadUrl(params: {
    userId: string;
    category: AllowedFileCategory;
    fileName: string;
    mimeType: string;
    fileSize: number;
    expiresInSeconds?: number;
  }): Promise<{
    uploadUrl: string;
    key: string;
    fileUrl: string;
    expiresIn: number;
  }> {
    const { userId, category, fileName, mimeType, fileSize, expiresInSeconds = 900 } = params;

    const validation = this.validateUploadRequest(category, mimeType, fileSize);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const key = this.generateObjectKey(userId, category, fileName);

    // If running in development without live AWS credentials, provide simulated presigned response
    if (ENV.NODE_ENV === 'development' && (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)) {
      return {
        uploadUrl: `https://${ENV.S3_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}?simulated_presigned_upload=true`,
        key,
        fileUrl: `https://${ENV.S3_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`,
        expiresIn: expiresInSeconds,
      };
    }

    const command = new PutObjectCommand({
      Bucket: ENV.S3_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Metadata: {
        'uploaded-by': userId,
        'file-category': category,
        'original-filename': fileName,
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });

    return {
      uploadUrl,
      key,
      fileUrl: `https://${ENV.S3_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`,
      expiresIn: expiresInSeconds,
    };
  },

  /**
   * Generate short-lived presigned GET URL for secure authorized download
   * Expiration default: 15 minutes (900 seconds)
   */
  async generatePresignedDownloadUrl(key: string, expiresInSeconds: number = 900): Promise<string> {
    // If running in development without live AWS credentials, return direct mock link
    if (ENV.NODE_ENV === 'development' && (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)) {
      return `https://${ENV.S3_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}?simulated_presigned_download=true`;
    }

    const command = new GetObjectCommand({
      Bucket: ENV.S3_BUCKET_NAME,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  },
};
