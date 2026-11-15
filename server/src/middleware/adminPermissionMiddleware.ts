import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';

export const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['*'],
  finance_admin: [
    'plans.read',
    'plans.create',
    'plans.update',
    'payments.read',
    'refunds.create',
    'refunds.read',
    'credits.read',
    'credits.update',
    'revenue.read',
    'dashboard.read',
  ],
  content_admin: [
    'courses.read',
    'courses.create',
    'courses.update',
    'courses.delete',
    'jobs.read',
    'jobs.publish',
    'jobs.update',
    'content.read',
    'content.update',
    'announcements.create',
    'dashboard.read',
  ],
  support_admin: [
    'users.read',
    'users.update',
    'support.read',
    'support.reply',
    'support.update',
    'employers.read',
    'employers.verify',
    'dashboard.read',
  ],
};

export const requireAdminPermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied: Administrator privileges required.' });
      return;
    }

    const adminRole = req.user.adminRole || 'super_admin';
    const rolePermissions = ROLE_DEFAULT_PERMISSIONS[adminRole] || [];
    const customPermissions = req.user.permissions || [];

    const allPermissions = Array.from(new Set([...rolePermissions, ...customPermissions]));

    // Super admin has wildcard access
    if (adminRole === 'super_admin' || allPermissions.includes('*') || allPermissions.includes(requiredPermission)) {
      next();
      return;
    }

    res.status(403).json({
      message: `Access denied: Missing required permission "${requiredPermission}". Contact a Super Administrator.`,
    });
  };
};
