'use strict';

const { QueryTypes } = require('sequelize');

const documentTypes = [
  ['Cédula de ciudadanía', 'CC', 'Documento de identificación para ciudadanos colombianos.'],
  ['Cédula de extranjería', 'CE', 'Documento de identificación para residentes extranjeros.'],
  ['Pasaporte', 'PA', 'Documento de viaje internacional.'],
  ['Tarjeta de identidad', 'TI', 'Documento de identificación para menores de edad.'],
  ['Permiso por Protección Temporal', 'PPT', 'Documento para población migrante venezolana.'],
  ['NIT', 'NIT', 'Número de identificación tributaria para personas jurídicas.'],
];

module.exports = {
  async up(queryInterface) {
    const existing = await queryInterface.sequelize.query(
      'SELECT code FROM document_types',
      { type: QueryTypes.SELECT }
    );
    const existingCodes = new Set(existing.map((item) => item.code));
    const now = new Date();

    const newTypes = documentTypes.filter(([, code]) => !existingCodes.has(code));

    if (newTypes.length) {
      await queryInterface.bulkInsert(
        'document_types',
        newTypes.map(([name, code, description]) => ({
          name,
          code,
          description,
          is_active: true,
          created_at: now,
          updated_at: now,
        }))
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('document_types', {
      code: documentTypes.map(([, code]) => code),
    });
  },
};
