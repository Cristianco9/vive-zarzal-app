import { Router } from 'express';
import {
  login,
  logout,
  register,
  showLogin,
  showRegister,
} from '../controllers/authController.js';

export const authRouter = Router();

authRouter.get('/login', showLogin);
authRouter.post('/login', login);
authRouter.get('/register', showRegister);
authRouter.post('/register', register);
authRouter.post('/logout', logout);
