import { Router } from 'express';
import {
  showEditProfile,
  showProfile,
  updateProfile,
} from '../controllers/userController.js';
import { requireAuth } from '../middlewares/auth.js';

export const userRouter = Router();

userRouter.get('/users/:id', showProfile);
userRouter.get('/profile/edit', requireAuth, showEditProfile);
userRouter.post('/profile/edit', requireAuth, updateProfile);
