import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { User, IUser } from '../models/User.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required. No authorization token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User belonging to this token no longer exists.' });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({ message: 'Invalid or expired session token. Please log in again.' });
    return;
  }
};

// Optional auth helper: attaches user if token is valid, but does not block if guest
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
};
