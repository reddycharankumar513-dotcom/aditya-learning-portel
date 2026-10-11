import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected) return true;

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return true;
  } catch (err: any) {
    console.warn(`[Database Warning] Unable to connect to MongoDB at "${ENV.MONGODB_URI}": ${err.message}`);
    console.warn(`[Database Notice] Operating with fallback resilient store or waiting for valid MongoDB URI.`);
    return false;
  }
};

export const getDbStatus = () => ({
  isConnected,
  uri: ENV.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'),
});
