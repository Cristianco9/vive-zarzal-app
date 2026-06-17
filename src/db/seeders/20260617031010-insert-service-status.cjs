'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('estado_servicio', [
      {
        nombre_estado_servicio: 'Disponible',
        descripcion_estado_servicio: 'El servicio está listo para ser solicitado o consumido inmediatamente.',
        fecha_creacion_estado_servicio: now,
        fecha_modificacion_estado_servicio: now
      },
      {
        nombre_estado_servicio: 'Bajo Pedido',
        descripcion_estado_servicio: 'El servicio se presta únicamente tras una solicitud específica del cliente.',
        fecha_creacion_estado_servicio: now,
        fecha_modificacion_estado_servicio: now
      },
      {
        nombre_estado_servicio: 'Requiere Reserva',
        descripcion_estado_servicio: 'El servicio debe ser reservado con anticipación para asegurar su disponibilidad.',
        fecha_creacion_estado_servicio: now,
        fecha_modificacion_estado_servicio: now
      },
      {
        nombre_estado_servicio: 'Agotado',
        descripcion_estado_servicio: 'El servicio no está disponible temporalmente.',
        fecha_creacion_estado_servicio: now,
        fecha_modificacion_estado_servicio: now
      },
      {
        nombre_estado_servicio: 'Entrega Inmediata',
        descripcion_estado_servicio: 'El servicio se entrega sin demoras ni necesidad de reserva previa.',
        fecha_creacion_estado_servicio: now,
        fecha_modificacion_estado_servicio: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('estado_servicio', {
      nombre_estado_servicio: [
        'Disponible',
        'Bajo Pedido',
        'Requiere Reserva',
        'Agotado',
        'Entrega Inmediata'
      ]
    }, {});
  }
};