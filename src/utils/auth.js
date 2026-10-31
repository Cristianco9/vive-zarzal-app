import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const SALT_ROUNDS = 11;

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

export const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`,
    },
    config.jwtSecretKey,
    { expiresIn: config.jwtExpiresIn }
  );

export const verifyToken = (token) => jwt.verify(token, config.jwtSecretKey);
