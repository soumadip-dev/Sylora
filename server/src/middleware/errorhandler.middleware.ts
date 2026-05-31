import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.utils';
import { errorResponse } from '../utils/envelope.utils';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message, 'APP_ERROR'));
  }

  console.error('Error: ', err);
  return res.status(500).json(errorResponse('Internal server error', 'INTERNAL_SERVER_ERROR'));
}
