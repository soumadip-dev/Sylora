import mongoose from 'mongoose';
import { env } from './config/env.config.ts';
import { logger } from './utils/logger.utils.ts';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('MongoDb Connected successfully ✅');
  } catch (error) {
    logger.info('MongoDb Connection fialed 👎');
    process.exit(1);
  }
}
