export const notFoundHandler = (req, res) => {
  res.status(404).render('error', {
    title: 'Página no encontrada',
    status: 404,
    message: 'La página que buscas no existe o fue eliminada.',
  });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  let status = err.status || 500;
  let message = err.message || 'Ocurrió un error inesperado.';

  if (err.name === 'MulterError') {
    status = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'La imagen supera el tamaño máximo permitido.'
        : 'No fue posible subir la imagen.';
  }

  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = err.errors.map((item) => item.message).join(' ');
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Ya existe un registro con esos datos.';
  }

  if (req.accepts('html')) {
    return res.status(status).render('error', {
      title: 'Error',
      status,
      message,
    });
  }

  return res.status(status).json({ error: message });
};
