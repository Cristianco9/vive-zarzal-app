'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('genero', [
      {
        tipo_genero: 'Masculino',
        fecha_creacion_genero: now,
        fecha_actualizacion_genero: now
      },
      {
        tipo_genero: 'Femenino',
        fecha_creacion_genero: now,
        fecha_actualizacion_genero: now
      },
      {
        tipo_genero: 'No binario',
        fecha_creacion_genero: now,
        fecha_actualizacion_genero: now
      },
      {
        tipo_genero: 'Prefiero no decirlo',
        fecha_creacion_genero: now,
        fecha_actualizacion_genero: now
      },
      {
        tipo_genero: 'Otro',
        fecha_creacion_genero: now,
        fecha_actualizacion_genero: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('genero', {
      tipo_genero: [
        'Masculino',
        'Femenino',
        'No binario',
        'Prefiero no decirlo',
        'Otro'
      ]
    }, {});
  }
};