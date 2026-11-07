import { Comment, Publication, Report } from '../db/models/index.js';
import { firstError, reportSchema } from '../schemas/index.js';
import { httpError } from '../utils/httpError.js';

const submitReport = async (req, res, { target, targetKey, publicationId, ownMessage }) => {
  const backTo = `/publications/${publicationId}`;

  if (target.userId === req.currentUser.id) {
    throw httpError(403, ownMessage);
  }

  const { error, value } = reportSchema.validate(
    { reason: req.body.reason, details: req.body.details },
    { abortEarly: false }
  );

  if (error) {
    return res.redirect(`${backTo}?error=${encodeURIComponent(firstError(error))}`);
  }

  const [, created] = await Report.findOrCreate({
    where: {
      reporterId: req.currentUser.id,
      [targetKey]: target.id,
    },
    defaults: {
      reason: value.reason,
      details: value.details || null,
      status: 'pending',
    },
  });

  if (!created) {
    return res.redirect(
      `${backTo}?error=${encodeURIComponent('Ya reportaste este contenido.')}`
    );
  }

  return res.redirect(
    `${backTo}?success=${encodeURIComponent('Reporte enviado. Gracias por avisarnos.')}`
  );
};

export const reportPublication = async (req, res) => {
  const publication = await Publication.findByPk(req.params.id);

  if (!publication) {
    throw httpError(404, 'Publicación no encontrada.');
  }

  return submitReport(req, res, {
    target: publication,
    targetKey: 'publicationId',
    publicationId: publication.id,
    ownMessage: 'No puedes reportar tu propia publicación.',
  });
};

export const reportComment = async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);

  if (!comment) {
    throw httpError(404, 'Comentario no encontrado.');
  }

  return submitReport(req, res, {
    target: comment,
    targetKey: 'commentId',
    publicationId: comment.publicationId,
    ownMessage: 'No puedes reportar tu propio comentario.',
  });
};