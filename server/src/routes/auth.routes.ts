import { Router } from 'express';

import { getMe, syncUser } from '../controllers/auth.controller.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';
import { asyncHandler } from '../utils/asyncHandler.utils.ts';

const authRouter = Router();

authRouter.post('/sync', requireAuth, asyncHandler(syncUser));
authRouter.get('/me', requireAuth, asyncHandler(getMe));

export { authRouter };
