import { verifyToken } from '../utils/auth.js';
import { Role, User } from '../db/models/index.js';

export const loadCurrentUser = async (req, res, next) => {
  res.locals.currentUser = null;
  res.locals.currentPath = req.path;
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;

  const token = req.cookies?.authentication;

  if (!token) {
    return next();
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'bio'],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'slug'],
          through: { attributes: [] },
        },
      ],
    });

    if (user) {
      req.currentUser = user;
      res.locals.currentUser = user;
    } else {
      res.clearCookie('authentication');
    }
  } catch {
    res.clearCookie('authentication');
  }

  return next();
};

export const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
  }
  return next();
};
