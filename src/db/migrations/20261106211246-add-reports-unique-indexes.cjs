'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX reports_unique_reporter_publication
      ON reports (reporter_id, publication_id)
      WHERE publication_id IS NOT NULL
    `);
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX reports_unique_reporter_comment
      ON reports (reporter_id, comment_id)
      WHERE comment_id IS NOT NULL
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS reports_unique_reporter_comment');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS reports_unique_reporter_publication');
  },
};