import { clerkClient, getAuth } from '@clerk/express';
import type { Request, Response } from 'express';

import { User } from '../models/user.model.ts';
import { successResponse } from '../utils/envelope.utils.ts';
import { AppError } from '../utils/AppError.utils.ts';
import { env } from '../config/env.config.ts';

//* Sync authenticated Clerk user with the application database
const syncUser = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError(401, 'Authentication required.');
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  if (!clerkUser) {
    throw new AppError(404, 'User record not found in Clerk.');
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId) ||
    clerkUser.emailAddresses[0];

  const emailAddress = primaryEmail?.emailAddress;

  const fullName = [clerkUser.firstName + ' ' + clerkUser.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  const userDisplayName = fullName || clerkUser.username;

  const adminEmails = env.ADMIN_EMAILS;

  const adminEmailSet = new Set(
    adminEmails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean)
  );

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ clerkUserId: userId });

  // Determine whether the user's email is configured as an administrator email
  const isAdminUser = emailAddress ? adminEmailSet.has(emailAddress.toLowerCase()) : false;

  // Preserve existing admin role or assign admin role based on configuration
  const userRole =
    existingUser?.role === 'admin' ? 'admin' : isAdminUser ? 'admin' : existingUser?.role || 'user';

  const updatedUser = await User.findOneAndUpdate(
    {
      clerkUserId: userId,
    },
    {
      clerkUserId: userId,
      name: userDisplayName,
      email: emailAddress,
      role: userRole,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json(
    successResponse({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        clerkUserId: updatedUser.clerkUserId,
      },
    })
  );
};

//* Get authenticated user's profile
const getMe = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError(401, 'Authentication required.');
  }

  const user = await User.findOne({ clerkUserId: userId });

  if (!user) {
    throw new AppError(404, 'User record not found.');
  }

  res.status(200).json(
    successResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clerkUserId: user.clerkUserId,
      },
    })
  );
};

export { syncUser, getMe };
