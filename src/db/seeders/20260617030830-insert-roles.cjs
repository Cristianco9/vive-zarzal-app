'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('rol', [
      {
        tipo_rol: 'Administrador',
        descripcion_rol: 'Usuario con acceso total al sistema, puede gestionar todos los recursos.',
        fecha_creacion_rol: now,
        fecha_actualizacion_rol: now
      },
      {
        tipo_rol: 'Anunciante',
        descripcion_rol: 'Proveedor o entidad que publica servicios, productos o eventos en la plataforma.',
        fecha_creacion_rol: now,
        fecha_actualizacion_rol: now
      },
      {
        tipo_rol: 'Cliente',
        descripcion_rol: 'Usuario final que consume los servicios, realiza reservas o interactúa con anunciantes.',
        fecha_creacion_rol: now,
        fecha_actualizacion_rol: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rol', {
      tipo_rol: ['Administrador', 'Anunciante', 'Cliente']
    }, {});
  }
};