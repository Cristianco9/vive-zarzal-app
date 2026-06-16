'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  // ============================================================
  // UP — Create the 'departamento' table
  // ============================================================
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('departamento', {

      // Primary key
      id_departamento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },

      // Foreign key to pais
      id_pais: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pais',
          key: 'id_pais',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      // Department name
      nombre_departamento: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      // Department description
      descripcion_departamento: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

    });
  },

  // ============================================================
  // DOWN — Drop the 'departamento' table
  // ============================================================
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('departamento');
  },

};
