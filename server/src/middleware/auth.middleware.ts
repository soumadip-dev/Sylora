import type { NextFunction, Request, Response } from 'express';
import { getAuth } from '@clerk/express';

import { User } from '../models/user.model.ts';
import { AppError } from '../utils/AppError.utils.ts';
import { asyncHandler } from '../utils/asyncHandler.utils.ts';

//* Middleware to ensure the request is made by an authenticated user.
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new AppError(401, 'Authentication required.'));
  }

  next();
}

//* Ensures the request is made by an authenticated user.
export async function getCurrentDbUser(req: Request) {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError(401, 'Authentication required.');
  }

  const currentUser = await User.findOne({ clerkUserId: userId });

  if (!currentUser) {
    throw new AppError(404, 'User record not found.');
  }

  return currentUser;
}

//* Middleware to restrict access to users with the admin role.
export const requireAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const currentUser = await getCurrentDbUser(req);

    if (currentUser.role !== 'admin') {
      throw new AppError(403, 'Access denied. Administrator privileges are required.');
    }

    next();
  }
);
