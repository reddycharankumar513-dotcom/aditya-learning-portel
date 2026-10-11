import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      message: 'Access denied. You do not possess administrator permissions.',
    });
    return;
  }

  next();
};
