import rateLimit from 'express-rate-limit';

// Global API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP address. Please wait a few minutes before retrying.',
  },
});

// Stricter rate limit for authentication (protects against brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again later.',
  },
});

// Stricter rate limit for AI Tutor requests
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'AI Tutor rate limit reached. Please wait a moment before sending another prompt.',
  },
});
