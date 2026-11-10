import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { sequelize } from '../src/libraries/DBConnection.js';
import {
  Category,
  Comment,
  Publication,
  Report,
  User,
} from '../src/db/models/index.js';

let server;
let baseUrl;
let userA;
let userB;
let publication;
let comment;
let clientA;
let clientB;

const suffix = Date.now().toString().slice(-9);
const accountA = {
  firstName: 'Rosa',
  lastName: 'Reporte',
  username: `repa${suffix}`,
  email: `repa${suffix}@example.com`,
  password: 'password123',
};
const accountB = {
  firstName: 'Mario',
  lastName: 'Reporte',
  username: `repb${suffix}`,
  email: `repb${suffix}@example.com`,
  password: 'password123',
};

const createClient = () => {
  let cookie = '';

  return {
    async form(path, data) {
      const headers = new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      });

      if (cookie) {
        headers.set('cookie', cookie);
      }

      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers,
        body: new URLSearchParams(data).toString(),
        redirect: 'manual',
      });

      const authCookie = (response.headers.getSetCookie?.() || []).find(
        (item) => item.startsWith('authentication=')
      );

      if (authCookie) {
        cookie = authCookie.split(';')[0];
      }

      return response;
    },
  };
};

const location = (response) =>
  decodeURIComponent(response.headers.get('location') || '');

const countReports = (where) => Report.count({ where });

before(async () => {
  await sequelize.authenticate();

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const category = await Category.findOne({ order: [['id', 'ASC']] });
  assert.ok(
    category,
    'No hay categorías. Ejecuta "npm run migrations:run" y "npm run seeds:run".'
  );

  clientA = createClient();
  clientB = createClient();

  for (const account of [accountA, accountB]) {
    await createClient().form('/register', {
      ...account,
      confirmPassword: account.password,
    });
  }

  const loginA = await clientA.form('/login', {
    identifier: accountA.username,
    password: accountA.password,
  });
  const loginB = await clientB.form('/login', {
    identifier: accountB.username,
    password: accountB.password,
  });
  assert.equal(loginA.status, 302);
  assert.equal(loginB.status, 302);

  userA = await User.findOne({ where: { username: accountA.username } });
  userB = await User.findOne({ where: { username: accountB.username } });
  assert.ok(userA && userB, 'No se crearon los usuarios de prueba.');

  publication = await Publication.create({
    userId: userA.id,
    categoryId: category.id,
    type: 'dish',
    title: 'Plato de prueba para reportes',
    description: 'Descripción suficientemente larga para la prueba.',
  });

  comment = await Comment.create({
    userId: userA.id,
    publicationId: publication.id,
    content: 'Comentario de prueba para reportes',
  });
});

after(async () => {
  const users = await User.findAll({
    where: { username: [accountA.username, accountB.username] },
  });
  const ids = users.map((user) => user.id);

  await Report.destroy({ where: { reporterId: ids } });
  await User.destroy({ where: { id: ids } });

  server.closeAllConnections?.();
  await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
});

// Las pruebas de cada bloque dependen del orden: crear -> duplicado.

test('reportar publicación: un motivo inválido no crea el reporte', async () => {
  const response = await clientB.form(`/publications/${publication.id}/report`, {
    reason: 'inventado',
  });

  assert.equal(response.status, 302);
  assert.match(location(response), /error=/);
  assert.equal(
    await countReports({ reporterId: userB.id, publicationId: publication.id }),
    0
  );
});

test('reportar publicación: crea el reporte con status pending', async () => {
  const response = await clientB.form(`/publications/${publication.id}/report`, {
    reason: 'spam',
    details: 'Parece publicidad',
  });

  assert.equal(response.status, 302);
  assert.match(location(response), /success=/);

  const report = await Report.findOne({
    where: { reporterId: userB.id, publicationId: publication.id },
  });
  assert.ok(report);
  assert.equal(report.status, 'pending');
  assert.equal(report.reason, 'spam');
  assert.equal(report.commentId, null);
});

test('reportar publicación: el duplicado se rechaza sin crear otro', async () => {
  const response = await clientB.form(`/publications/${publication.id}/report`, {
    reason: 'hate',
  });

  assert.equal(response.status, 302);
  assert.match(location(response), /Ya reportaste/);
  assert.equal(
    await countReports({ reporterId: userB.id, publicationId: publication.id }),
    1
  );
});

test('reportar publicación: no se puede reportar contenido propio (403)', async () => {
  const response = await clientA.form(`/publications/${publication.id}/report`, {
    reason: 'spam',
  });

  assert.equal(response.status, 403);
  assert.equal(
    await countReports({ reporterId: userA.id, publicationId: publication.id }),
    0
  );
});

test('reportar publicación inexistente devuelve 404', async () => {
  const response = await clientB.form('/publications/999999999/report', {
    reason: 'spam',
  });

  assert.equal(response.status, 404);
});

test('reportar publicación sin sesión redirige al login', async () => {
  const response = await createClient().form(
    `/publications/${publication.id}/report`,
    { reason: 'spam' }
  );

  assert.equal(response.status, 302);
  assert.match(location(response), /^\/login/);
});

test('reportar comentario: un motivo inválido no crea el reporte', async () => {
  const response = await clientB.form(`/comments/${comment.id}/report`, {
    reason: 'inventado',
  });

  assert.equal(response.status, 302);
  assert.match(location(response), /error=/);
  assert.equal(
    await countReports({ reporterId: userB.id, commentId: comment.id }),
    0
  );
});

test('reportar comentario: crea el reporte con status pending', async () => {
  const response = await clientB.form(`/comments/${comment.id}/report`, {
    reason: 'harassment',
  });

  assert.equal(response.status, 302);
  assert.match(location(response), /success=/);

  const report = await Report.findOne({
    where: { reporterId: userB.id, commentId: comment.id },
  });
  assert.ok(report);
  assert.equal(report.status, 'pending');
  assert.equal(report.publicationId, null);
});

test('reportar comentario: el duplicado se rechaza sin crear otro', async () => {
  const response = await clientB.form(`/comments/${comment.id}/report`, {
    reason: 'spam',
  });

  assert.equal(response.status, 302);
  assert.match(location(response), /Ya reportaste/);
  assert.equal(
    await countReports({ reporterId: userB.id, commentId: comment.id }),
    1
  );
});

test('reportar comentario: no se puede reportar contenido propio (403)', async () => {
  const response = await clientA.form(`/comments/${comment.id}/report`, {
    reason: 'spam',
  });

  assert.equal(response.status, 403);
});

test('reportar comentario inexistente devuelve 404', async () => {
  const response = await clientB.form('/comments/999999999/report', {
    reason: 'spam',
  });

  assert.equal(response.status, 404);
});

test('reportar comentario sin sesión redirige al login', async () => {
  const response = await createClient().form(`/comments/${comment.id}/report`, {
    reason: 'spam',
  });

  assert.equal(response.status, 302);
  assert.match(location(response), /^\/login/);
});