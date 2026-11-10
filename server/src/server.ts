import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seeds/seedData.js';

const startServer = async () => {
  const app = createApp();

  // Connect to MongoDB Atlas / Local MongoDB
  const isDbConnected = await connectDB();

  // If connected, seed default content if database is empty
  if (isDbConnected) {
    await seedDatabase();
  }

  const server = app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(` ADITYA — AI-Powered Education & Career Platform API`);
    console.log(` Server running on http://localhost:${ENV.PORT}`);
    console.log(` Health check: http://localhost:${ENV.PORT}/api/health`);
    console.log(` Environment: ${ENV.NODE_ENV}`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('Shutting down ADITYA server gracefully...');
    server.close(() => {
      console.log('Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('[Server Startup Error]:', err);
});
