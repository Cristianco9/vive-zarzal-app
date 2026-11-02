import { Router } from 'express';
import {
  showEditProfile,
  updateProfile,
} from '../controllers/userController.js';
import { requireAuth } from '../middlewares/auth.js';

export const userRouter = Router();

userRouter.get('/profile/edit', requireAuth, showEditProfile);
userRouter.post('/profile/edit', requireAuth, updateProfile);
