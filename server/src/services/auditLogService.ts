import { AdminAuditLog } from '../models/AdminAuditLog.js';

interface LogActionParams {
  adminId: any;
  adminEmail: string;
  adminRole?: string;
  action: string;
  resourceType: string;
  resourceId?: any;
  beforeValue?: any;
  afterValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'apiKey', 'authorization', 'razorpayKeySecret'];

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const isSensitive = SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()));
    if (isSensitive) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export const auditLogService = {
  async log(params: LogActionParams): Promise<void> {
    try {
      await AdminAuditLog.create({
        adminId: params.adminId,
        adminEmail: params.adminEmail,
        adminRole: params.adminRole || 'super_admin',
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId ? String(params.resourceId) : undefined,
        beforeValue: sanitizeObject(params.beforeValue),
        afterValue: sanitizeObject(params.afterValue),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });
    } catch (err: any) {
      console.warn('[AuditLog Warning] Failed to persist audit record:', err.message);
    }
  },
};
