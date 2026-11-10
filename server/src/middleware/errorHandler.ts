import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
