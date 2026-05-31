import type { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/envelope.utils';
import { logger } from '../utils/logger.utils';

export function NotFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json(errorResponse(`Route not found ${req.method}`));
  logger.error(`Route not found ${req.method} ${req.url}`);
}
