import { Comment, Like, Publication, Rating } from '../db/models/index.js';
import {
  commentSchema,
  firstError,
  ratingSchema,
} from '../schemas/index.js';
import { httpError } from '../utils/httpError.js';

const findPublication = async (id) => {
  const publication = await Publication.findByPk(id);

  if (!publication) {
    throw httpError(404, 'Publicación no encontrada.');
  }

  return publication;
};

const findOwnComment = async (id, user) => {
  const comment = await Comment.findByPk(id);

  if (!comment) {
    throw httpError(404, 'Comentario no encontrado.');
  }

  if (comment.userId !== user.id) {
    throw httpError(403, 'No tienes permiso para modificar este comentario.');
  }

  return comment;
};

export const toggleLike = async (req, res) => {
  const publication = await findPublication(req.params.id);

  const existingLike = await Like.findOne({
    where: {
      userId: req.currentUser.id,
      publicationId: publication.id,
    },
  });

  if (existingLike) {
    await existingLike.destroy();
  } else {
    await Like.create({
      userId: req.currentUser.id,
      publicationId: publication.id,
    });
  }

  return res.redirect(`/publications/${publication.id}`);
};

export const rate = async (req, res) => {
  const publication = await findPublication(req.params.id);
  const { error, value } = ratingSchema.validate(
    { score: req.body.score },
    { abortEarly: false }
  );

  if (error) {
    return res.redirect(
      `/publications/${publication.id}?error=${encodeURIComponent(firstError(error))}`
    );
  }

  const [rating, created] = await Rating.findOrCreate({
    where: {
      userId: req.currentUser.id,
      publicationId: publication.id,
    },
    defaults: { score: value.score },
  });

  if (!created) {
    await rating.update({ score: value.score });
  }

  return res.redirect(
    `/publications/${publication.id}?success=${encodeURIComponent('Calificación guardada.')}`
  );
};

export const createComment = async (req, res) => {
  const publication = await findPublication(req.params.id);
  const { error, value } = commentSchema.validate(
    { content: req.body.content },
    { abortEarly: false }
  );

  if (error) {
    return res.redirect(
      `/publications/${publication.id}?error=${encodeURIComponent(firstError(error))}`
    );
  }

  await Comment.create({
    userId: req.currentUser.id,
    publicationId: publication.id,
    content: value.content,
  });

  return res.redirect(
    `/publications/${publication.id}?success=${encodeURIComponent('Comentario publicado.')}`
  );
};

export const updateComment = async (req, res) => {
  const comment = await findOwnComment(req.params.id, req.currentUser);
  const { error, value } = commentSchema.validate(
    { content: req.body.content },
    { abortEarly: false }
  );

  if (error) {
    return res.redirect(
      `/publications/${comment.publicationId}?error=${encodeURIComponent(firstError(error))}`
    );
  }

  await comment.update({ content: value.content });

  return res.redirect(
    `/publications/${comment.publicationId}?success=${encodeURIComponent('Comentario actualizado.')}`
  );
};

export const deleteComment = async (req, res) => {
  const comment = await findOwnComment(req.params.id, req.currentUser);
  const publicationId = comment.publicationId;

  await comment.destroy();

  return res.redirect(
    `/publications/${publicationId}?success=${encodeURIComponent('Comentario eliminado.')}`
  );
};
