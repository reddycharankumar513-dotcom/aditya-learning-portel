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

// LEARNOVA Career Intelligence Routers
import studentRoutes from './routes/studentRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import learningPlusRoutes from './routes/learningPlusRoutes.js';
import careerHubRoutes from './routes/careerHubRoutes.js';

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
      platform: 'LEARNOVA',
      tagline: 'Learn. Build. Prove. Get Hired.',
      timestamp: new Date().toISOString(),
      database: getDbStatus(),
      aiEngine: {
        configured: true,
        model: 'Learnova Multi-Modal Evaluator (Claude 3.5 Sonnet & Pedagogical Rule Engine)',
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

  // LEARNOVA Career Intelligence Endpoints
  app.use('/api/student', studentRoutes);
  app.use('/api/ai/interviews', interviewRoutes);
  app.use('/api/ai/resumes', resumeRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/learning-plus', learningPlusRoutes);
  app.use('/api/career-hub', careerHubRoutes);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
