'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('estado_reserva', [
      {
        nombre_estado_reserva: 'Pendiente',
        descripcion_estado_reserva: 'La reserva ha sido creada pero aún no confirmada.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      },
      {
        nombre_estado_reserva: 'Confirmada',
        descripcion_estado_reserva: 'La reserva ha sido aceptada y confirmada por el proveedor.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      },
      {
        nombre_estado_reserva: 'En Curso',
        descripcion_estado_reserva: 'La reserva está activa en este momento.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      },
      {
        nombre_estado_reserva: 'Finalizada',
        descripcion_estado_reserva: 'La reserva se ha completado satisfactoriamente.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      },
      {
        nombre_estado_reserva: 'Cancelada',
        descripcion_estado_reserva: 'La reserva fue cancelada por el cliente o el proveedor.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      },
      {
        nombre_estado_reserva: 'Rechazada',
        descripcion_estado_reserva: 'La reserva fue rechazada por el proveedor.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      },
      {
        nombre_estado_reserva: 'Expirada',
        descripcion_estado_reserva: 'La reserva no fue confirmada a tiempo y ha caducado.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      },
      {
        nombre_estado_reserva: 'No Show',
        descripcion_estado_reserva: 'El cliente no se presentó sin aviso previo.',
        fecha_creacion_estado_reserva: now,
        fecha_modificacion_estado_reserva: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('estado_reserva', {
      nombre_estado_reserva: [
        'Pendiente',
        'Confirmada',
        'En Curso',
        'Finalizada',
        'Cancelada',
        'Rechazada',
        'Expirada',
        'No Show'
      ]
    }, {});
  }
};