import { Op } from 'sequelize';
import { Publication, Role, User } from '../db/models/index.js';
import {
  publicationSummaryInclude,
  toPublicationCards,
} from './publicationController.js';
import { firstError, profileSchema } from '../schemas/index.js';
import { httpError } from '../utils/httpError.js';

export const showProfile = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'bio', 'createdAt'],
    include: [
      {
        model: Role,
        as: 'roles',
        attributes: ['id', 'name', 'slug'],
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    throw httpError(404, 'Usuario no encontrado.');
  }

  const publications = await Publication.findAll({
    where: { userId: user.id },
    include: publicationSummaryInclude,
    order: [['createdAt', 'DESC']],
  });

  return res.render('profile', {
    title: `${user.firstName} ${user.lastName}`,
    profileUser: user,
    publications: await toPublicationCards(publications, req.currentUser),
  });
};

export const showEditProfile = (req, res) => {
  return res.render('editProfile', {
    title: 'Editar perfil',
    values: req.currentUser,
  });
};

export const updateProfile = async (req, res) => {
  const { error, value } = profileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).render('editProfile', {
      title: 'Editar perfil',
      error: firstError(error),
      values: { ...req.currentUser.get({ plain: true }), ...req.body },
    });
  }

  const emailOwner = await User.findOne({
    where: {
      email: value.email,
      id: { [Op.ne]: req.currentUser.id },
    },
  });

  if (emailOwner) {
    return res.status(409).render('editProfile', {
      title: 'Editar perfil',
      error: 'El correo ya está registrado por otra cuenta.',
      values: { ...req.currentUser.get({ plain: true }), ...req.body },
    });
  }

  await req.currentUser.update({
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    bio: value.bio || null,
  });

  return res.redirect(
    `/users/${req.currentUser.id}?success=${encodeURIComponent('Perfil actualizado.')}`
  );
};