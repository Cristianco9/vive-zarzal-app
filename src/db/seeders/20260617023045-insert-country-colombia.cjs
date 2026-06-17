// src/db/seeders/20260617-insert-country-colombia.cjs
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta el país Colombia en la tabla 'pais'
    return queryInterface.bulkInsert('pais', [
      {
        nombre_pais: 'Colombia',
        descripcion_pais: 'República de Colombia'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Elimina la fila insertada por la semilla
    return queryInterface.bulkDelete('pais', { nombre_pais: 'Colombia' }, {});
  }
};