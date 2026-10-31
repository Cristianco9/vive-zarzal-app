import { Router } from 'express';
import { authRouter } from './authRouter.js';
import { userRouter } from './userRouter.js';
import { publicationRouter } from './publicationRouter.js';
import { interactionRouter } from './interactionRouter.js';

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(publicationRouter);
router.use(interactionRouter);

export default router;
