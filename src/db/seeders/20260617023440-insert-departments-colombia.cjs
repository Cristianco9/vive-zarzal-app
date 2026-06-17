// src/db/seeders/20260617-insert-departments-colombia.cjs
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('departamento', [
      { nombre_departamento: 'Amazonas', id_pais: 1, descripcion_departamento: 'Departamento de la región Amazonía' },
      { nombre_departamento: 'Antioquia', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Arauca', id_pais: 1, descripcion_departamento: 'Departamento de la región Orinoquía' },
      { nombre_departamento: 'Atlántico', id_pais: 1, descripcion_departamento: 'Departamento de la región Caribe' },
      { nombre_departamento: 'Bolívar', id_pais: 1, descripcion_departamento: 'Departamento de la región Caribe' },
      { nombre_departamento: 'Boyacá', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Caldas', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Caquetá', id_pais: 1, descripcion_departamento: 'Departamento de la región Amazonía' },
      { nombre_departamento: 'Casanare', id_pais: 1, descripcion_departamento: 'Departamento de la región Orinoquía' },
      { nombre_departamento: 'Cauca', id_pais: 1, descripcion_departamento: 'Departamento de la región Pacífica' },
      { nombre_departamento: 'Cesar', id_pais: 1, descripcion_departamento: 'Departamento de la región Caribe' },
      { nombre_departamento: 'Chocó', id_pais: 1, descripcion_departamento: 'Departamento de la región Pacífica' },
      { nombre_departamento: 'Córdoba', id_pais: 1, descripcion_departamento: 'Departamento de la región Caribe' },
      { nombre_departamento: 'Cundinamarca', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Guainía', id_pais: 1, descripcion_departamento: 'Departamento de la región Amazonía' },
      { nombre_departamento: 'Guaviare', id_pais: 1, descripcion_departamento: 'Departamento de la región Amazonía' },
      { nombre_departamento: 'Huila', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'La Guajira', id_pais: 1, descripcion_departamento: 'Departamento de la región Caribe' },
      { nombre_departamento: 'Magdalena', id_pais: 1, descripcion_departamento: 'Departamento de la región Caribe' },
      { nombre_departamento: 'Meta', id_pais: 1, descripcion_departamento: 'Departamento de la región Orinoquía' },
      { nombre_departamento: 'Nariño', id_pais: 1, descripcion_departamento: 'Departamento de la región Pacífica' },
      { nombre_departamento: 'Norte de Santander', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Putumayo', id_pais: 1, descripcion_departamento: 'Departamento de la región Amazonía' },
      { nombre_departamento: 'Quindío', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Risaralda', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'San Andrés y Providencia', id_pais: 1, descripcion_departamento: 'Departamento de la región Insular' },
      { nombre_departamento: 'Santander', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Sucre', id_pais: 1, descripcion_departamento: 'Departamento de la región Caribe' },
      { nombre_departamento: 'Tolima', id_pais: 1, descripcion_departamento: 'Departamento de la región Andina' },
      { nombre_departamento: 'Valle del Cauca', id_pais: 1, descripcion_departamento: 'Departamento de la región Pacífica' },
      { nombre_departamento: 'Vaupés', id_pais: 1, descripcion_departamento: 'Departamento de la región Amazonía' },
      { nombre_departamento: 'Vichada', id_pais: 1, descripcion_departamento: 'Departamento de la región Orinoquía' },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('departamento', {
      id_pais: 1
    }, {});
  }
};