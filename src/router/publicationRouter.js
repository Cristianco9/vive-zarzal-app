import { Router } from 'express';
import {
  create,
  listByCategory,
  listFeed,
  remove,
  showCreate,
  showDetail,
  showEdit,
  update,
} from '../controllers/publicationController.js';
import { requireAuth } from '../middlewares/auth.js';
import { uploadPublicationImage } from '../middlewares/upload.js';

export const publicationRouter = Router();

publicationRouter.get('/', listFeed);
publicationRouter.get('/categories/:slug', listByCategory);

publicationRouter.get('/publications/new', requireAuth, showCreate);
publicationRouter.post(
  '/publications',
  requireAuth,
  uploadPublicationImage,
  create
);

publicationRouter.get('/publications/:id', showDetail);
publicationRouter.get('/publications/:id/edit', requireAuth, showEdit);
publicationRouter.post(
  '/publications/:id/edit',
  requireAuth,
  uploadPublicationImage,
  update
);
publicationRouter.post('/publications/:id/delete', requireAuth, remove);
