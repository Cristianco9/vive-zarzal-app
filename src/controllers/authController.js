import { Op } from 'sequelize';
import { User } from '../db/models/index.js';
import {
  hashPassword,
  signToken,
  verifyPassword,
} from '../utils/auth.js';
import {
  firstError,
  loginSchema,
  registerSchema,
} from '../schemas/index.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

const safeRedirect = (value) => {
  if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  return '/';
};

export const showLogin = (req, res) => {
  if (req.currentUser) {
    return res.redirect('/');
  }
  return res.render('login', {
    title: 'Iniciar sesión',
    next: req.query.next || '',
    values: {},
  });
};

export const login = async (req, res) => {
  const { error, value } = loginSchema.validate(
    { identifier: req.body.identifier, password: req.body.password },
    { abortEarly: false }
  );

  if (error) {
    return res.status(400).render('login', {
      title: 'Iniciar sesión',
      error: firstError(error),
      values: { identifier: req.body.identifier },
      next: req.body.next || '',
    });
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: value.identifier }, { email: value.identifier }],
    },
  });

  const passwordIsValid = user
    ? await verifyPassword(value.password, user.password)
    : false;

  if (!user || !passwordIsValid) {
    return res.status(401).render('login', {
      title: 'Iniciar sesión',
      error: 'Usuario o contraseña incorrectos.',
      values: { identifier: value.identifier },
      next: req.body.next || '',
    });
  }

  res.cookie('authentication', signToken(user), cookieOptions);
  return res.redirect(safeRedirect(req.body.next));
};

export const showRegister = (req, res) => {
  if (req.currentUser) {
    return res.redirect('/');
  }
  return res.render('register', { title: 'Crear cuenta', values: {} });
};

export const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).render('register', {
      title: 'Crear cuenta',
      error: firstError(error),
      values: req.body,
    });
  }

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ username: value.username }, { email: value.email }],
    },
  });

  if (existingUser) {
    const message =
      existingUser.username === value.username
        ? 'El nombre de usuario ya está en uso.'
        : 'El correo ya está registrado.';

    return res.status(409).render('register', {
      title: 'Crear cuenta',
      error: message,
      values: req.body,
    });
  }

  await User.create({
    firstName: value.firstName,
    lastName: value.lastName,
    username: value.username,
    email: value.email,
    password: await hashPassword(value.password),
  });

  return res.redirect(
    `/login?success=${encodeURIComponent('Cuenta creada. Ya puedes iniciar sesión.')}`
  );
};

export const logout = (req, res) => {
  res.clearCookie('authentication');
  return res.redirect(
    `/?success=${encodeURIComponent('Sesión cerrada correctamente.')}`
  );
};
