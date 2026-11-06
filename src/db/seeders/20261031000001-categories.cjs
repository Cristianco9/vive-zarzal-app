'use strict';

const categories = [
  ['Desayunos', 'desayunos', 'Ideas para empezar el día.'],
  ['Almuerzos', 'almuerzos', 'Platos principales para el mediodía.'],
  ['Cenas', 'cenas', 'Preparaciones ligeras o especiales para la noche.'],
  ['Postres', 'postres', 'Dulces, tortas y otros finales felices.'],
  ['Bebidas', 'bebidas', 'Jugos, café, batidos y bebidas caseras.'],
  ['Comida tradicional', 'comida-tradicional', 'Recetas y platos de la cocina local.'],
  ['Comida vegetariana', 'comida-vegetariana', 'Opciones sin carne.'],
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const [rows] = await queryInterface.sequelize.query(
      'SELECT COUNT(*)::int AS count FROM categories'
    );

    if (rows[0].count > 0) {
      return;
    }

    const now = new Date();

    await queryInterface.bulkInsert(
      'categories',
      categories.map(([name, slug, description]) => ({
        name,
        slug,
        description,
        created_at: now,
        updated_at: now,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', {
      slug: categories.map(([, slug]) => slug),
    });
  },
};
