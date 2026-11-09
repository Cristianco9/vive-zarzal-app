import { verifyToken } from '../utils/auth.js';
import { Permission, Role, User } from '../db/models/index.js';
import { httpError } from '../utils/httpError.js';

const FORBIDDEN_MESSAGE = 'No tienes permiso para acceder a esta sección.';

// Junta los slugs de permisos de todos los roles del usuario, sin repetidos.
const collectPermissions = (user) => {
  const slugs = new Set();

  (user.roles || []).forEach((role) => {
    (role.permissions || []).forEach((permission) => slugs.add(permission.slug));
  });

  return [...slugs];
};

export const hasRole = (user, ...slugs) =>
  Boolean(user?.roles?.some((role) => slugs.includes(role.slug)));

export const hasPermission = (user, slug) =>
  Boolean(user?.permissions?.includes(slug));

export const loadCurrentUser = async (req, res, next) => {
  res.locals.currentUser = null;
  res.locals.currentPath = req.path;
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  // Disponible en todas las vistas EJS: <% if (can('reports:manage')) { %>
  res.locals.can = (slug) => hasPermission(req.currentUser, slug);

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
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['id', 'slug'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (user) {
      user.permissions = collectPermissions(user);
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

// Deja pasar a quien tenga al menos uno de los roles indicados.
// Sin sesión responde como requireAuth (redirige al login); sin el rol, 403.
export const requireRole = (...slugs) => (req, res, next) =>
  requireAuth(req, res, () => {
    if (hasRole(req.currentUser, ...slugs)) {
      return next();
    }
    return next(httpError(403, FORBIDDEN_MESSAGE));
  });

// Deja pasar a quien tenga el permiso indicado (por ejemplo 'reports:manage').
// Solo comprueba que el permiso exista; los permisos ":own" requieren además
// verificar en el controlador que el recurso pertenezca al usuario.
export const requirePermission = (slug) => (req, res, next) =>
  requireAuth(req, res, () => {
    if (hasPermission(req.currentUser, slug)) {
      return next();
    }
    return next(httpError(403, FORBIDDEN_MESSAGE));
  });
