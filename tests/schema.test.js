import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { sequelize } from '../src/libraries/DBConnection.js';
import {
  Country,
  Department,
  DocumentType,
  Favorite,
  Notification,
  Permission,
  Publication,
  Report,
  Role,
  Tag,
  User,
  setupAssociations,
} from '../src/db/models/index.js';

const expectedTables = [
  'users',
  'categories',
  'publications',
  'likes',
  'ratings',
  'comments',
  'roles',
  'permissions',
  'role_permissions',
  'user_roles',
  'document_types',
  'user_documents',
  'countries',
  'departments',
  'cities',
  'user_addresses',
  'tags',
  'publication_tags',
  'favorites',
  'notifications',
  'reports',
];

before(async () => {
  await sequelize.authenticate();
  setupAssociations();
});

after(async () => {
  await sequelize.close();
});

test('el esquema contiene las 21 tablas del dominio', async () => {
  const tables = await sequelize.getQueryInterface().showAllTables();
  const names = tables.map((table) =>
    typeof table === 'string' ? table : table.tableName
  );

  expectedTables.forEach((table) => {
    assert.ok(names.includes(table), `Falta la tabla ${table}`);
  });

  assert.ok(
    names.length >= expectedTables.length,
    `Se esperaban al menos ${expectedTables.length} tablas y hay ${names.length}`
  );
});

test('los catálogos iniciales están sembrados', async () => {
  const roles = await Role.findAll({
    include: [{ model: Permission, as: 'permissions' }],
  });
  const member = roles.find((role) => role.slug === 'member');

  assert.ok(roles.some((role) => role.slug === 'admin'));
  assert.ok(roles.some((role) => role.slug === 'moderator'));
  assert.ok(member);
  assert.ok(member.permissions.length >= 6);

  assert.ok((await DocumentType.count()) >= 5);
  assert.ok((await Tag.count()) >= 8);

  const colombia = await Country.findOne({
    where: { iso2: 'CO' },
    include: [{ model: Department, as: 'departments' }],
  });

  assert.ok(colombia);
  assert.ok(colombia.departments.length >= 3);
});

test('las asociaciones nuevas están registradas', () => {
  assert.ok(User.associations.roles);
  assert.ok(User.associations.documents);
  assert.ok(User.associations.addresses);
  assert.ok(Publication.associations.tags);
  assert.ok(User.associations.favorites);
  assert.ok(Favorite.associations.publication);
  assert.ok(User.associations.notifications);
  assert.ok(Notification.associations.recipient);
  assert.ok(Report.associations.reporter);
  assert.ok(Report.associations.publication);
  assert.ok(Report.associations.comment);
});
