'use strict';

const { QueryTypes } = require('sequelize');

const tags = [
  ['Rápido', 'rapido'],
  ['Económico', 'economico'],
  ['Saludable', 'saludable'],
  ['Tradicional', 'tradicional'],
  ['Vegetariano', 'vegetariano'],
  ['Sin gluten', 'sin-gluten'],
  ['Postre', 'postre'],
  ['Familiar', 'familiar'],
];

module.exports = {
  async up(queryInterface) {
    const existing = await queryInterface.sequelize.query(
      'SELECT slug FROM tags',
      { type: QueryTypes.SELECT }
    );
    const existingSlugs = new Set(existing.map((tag) => tag.slug));
    const now = new Date();

    const newTags = tags.filter(([, slug]) => !existingSlugs.has(slug));

    if (newTags.length) {
      await queryInterface.bulkInsert(
        'tags',
        newTags.map(([name, slug]) => ({
          name,
          slug,
          created_at: now,
          updated_at: now,
        }))
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tags', {
      slug: tags.map(([, slug]) => slug),
    });
  },
};
