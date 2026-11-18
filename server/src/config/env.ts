import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, fallback to root directory
const serverEnvPath = path.resolve(__dirname, '../../.env');
const rootEnvPath = path.resolve(__dirname, '../../../.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/aditya_platform',
  JWT_SECRET: process.env.JWT_SECRET || 'aditya_default_secret_key_change_me_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_live_U1gvxxE66eARkT',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'learnova_webhook_secret_key_123456',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'learnova-storage-prod',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
    : [
        'https://learnova.in',
        'https://www.learnova.in',
        'https://app.learnova.in',
        'https://admin.learnova.in',
        'https://aditya-learning-portel.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
      ],
};

export const updateEnvKey = (key: keyof typeof ENV, value: any): void => {
  (ENV as any)[key] = value;
  process.env[key as string] = value;

  try {
    const targetEnvPath = fs.existsSync(serverEnvPath) ? serverEnvPath : path.resolve(process.cwd(), '.env');
    let content = '';
    if (fs.existsSync(targetEnvPath)) {
      content = fs.readFileSync(targetEnvPath, 'utf8');
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`);
      } else {
        content += `\n${key}=${value}`;
      }
    } else {
      content = `${key}=${value}\n`;
    }
    fs.writeFileSync(targetEnvPath, content, 'utf8');
  } catch (err: any) {
    console.warn('[Env] Could not write to .env file:', err.message);
  }
};
