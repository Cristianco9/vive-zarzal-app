'use strict';

const bcrypt = require('bcryptjs');

// Same salt rounds used in src/utils/auth/passwordHash.js
const SALT_ROUNDS = 11;

// ============================================================
// Demo data: 3 advertisers ("Anunciante"), each with one business
// ============================================================
const ADVERTISERS = [
  {
    nombre_usuario: 'María Fernanda',
    apellido_usuario: 'Gómez Restrepo',
    fecha_nacimiento_usuario: '1988-04-12',
    numero_documento_usuario: '1006789321',
    correo_usuario: 'mariafernanda.dulceria@vivezarzal.com',
    username_usuario: 'dulceria_zarzal',
    contrasena_usuario: 'Anunciante2026*',
    genero: 'Femenino',
    ubicacion: {
      nombre_ubicacion: 'Centro de Zarzal',
      descripcion_ubicacion: 'Calle 10 # 8-23, Barrio Centro, Zarzal, Valle del Cauca',
      codigo_ubicacion: 'ZAR-DULCERIA-01',
    },
    negocio: {
      nombre_negocio: 'Dulces y Postres La Paila',
      descripcion_negocio:
        'Repostería artesanal especializada en postres tradicionales del Valle del Cauca: manjar blanco, cortado de leche, dulce de mango y obleas caseras.',
      facebook_negocio: 'https://facebook.com/dulceslapaila',
      instagram_negocio: 'https://instagram.com/dulceslapaila',
      tiktok_negocio: null,
      pagina_web_negocio: null,
    },
  },
  {
    nombre_usuario: 'Jorge Eliécer',
    apellido_usuario: 'Salazar Tobón',
    fecha_nacimiento_usuario: '1982-09-05',
    numero_documento_usuario: '1006789454',
    correo_usuario: 'jorge.artesanias@vivezarzal.com',
    username_usuario: 'artesanias_zarzal',
    contrasena_usuario: 'Anunciante2026*',
    genero: 'Masculino',
    ubicacion: {
      nombre_ubicacion: 'Barrio La Floresta',
      descripcion_ubicacion: 'Carrera 5 # 12-40, Barrio La Floresta, Zarzal, Valle del Cauca',
      codigo_ubicacion: 'ZAR-ARTESANIAS-01',
    },
    negocio: {
      nombre_negocio: 'Artesanías Manos de Zarzal',
      descripcion_negocio:
        'Taller artesanal que elabora piezas en guadua, fique y cerámica, además de bisutería y souvenirs inspirados en la cultura del Valle del Cauca.',
      facebook_negocio: 'https://facebook.com/manosdezarzal',
      instagram_negocio: 'https://instagram.com/manosdezarzal',
      tiktok_negocio: 'https://tiktok.com/@manosdezarzal',
      pagina_web_negocio: null,
    },
  },
  {
    nombre_usuario: 'Luz Dary',
    apellido_usuario: 'Imbachí Marín',
    fecha_nacimiento_usuario: '1975-01-23',
    numero_documento_usuario: '1006789587',
    correo_usuario: 'luzdary.saboresvalle@vivezarzal.com',
    username_usuario: 'sabores_del_valle',
    contrasena_usuario: 'Anunciante2026*',
    genero: 'Femenino',
    ubicacion: {
      nombre_ubicacion: 'Vía Zarzal - La Paila',
      descripcion_ubicacion: 'Km 2 Vía Zarzal - La Paila, Zarzal, Valle del Cauca',
      codigo_ubicacion: 'ZAR-COMIDAS-01',
    },
    negocio: {
      nombre_negocio: 'Sabores del Valle - Comida Típica',
      descripcion_negocio:
        'Restaurante de comida típica vallecaucana: sancocho de gallina, tamales vallunos, sudado de pollo y aborrajados, preparados con receta tradicional.',
      facebook_negocio: 'https://facebook.com/saboresdelvallezarzal',
      instagram_negocio: 'https://instagram.com/saboresdelvallezarzal',
      tiktok_negocio: null,
      pagina_web_negocio: null,
    },
  },
];

module.exports = {
  // ============================================================
  // UP — Insert advertiser users, their locations and businesses
  // ============================================================
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // --- Lookup catalog ids needed for the foreign keys ---

    const [roles] = await queryInterface.sequelize.query(
      `SELECT id_rol FROM rol WHERE tipo_rol = 'Anunciante' LIMIT 1`
    );
    if (!roles.length) {
      throw new Error('Role "Anunciante" not found. Run the roles seeder first.');
    }
    const advertiserRoleId = roles[0].id_rol;

    const [genders] = await queryInterface.sequelize.query(
      `SELECT id_genero, tipo_genero FROM genero WHERE tipo_genero IN ('Femenino', 'Masculino')`
    );
    const genderIdByName = {};
    genders.forEach((g) => {
      genderIdByName[g.tipo_genero] = g.id_genero;
    });

    const [documentTypes] = await queryInterface.sequelize.query(
      `SELECT id_tipo_documento FROM tipo_documento WHERE nombre_tipo_documento = 'Cédula de ciudadanía' LIMIT 1`
    );
    const documentTypeId = documentTypes.length ? documentTypes[0].id_tipo_documento : null;

    const [cities] = await queryInterface.sequelize.query(`
      SELECT c.id_ciudad
      FROM ciudad c
      INNER JOIN departamento d ON d.id_departamento = c.id_departamento
      WHERE c.nombre_ciudad = 'Zarzal' AND d.nombre_departamento = 'Valle del Cauca'
      LIMIT 1
    `);
    if (!cities.length) {
      throw new Error('City "Zarzal" (Valle del Cauca) not found. Run the cities seeder first.');
    }
    const zarzalCityId = cities[0].id_ciudad;

    // --- Insert locations (ubicacion) for each business ---

    await queryInterface.bulkInsert(
      'ubicacion',
      ADVERTISERS.map((a) => ({
        id_ciudad: zarzalCityId,
        nombre_ubicacion: a.ubicacion.nombre_ubicacion,
        descripcion_ubicacion: a.ubicacion.descripcion_ubicacion,
        codigo_ubicacion: a.ubicacion.codigo_ubicacion,
        fecha_creacion_ubicacion: now,
        fecha_modificacion_ubicacion: now,
      }))
    );

    const [locations] = await queryInterface.sequelize.query(`
      SELECT id_ubicacion, codigo_ubicacion FROM ubicacion
      WHERE codigo_ubicacion IN (${ADVERTISERS.map((a) => `'${a.ubicacion.codigo_ubicacion}'`).join(',')})
    `);
    const locationIdByCode = {};
    locations.forEach((l) => {
      locationIdByCode[l.codigo_ubicacion] = l.id_ubicacion;
    });

    // --- Insert advertiser users (password hashed with bcrypt) ---

    const usersToInsert = await Promise.all(
      ADVERTISERS.map(async (a) => ({
        id_rol: advertiserRoleId,
        id_genero: genderIdByName[a.genero] || null,
        id_tipo_documento: documentTypeId,
        nombre_usuario: a.nombre_usuario,
        apellido_usuario: a.apellido_usuario,
        fecha_nacimiento_usuario: a.fecha_nacimiento_usuario,
        numero_documento_usuario: a.numero_documento_usuario,
        correo_usuario: a.correo_usuario,
        username_usuario: a.username_usuario,
        contrasena_usuario: await bcrypt.hash(a.contrasena_usuario, SALT_ROUNDS),
        fecha_creacion_usuario: now,
        fecha_actualizacion_usuario: now,
      }))
    );

    await queryInterface.bulkInsert('usuario', usersToInsert);

    const [users] = await queryInterface.sequelize.query(`
      SELECT id_usuario, correo_usuario FROM usuario
      WHERE correo_usuario IN (${ADVERTISERS.map((a) => `'${a.correo_usuario}'`).join(',')})
    `);
    const userIdByEmail = {};
    users.forEach((u) => {
      userIdByEmail[u.correo_usuario] = u.id_usuario;
    });

    // --- Insert businesses (negocio), linked to their owner and location ---

    await queryInterface.bulkInsert(
      'negocio',
      ADVERTISERS.map((a) => ({
        id_usuario_propietario: userIdByEmail[a.correo_usuario],
        id_ubicacion: locationIdByCode[a.ubicacion.codigo_ubicacion],
        nombre_negocio: a.negocio.nombre_negocio,
        descripcion_negocio: a.negocio.descripcion_negocio,
        facebook_negocio: a.negocio.facebook_negocio,
        instagram_negocio: a.negocio.instagram_negocio,
        tiktok_negocio: a.negocio.tiktok_negocio,
        pagina_web_negocio: a.negocio.pagina_web_negocio,
        fecha_creacion_negocio: now,
        fecha_modificacion_negocio: now,
      }))
    );
  },

  // ============================================================
  // DOWN — Remove the businesses, locations and users created above
  // ============================================================
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('negocio', {
      nombre_negocio: ADVERTISERS.map((a) => a.negocio.nombre_negocio),
    });

    await queryInterface.bulkDelete('usuario', {
      correo_usuario: ADVERTISERS.map((a) => a.correo_usuario),
    });

    await queryInterface.bulkDelete('ubicacion', {
      codigo_ubicacion: ADVERTISERS.map((a) => a.ubicacion.codigo_ubicacion),
    });
  },
};
