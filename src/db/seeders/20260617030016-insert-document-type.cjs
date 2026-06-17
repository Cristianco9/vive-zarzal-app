'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('tipo_documento', [
      {
        nombre_tipo_documento: 'Cédula de ciudadanía',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Tarjeta de identidad',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Registro civil',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Cédula de extranjería',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Permiso Especial de Permanencia (PEP)',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Pasaporte',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Documento de identificación extranjero',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'NIT',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Documento Nacional de Identidad (DNI)',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Documento militar',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      },
      {
        nombre_tipo_documento: 'Cédula de ciudadanía - duplicado',
        fecha_creacion_tipo_documento: now,
        fecha_modificacion_tipo_documento: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tipo_documento', {
      nombre_tipo_documento: [
        'Cédula de ciudadanía',
        'Tarjeta de identidad',
        'Registro civil',
        'Cédula de extranjería',
        'Permiso Especial de Permanencia (PEP)',
        'Pasaporte',
        'Documento de identificación extranjero',
        'NIT',
        'Documento Nacional de Identidad (DNI)',
        'Documento militar',
        'Cédula de ciudadanía - duplicado'
      ]
    }, {});
  }
};