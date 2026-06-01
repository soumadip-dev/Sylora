import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGO_URI: string;
  CORS_ORIGINS: string[];
  NODE_ENV: string;
  ADMIN_EMAILS: string;
}

const port = Number(process.env.PORT);

export const env: EnvConfig = {
  PORT: Number.isNaN(port) ? 8080 : port,
  MONGO_URI: process.env.MONGODB_URI || '',
  CORS_ORIGINS: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : [],
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || 'soumadipmajila@gmail.com',
};
