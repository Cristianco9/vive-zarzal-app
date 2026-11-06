'use strict';

const { QueryTypes } = require('sequelize');

const departments = [
  { name: 'Valle del Cauca', code: 'VAC' },
  { name: 'Antioquia', code: 'ANT' },
  { name: 'Cundinamarca', code: 'CUN' },
];

const cities = {
  'Valle del Cauca': [
    { name: 'Zarzal', code: 'ZAR' },
    { name: 'Cali', code: 'CAL' },
    { name: 'Palmira', code: 'PAL' },
  ],
  Antioquia: [{ name: 'Medellín', code: 'MED' }],
  Cundinamarca: [{ name: 'Bogotá', code: 'BOG' }],
};

const select = (queryInterface, sql, replacements = {}) =>
  queryInterface.sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements,
  });

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    let country = await select(
      queryInterface,
      'SELECT id FROM countries WHERE iso2 = :iso2',
      { iso2: 'CO' }
    );

    if (!country.length) {
      await queryInterface.bulkInsert('countries', [
        {
          name: 'Colombia',
          iso2: 'CO',
          iso3: 'COL',
          phone_code: '+57',
          created_at: now,
          updated_at: now,
        },
      ]);
      country = await select(
        queryInterface,
        'SELECT id FROM countries WHERE iso2 = :iso2',
        { iso2: 'CO' }
      );
    }

    const countryId = country[0].id;

    for (const department of departments) {
      let row = await select(
        queryInterface,
        `SELECT id FROM departments
         WHERE country_id = :countryId AND name = :name`,
        { countryId, name: department.name }
      );

      if (!row.length) {
        await queryInterface.bulkInsert('departments', [
          {
            country_id: countryId,
            name: department.name,
            code: department.code,
            created_at: now,
            updated_at: now,
          },
        ]);
        row = await select(
          queryInterface,
          `SELECT id FROM departments
           WHERE country_id = :countryId AND name = :name`,
          { countryId, name: department.name }
        );
      }

      const departmentId = row[0].id;

      for (const city of cities[department.name] || []) {
        const existingCity = await select(
          queryInterface,
          `SELECT id FROM cities
           WHERE department_id = :departmentId AND name = :name`,
          { departmentId, name: city.name }
        );

        if (!existingCity.length) {
          await queryInterface.bulkInsert('cities', [
            {
              department_id: departmentId,
              name: city.name,
              code: city.code,
              created_at: now,
              updated_at: now,
            },
          ]);
        }
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('countries', { iso2: 'CO' });
  },
};
