import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { sequelize } from '../src/libraries/DBConnection.js';
import {
  Category,
  Comment,
  Like,
  Publication,
  Rating,
  Role,
  User,
} from '../src/db/models/index.js';
import { deleteStoredImage } from '../src/middlewares/upload.js';

let server;
let baseUrl;
let category;
let userA;
let userB;
let dishId;
let recipeId;
let uploadedImageUrl;

const suffix = Date.now().toString().slice(-9);
const accountA = {
  firstName: 'Ana',
  lastName: 'Prueba',
  username: `testa${suffix}`,
  email: `testa${suffix}@example.com`,
  password: 'password123',
};
const accountB = {
  firstName: 'Luis',
  lastName: 'Prueba',
  username: `testb${suffix}`,
  email: `testb${suffix}@example.com`,
  password: 'password123',
};

const createClient = () => {
  let cookie = '';

  return {
    async fetch(path, options = {}) {
      const headers = new Headers(options.headers || {});

      if (cookie) {
        headers.set('cookie', cookie);
      }

      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers,
        redirect: 'manual',
      });

      const setCookies = response.headers.getSetCookie
        ? response.headers.getSetCookie()
        : [];
      const authCookie = setCookies.find((item) =>
        item.startsWith('authentication=')
      );

      if (authCookie) {
        cookie = authCookie.split(';')[0];
      }

      return response;
    },

    form(path, data, method = 'POST') {
      return this.fetch(path, {
        method,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
      });
    },

    multipart(path, fields, file, method = 'POST') {
      const body = new FormData();

      Object.entries(fields).forEach(([key, value]) => {
        body.set(key, value);
      });

      if (file) {
        body.set(
          'image',
          new Blob([file.buffer], { type: file.type }),
          file.name
        );
      }

      return this.fetch(path, { method, body });
    },
  };
};

const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=',
  'base64'
);

const location = (response) => response.headers.get('location') || '';

before(async () => {
  await sequelize.authenticate();

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  category = await Category.findOne({ order: [['id', 'ASC']] });

  assert.ok(
    category,
    'No hay categorías. Ejecuta "npm run migrations:run" y "npm run seeds:run".'
  );
});

after(async () => {
  await User.destroy({
    where: { username: [accountA.username, accountB.username] },
  });

  if (uploadedImageUrl) {
    deleteStoredImage(uploadedImageUrl);
  }

  await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
});

test('foro comunitario de comida: flujos esenciales', async (t) => {
  const clientA = createClient();
  const clientB = createClient();

  await t.test('la portada y las categorías están disponibles', async () => {
    const home = await clientA.fetch('/');
    assert.equal(home.status, 200);
    assert.match(await home.text(), /Publicaciones recientes/);

    const categoryPage = await clientA.fetch(`/categories/${category.slug}`);
    assert.equal(categoryPage.status, 200);
  });

  await t.test('las rutas del marketplace ya no existen', async () => {
    const services = await clientA.fetch('/services');
    assert.equal(services.status, 404);

    const oldApi = await clientA.fetch('/app/v1/services');
    assert.equal(oldApi.status, 404);

    const oldUsers = await clientA.fetch('/app/v1/users/login');
    assert.equal(oldUsers.status, 404);
  });

  await t.test('registro de usuarios y validación de duplicados', async () => {
    const registerA = await clientA.form('/register', {
      ...accountA,
      confirmPassword: accountA.password,
    });
    assert.equal(registerA.status, 302);
    assert.match(location(registerA), /\/login\?success=/);

    const registerB = await clientB.form('/register', {
      ...accountB,
      confirmPassword: accountB.password,
    });
    assert.equal(registerB.status, 302);

    const duplicate = await clientA.form('/register', {
      ...accountA,
      confirmPassword: accountA.password,
    });
    assert.equal(duplicate.status, 409);
    assert.match(await duplicate.text(), /ya está en uso/);

    userA = await User.findOne({ where: { username: accountA.username } });
    userB = await User.findOne({ where: { username: accountB.username } });
    assert.ok(userA);
    assert.ok(userB);

    const memberRole = await Role.findOne({ where: { slug: 'member' } });
    const userRoles = await userA.getRoles();
    assert.ok(memberRole);
    assert.ok(userRoles.some((role) => role.id === memberRole.id));
  });

  await t.test('inicio de sesión y rechazo de credenciales inválidas', async () => {
    const wrongPassword = await clientA.form('/login', {
      identifier: accountA.username,
      password: 'incorrecta',
    });
    assert.equal(wrongPassword.status, 401);

    const loginA = await clientA.form('/login', {
      identifier: accountA.username,
      password: accountA.password,
    });
    assert.equal(loginA.status, 302);
    assert.equal(location(loginA), '/');

    const loginB = await clientB.form('/login', {
      identifier: accountB.email,
      password: accountB.password,
    });
    assert.equal(loginB.status, 302);
  });

  await t.test('crear publicación requiere autenticación', async () => {
    const anonymous = createClient();
    const response = await anonymous.fetch('/publications/new');
    assert.equal(response.status, 302);
    assert.match(location(response), /\/login\?next=/);
  });

  await t.test('crear un plato con imagen', async () => {
    const response = await clientA.multipart(
      '/publications',
      {
        type: 'dish',
        title: 'Arepa de prueba',
        description: 'Una arepa deliciosa con queso fresco para compartir.',
        categoryId: String(category.id),
      },
      { buffer: pngBuffer, type: 'image/png', name: 'arepa.png' }
    );

    assert.equal(response.status, 302);
    const redirect = location(response);
    assert.match(redirect, /\/publications\/\d+\?success=/);
    dishId = Number(redirect.match(/\/publications\/(\d+)/)[1]);

    const publication = await Publication.findByPk(dishId);
    assert.equal(publication.userId, userA.id);
    assert.equal(publication.categoryId, category.id);
    assert.equal(publication.type, 'dish');
    assert.equal(publication.title, 'Arepa de prueba');
    assert.match(publication.imageUrl, /^\/uploads\//);

    uploadedImageUrl = publication.imageUrl;

    const detail = await clientA.fetch(`/publications/${dishId}`);
    assert.equal(detail.status, 200);
    assert.match(await detail.text(), /Arepa de prueba/);

    const image = await clientA.fetch(publication.imageUrl);
    assert.equal(image.status, 200);
  });

  await t.test('rechazar archivos que no son imágenes', async () => {
    const response = await clientA.multipart(
      '/publications',
      {
        type: 'dish',
        title: 'Archivo inválido',
        description: 'Esta publicación no debe crearse con un archivo de texto.',
        categoryId: String(category.id),
      },
      { buffer: Buffer.from('no soy una imagen'), type: 'text/plain', name: 'nota.txt' }
    );

    assert.equal(response.status, 400);
    assert.match(await response.text(), /Solo se permiten imágenes/);
  });

  await t.test('crear una receta con ingredientes y preparación', async () => {
    const response = await clientA.multipart('/publications', {
      type: 'recipe',
      title: 'Sopa de prueba',
      description: 'Una sopa caliente y reconfortante para una tarde fría.',
      categoryId: String(category.id),
      ingredients: 'Zanahoria\nPapa\nCebolla',
      instructions: 'Picar todo y cocinar durante 30 minutos.',
    });

    assert.equal(response.status, 302);
    recipeId = Number(location(response).match(/\/publications\/(\d+)/)[1]);

    const publication = await Publication.findByPk(recipeId);
    assert.equal(publication.type, 'recipe');
    assert.match(publication.ingredients, /Zanahoria/);

    const detail = await clientA.fetch(`/publications/${recipeId}`);
    const html = await detail.text();
    assert.match(html, /Ingredientes/);
    assert.match(html, /Preparación/);
    assert.match(html, /Zanahoria/);
  });

  await t.test('el dueño puede editar su publicación', async () => {
    const response = await clientA.multipart(
      `/publications/${dishId}/edit`,
      {
        type: 'dish',
        title: 'Arepa de prueba actualizada',
        description: 'Una arepa deliciosa con queso fresco para compartir.',
        categoryId: String(category.id),
      }
    );

    assert.equal(response.status, 302);

    const publication = await Publication.findByPk(dishId);
    assert.equal(publication.title, 'Arepa de prueba actualizada');
  });

  await t.test('otro usuario no puede editar ni eliminar la publicación', async () => {
    const editResponse = await clientB.multipart(
      `/publications/${dishId}/edit`,
      {
        type: 'dish',
        title: 'Intento de edición',
        description: 'Esta descripción es suficientemente larga para pasar.',
        categoryId: String(category.id),
      }
    );
    assert.equal(editResponse.status, 403);
    assert.match(await editResponse.text(), /No tienes permiso/);

    const deleteResponse = await clientB.form(
      `/publications/${dishId}/delete`,
      {}
    );
    assert.equal(deleteResponse.status, 403);
  });

  await t.test('me gusta: alternar y evitar duplicados', async () => {
    await clientA.form(`/publications/${dishId}/like`, {});
    assert.equal(await Like.count({ where: { publicationId: dishId } }), 1);

    await clientA.form(`/publications/${dishId}/like`, {});
    assert.equal(await Like.count({ where: { publicationId: dishId } }), 0);

    await clientB.form(`/publications/${dishId}/like`, {});
    assert.equal(await Like.count({ where: { publicationId: dishId } }), 1);

    await assert.rejects(
      () => Like.create({ userId: userB.id, publicationId: dishId }),
      (error) => error.name === 'SequelizeUniqueConstraintError'
    );
  });

  await t.test('calificaciones: una por usuario y promedio', async () => {
    await clientA.form(`/publications/${dishId}/rating`, { score: '5' });
    await clientA.form(`/publications/${dishId}/rating`, { score: '4' });

    const ratingA = await Rating.findOne({
      where: { userId: userA.id, publicationId: dishId },
    });
    assert.equal(ratingA.score, 4);
    assert.equal(await Rating.count({ where: { publicationId: dishId } }), 1);

    await clientB.form(`/publications/${dishId}/rating`, { score: '3' });
    assert.equal(await Rating.count({ where: { publicationId: dishId } }), 2);

    const detail = await clientA.fetch(`/publications/${dishId}`);
    assert.match(await detail.text(), /3\.5/);

    await assert.rejects(
      () => Rating.create({ userId: userB.id, publicationId: dishId, score: 5 }),
      (error) => error.name === 'SequelizeUniqueConstraintError'
    );
  });

  await t.test('comentarios: crear, editar y eliminar', async () => {
    await clientA.form(`/publications/${dishId}/comments`, {
      content: 'Se ve deliciosa.',
    });

    const comment = await Comment.findOne({
      where: { userId: userA.id, publicationId: dishId },
    });
    assert.ok(comment);

    const detail = await clientA.fetch(`/publications/${dishId}`);
    assert.match(await detail.text(), /Se ve deliciosa/);

    const forbidden = await clientB.form(`/comments/${comment.id}/edit`, {
      content: 'Comentario modificado por otro usuario.',
    });
    assert.equal(forbidden.status, 403);

    const update = await clientA.form(`/comments/${comment.id}/edit`, {
      content: 'Comentario actualizado.',
    });
    assert.equal(update.status, 302);
    await comment.reload();
    assert.equal(comment.content, 'Comentario actualizado.');

    const remove = await clientA.form(`/comments/${comment.id}/delete`, {});
    assert.equal(remove.status, 302);
    assert.equal(
      await Comment.count({ where: { userId: userA.id, publicationId: dishId } }),
      0
    );
  });

  await t.test('perfil: publicaciones y edición de datos', async () => {
    const profile = await clientA.fetch(`/users/${userA.id}`);
    assert.equal(profile.status, 200);
    const profileHtml = await profile.text();
    assert.match(profileHtml, /Arepa de prueba actualizada/);
    assert.match(profileHtml, /Miembro/);

    const update = await clientA.form('/profile/edit', {
      firstName: 'Ana',
      lastName: 'Prueba',
      email: accountA.email,
      bio: 'Me encanta cocinar para mi familia.',
    });
    assert.equal(update.status, 302);

    await userA.reload();
    assert.equal(userA.bio, 'Me encanta cocinar para mi familia.');
  });

  await t.test('el dueño puede eliminar su publicación y sus interacciones', async () => {
    const response = await clientA.form(`/publications/${dishId}/delete`, {});
    assert.equal(response.status, 302);

    const detail = await clientA.fetch(`/publications/${dishId}`);
    assert.equal(detail.status, 404);

    assert.equal(await Like.count({ where: { publicationId: dishId } }), 0);
    assert.equal(await Rating.count({ where: { publicationId: dishId } }), 0);
    assert.equal(await Comment.count({ where: { publicationId: dishId } }), 0);
  });

  await t.test('cerrar sesión limpia la cookie de autenticación', async () => {
    const response = await clientA.form('/logout', {});
    assert.equal(response.status, 302);

    const createPage = await clientA.fetch('/publications/new');
    assert.equal(createPage.status, 302);
    assert.match(location(createPage), /\/login\?next=/);
  });
});
