import type { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/envelope.utils';

export function NotFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json(errorResponse(`Route not found ${req.method}`));
}
