import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import { sequelize } from '../src/libraries/DBConnection.js';
import { Permission, Role, User, setupAssociations } from '../src/db/models/index.js';
import {
  loadCurrentUser,
  requirePermission,
  requireRole,
} from '../src/middlewares/auth.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { signToken } from '../src/utils/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const suffix = Date.now().toString().slice(-9);
const accounts = {
  admin: { role: 'admin' },
  moderator: { role: 'moderator' },
  member: { role: 'member' },
};

let server;
let baseUrl;
const users = {};
const cookies = {};

// App mínima solo para las pruebas: usa el mismo loadCurrentUser, las mismas
// vistas y el mismo errorHandler que la app real, con rutas protegidas de ejemplo.
const buildTestApp = () => {
  const testApp = express();

  testApp.set('view engine', 'ejs');
  testApp.set('views', path.join(__dirname, '../src/views'));
  testApp.use(cookieParser());
  testApp.use(loadCurrentUser);

  testApp.get('/solo-admin', requireRole('admin'), (req, res) => {
    res.send('ok');
  });
  testApp.get('/staff', requireRole('admin', 'moderator'), (req, res) => {
    res.send('ok');
  });
  testApp.get('/reportes', requirePermission('reports:manage'), (req, res) => {
    res.send('ok');
  });
  testApp.get('/publicar', requirePermission('publications:create'), (req, res) => {
    res.send('ok');
  });
  testApp.get('/helper-can', (req, res) => {
    res.json({
      reports: res.locals.can('reports:manage'),
      create: res.locals.can('publications:create'),
      unknown: res.locals.can('no:existe'),
    });
  });
  testApp.get('/permisos', (req, res) => {
    res.json(req.currentUser ? req.currentUser.permissions : null);
  });

  testApp.use(errorHandler);

  return testApp;
};

const get = (route, { as, headers = {} } = {}) => {
  const requestHeaders = new Headers(headers);

  if (as) {
    requestHeaders.set('cookie', cookies[as]);
  }

  return fetch(`${baseUrl}${route}`, {
    headers: requestHeaders,
    redirect: 'manual',
  });
};

before(async () => {
  await sequelize.authenticate();
  setupAssociations();

  for (const [name, { role: roleSlug }] of Object.entries(accounts)) {
    const role = await Role.findOne({ where: { slug: roleSlug } });
    assert.ok(
      role,
      'No hay roles. Ejecuta "npm run migrations:run" y "npm run seeds:run".'
    );

    const user = await User.create({
      firstName: 'Auth',
      lastName: name,
      username: `authz_${name}_${suffix}`,
      email: `authz_${name}_${suffix}@example.com`,
      password: 'no-se-usa-en-estas-pruebas',
    });
    await user.addRole(role);

    users[name] = user;
    cookies[name] = `authentication=${signToken(user)}`;
  }

  server = buildTestApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await User.destroy({
    where: { id: Object.values(users).map((user) => user.id) },
  });

  server.closeAllConnections?.();
  await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
});

test('sin sesión, una ruta protegida redirige al login', async () => {
  const response = await get('/solo-admin');

  assert.equal(response.status, 302);
  assert.match(
    decodeURIComponent(response.headers.get('location')),
    /^\/login\?next=\/solo-admin/
  );
});

test('con un token inválido se trata como usuario sin sesión', async () => {
  const response = await get('/solo-admin', {
    headers: { cookie: 'authentication=token-falso' },
  });

  assert.equal(response.status, 302);
  assert.match(response.headers.get('location'), /^\/login/);
});

test('requireRole("admin") responde 403 a un member', async () => {
  const response = await get('/solo-admin', { as: 'member' });
  const body = await response.text();

  assert.equal(response.status, 403);
  assert.match(body, /No tienes permiso/);
});

test('requireRole("admin") responde 403 a un moderator', async () => {
  const response = await get('/solo-admin', { as: 'moderator' });

  assert.equal(response.status, 403);
});

test('requireRole("admin") responde 200 a un admin', async () => {
  const response = await get('/solo-admin', { as: 'admin' });

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'ok');
});

test('requireRole acepta varios roles: basta con tener uno', async () => {
  assert.equal((await get('/staff', { as: 'admin' })).status, 200);
  assert.equal((await get('/staff', { as: 'moderator' })).status, 200);
  assert.equal((await get('/staff', { as: 'member' })).status, 403);
});

test('el 403 responde JSON cuando el cliente no pide HTML', async () => {
  const response = await get('/solo-admin', {
    as: 'member',
    headers: { accept: 'application/json' },
  });

  assert.equal(response.status, 403);
  assert.match((await response.json()).error, /No tienes permiso/);
});

test('requirePermission("reports:manage"): moderator y admin sí, member no', async () => {
  assert.equal((await get('/reportes')).status, 302);
  assert.equal((await get('/reportes', { as: 'member' })).status, 403);
  assert.equal((await get('/reportes', { as: 'moderator' })).status, 200);
  assert.equal((await get('/reportes', { as: 'admin' })).status, 200);
});

test('requirePermission("publications:create"): member y admin sí, moderator no', async () => {
  assert.equal((await get('/publicar', { as: 'member' })).status, 200);
  assert.equal((await get('/publicar', { as: 'admin' })).status, 200);
  assert.equal((await get('/publicar', { as: 'moderator' })).status, 403);
});

test('el admin carga todos los permisos sembrados, sin repetidos', async () => {
  const response = await get('/permisos', { as: 'admin' });
  const loaded = await response.json();
  const total = await Permission.count();

  assert.equal(loaded.length, total);
  assert.equal(new Set(loaded).size, total);
});

test('el member solo carga los permisos de su rol', async () => {
  const loaded = await (await get('/permisos', { as: 'member' })).json();

  assert.ok(loaded.includes('publications:create'));
  assert.ok(!loaded.includes('reports:manage'));
  assert.ok(!loaded.includes('roles:manage'));
});

test('can() en las vistas refleja los permisos del usuario', async () => {
  const asMember = await (await get('/helper-can', { as: 'member' })).json();
  const asModerator = await (await get('/helper-can', { as: 'moderator' })).json();
  const asAdmin = await (await get('/helper-can', { as: 'admin' })).json();
  const anonymous = await (await get('/helper-can')).json();

  assert.deepEqual(asMember, { reports: false, create: true, unknown: false });
  assert.deepEqual(asModerator, { reports: true, create: false, unknown: false });
  assert.deepEqual(asAdmin, { reports: true, create: true, unknown: false });
  assert.deepEqual(anonymous, { reports: false, create: false, unknown: false });
});
