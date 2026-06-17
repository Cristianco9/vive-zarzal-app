'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('estado_mensaje', [
      {
        nombre_estado_mensaje: 'Enviado',
        descripcion_estado_mensaje: 'El mensaje ha sido enviado exitosamente.',
        fecha_creacion_estado_mensaje: now,
        fecha_modificacion_estado_mensaje: now
      },
      {
        nombre_estado_mensaje: 'Recibido',
        descripcion_estado_mensaje: 'El mensaje fue recibido por el destinatario.',
        fecha_creacion_estado_mensaje: now,
        fecha_modificacion_estado_mensaje: now
      },
      {
        nombre_estado_mensaje: 'Leído',
        descripcion_estado_mensaje: 'El destinatario ha leído el mensaje.',
        fecha_creacion_estado_mensaje: now,
        fecha_modificacion_estado_mensaje: now
      },
      {
        nombre_estado_mensaje: 'Pendiente',
        descripcion_estado_mensaje: 'El mensaje está en espera de ser entregado.',
        fecha_creacion_estado_mensaje: now,
        fecha_modificacion_estado_mensaje: now
      },
      {
        nombre_estado_mensaje: 'Fallido',
        descripcion_estado_mensaje: 'El mensaje no pudo ser entregado.',
        fecha_creacion_estado_mensaje: now,
        fecha_modificacion_estado_mensaje: now
      },
      {
        nombre_estado_mensaje: 'Cancelado',
        descripcion_estado_mensaje: 'El envío del mensaje fue cancelado por el emisor.',
        fecha_creacion_estado_mensaje: now,
        fecha_modificacion_estado_mensaje: now
      },
      {
        nombre_estado_mensaje: 'Rechazado',
        descripcion_estado_mensaje: 'El sistema rechazó el mensaje debido a contenido no permitido.',
        fecha_creacion_estado_mensaje: now,
        fecha_modificacion_estado_mensaje: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('estado_mensaje', {
      nombre_estado_mensaje: [
        'Enviado',
        'Recibido',
        'Leído',
        'Pendiente',
        'Fallido',
        'Cancelado',
        'Rechazado'
      ]
    }, {});
  }
};