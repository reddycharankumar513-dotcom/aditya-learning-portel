import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDbStatus } from './config/db.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  app.use(
    cors({
      origin: [
        ENV.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Rate Limiter
  app.use('/api', apiLimiter);

  // Health Check Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      platform: 'ADITYA',
      tagline: 'Learn. Build. Innovate. Succeed.',
      timestamp: new Date().toISOString(),
      database: getDbStatus(),
      aiTutor: {
        configured: !!ENV.ANTHROPIC_API_KEY && ENV.ANTHROPIC_API_KEY.length > 10,
        model: 'Claude 3.5 Sonnet (with intelligent pedagogical fallback)',
      },
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/learning', learningRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/internships', internshipRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/admin', adminRoutes);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
