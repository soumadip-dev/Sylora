import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { clerkMiddleware } from '@clerk/express';

import { env } from './config/env.config';
import { configCors } from './config/cors.config';
import { connectDB } from './db';

import { errorHandler } from './middleware/errorhandler.middleware.ts';
import { NotFound } from './middleware/notFound.middleware.ts';

import { successResponse } from './utils/envelope.utils.ts';
import { logger } from './utils/logger.utils.ts';
import { authRouter } from './routes/auth.routes.ts';

//* Start the server
async function bootstrap() {
  await connectDB();

  const app = express();

  app.use(configCors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(clerkMiddleware());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response) => {
    return res.status(200).json(successResponse({ message: 'Server is healthy and running 💚' }));
  });

  app.get('/', (_req: Request, res: Response) => {
    return res.status(200).json(successResponse({ message: 'Ecommerce Server is running 🛒' }));
  });

  // auth routes
  app.use('/auth', authRouter);

  app.use(NotFound);
  app.use(errorHandler);

  const PORT = env.PORT || 8080;

  app.listen(PORT, () => {
    logger.info(`Server listening at http://localhost:${PORT} 🌐`);
  });
}

bootstrap().catch(error => {
  logger.error('Failed to start the server ❌', error);
  process.exit(1);
});
