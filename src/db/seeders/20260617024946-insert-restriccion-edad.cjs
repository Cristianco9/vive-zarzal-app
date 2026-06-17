'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('restriccion_edad', [
      {
        nombre_restriccion_edad: 'Todo Público',
        descripcion_restriccion_edad: 'Acceso permitido a personas de todas las edades sin restricciones.',
        fecha_creacion_restriccion_edad: now,
        fecha_modificacion_restriccion_edad: now
      },
      {
        nombre_restriccion_edad: 'Mayores de Edad',
        descripcion_restriccion_edad: 'Solo personas mayores de 18 años pueden acceder.',
        fecha_creacion_restriccion_edad: now,
        fecha_modificacion_restriccion_edad: now
      },
      {
        nombre_restriccion_edad: 'Menores con Acompañante',
        descripcion_restriccion_edad: 'Personas menores de edad pueden ingresar únicamente acompañadas por un adulto responsable.',
        fecha_creacion_restriccion_edad: now,
        fecha_modificacion_restriccion_edad: now
      },
      {
        nombre_restriccion_edad: 'Menores de Edad',
        descripcion_restriccion_edad: 'Exclusivo para personas menores de 18 años.',
        fecha_creacion_restriccion_edad: now,
        fecha_modificacion_restriccion_edad: now
      },
      {
        nombre_restriccion_edad: 'Niños y Adolescentes',
        descripcion_restriccion_edad: 'Dirigido específicamente a niños y adolescentes entre 6 y 17 años.',
        fecha_creacion_restriccion_edad: now,
        fecha_modificacion_restriccion_edad: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('restriccion_edad', {
      nombre_restriccion_edad: [
        'Todo Público',
        'Mayores de Edad',
        'Menores con Acompañante',
        'Menores de Edad',
        'Niños y Adolescentes'
      ]
    }, {});
  }
};