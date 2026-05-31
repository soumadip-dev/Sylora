import mongoose from 'mongoose';
import { env } from './config/env.config.ts';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDb Connected successfully✅');
  } catch (error) {
    console.log('MongoDb Connection fialed 👎');
    process.exit(1);
  }
}
