import { Router } from 'express';
import {
  createComment,
  deleteComment,
  rate,
  toggleFavorite,
  toggleLike,
  updateComment,
} from '../controllers/interactionController.js';
import { requireAuth } from '../middlewares/auth.js';
import {
  reportComment,
  reportPublication,
} from '../controllers/reportController.js';

export const interactionRouter = Router();

interactionRouter.post('/publications/:id/like', requireAuth, toggleLike);
interactionRouter.post(
  '/publications/:id/favorite',
  requireAuth,
  toggleFavorite
);
interactionRouter.post('/publications/:id/rating', requireAuth, rate);
interactionRouter.post(
  '/publications/:id/comments',
  requireAuth,
  createComment
);

interactionRouter.post('/comments/:id/edit', requireAuth, updateComment);
interactionRouter.post('/comments/:id/delete', requireAuth, deleteComment);

interactionRouter.post('/publications/:id/report', requireAuth, reportPublication);
interactionRouter.post('/comments/:id/report', requireAuth, reportComment);
