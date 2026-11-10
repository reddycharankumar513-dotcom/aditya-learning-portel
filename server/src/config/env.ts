import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/aditya_platform',
  JWT_SECRET: process.env.JWT_SECRET || 'aditya_default_secret_key_change_me_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

export const updateEnvKey = (key: keyof typeof ENV, value: any): void => {
  (ENV as any)[key] = value;
  process.env[key as string] = value;

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8');
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`);
      } else {
        content += `\n${key}=${value}`;
      }
    } else {
      content = `${key}=${value}\n`;
    }
    fs.writeFileSync(envPath, content, 'utf8');
  } catch (err: any) {
    console.warn('[Env] Could not write to .env file:', err.message);
  }
};
