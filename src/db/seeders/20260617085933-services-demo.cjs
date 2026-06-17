'use strict';

// ============================================================
// Demo data: 3 products ("servicio") per business, each with
// 2 working placeholder images served from picsum.photos
// (a free, royalty-free image CDN — guaranteed to resolve,
// unlike random stock-photo links that can break or require a
// license). Swap these URLs later for real product photos
// through the existing image upload flow whenever you have them.
// ============================================================

const businessProducts = {
  'Dulces y Postres La Paila': {
    categoria: 'Postres y Dulcerías',
    productos: [
      {
        nombre_servicio: 'Manjar Blanco Tradicional',
        descripcion_servicio:
          'Postre típico vallecaucano elaborado con leche, azúcar y arroz, cocinado lentamente hasta lograr una textura cremosa. Presentación de 500g.',
        precio_servicio: 12000,
        imagenes: ['manjar-blanco-zarzal', 'manjar-blanco-zarzal-2'],
      },
      {
        nombre_servicio: 'Cortado de Leche Casero',
        descripcion_servicio:
          'Dulce tradicional a base de leche cuajada y panela, cortado en cuadros y servido fresco. Presentación de 6 unidades.',
        precio_servicio: 8000,
        imagenes: ['cortado-leche-zarzal', 'cortado-leche-zarzal-2'],
      },
      {
        nombre_servicio: 'Obleas con Arequipe y Queso',
        descripcion_servicio:
          'Oblea artesanal rellena de arequipe casero, queso campesino y mermelada a elección. Se prepara al momento.',
        precio_servicio: 6000,
        imagenes: ['obleas-arequipe-zarzal', 'obleas-arequipe-zarzal-2'],
      },
    ],
  },
  'Artesanías Manos de Zarzal': {
    categoria: 'Artesanías Típicas',
    productos: [
      {
        nombre_servicio: 'Canasta Tejida en Fique',
        descripcion_servicio:
          'Canasta decorativa y funcional tejida a mano con fibra de fique por artesanos locales. Ideal como souvenir o para uso doméstico.',
        precio_servicio: 45000,
        imagenes: ['canasta-fique-zarzal', 'canasta-fique-zarzal-2'],
      },
      {
        nombre_servicio: 'Set de Figuras en Guadua',
        descripcion_servicio:
          'Juego de 3 figuras decorativas talladas en guadua, inspiradas en la flora y fauna del Valle del Cauca.',
        precio_servicio: 38000,
        imagenes: ['figuras-guadua-zarzal', 'figuras-guadua-zarzal-2'],
      },
      {
        nombre_servicio: 'Collar de Bisutería Artesanal',
        descripcion_servicio:
          'Collar elaborado a mano con semillas naturales y mostacillas de colores, diseño único hecho por artesanos de Zarzal.',
        precio_servicio: 25000,
        imagenes: ['collar-artesanal-zarzal', 'collar-artesanal-zarzal-2'],
      },
    ],
  },
  'Sabores del Valle - Comida Típica': {
    categoria: 'Restaurantes Tradicionales',
    productos: [
      {
        nombre_servicio: 'Sancocho de Gallina Valluno',
        descripcion_servicio:
          'Sancocho tradicional preparado con gallina criolla, plátano, yuca y mazorca, servido con arroz y aguacate.',
        precio_servicio: 22000,
        imagenes: ['sancocho-gallina-zarzal', 'sancocho-gallina-zarzal-2'],
      },
      {
        nombre_servicio: 'Tamal Vallecaucano',
        descripcion_servicio:
          'Tamal envuelto en hoja de plátano, relleno de arroz, pollo, cerdo y verduras, cocinado a fuego lento.',
        precio_servicio: 9000,
        imagenes: ['tamal-valluno-zarzal', 'tamal-valluno-zarzal-2'],
      },
      {
        nombre_servicio: 'Aborrajados con Queso',
        descripcion_servicio:
          'Plátano maduro frito, relleno de queso campesino y bañado en huevo, acompañado de salsa de la casa.',
        precio_servicio: 7000,
        imagenes: ['aborrajados-zarzal', 'aborrajados-zarzal-2'],
      },
    ],
  },
};

const ALL_PRODUCT_NAMES = Object.values(businessProducts).flatMap((b) =>
  b.productos.map((p) => p.nombre_servicio)
);

module.exports = {
  // ============================================================
  // UP — Insert 3 products per business plus their images
  // ============================================================
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const businessNames = Object.keys(businessProducts);

    // --- Lookup the businesses created by the advertisers seeder ---

    const [businesses] = await queryInterface.sequelize.query(`
      SELECT id_negocio, nombre_negocio FROM negocio
      WHERE nombre_negocio IN (${businessNames.map((n) => `'${n}'`).join(',')})
    `);
    if (businesses.length !== businessNames.length) {
      throw new Error(
        'Could not find all 3 businesses. Run the advertisers/businesses seeder first.'
      );
    }
    const businessIdByName = {};
    businesses.forEach((b) => {
      businessIdByName[b.nombre_negocio] = b.id_negocio;
    });

    // --- Lookup the categories used by each business's products ---

    const categoryNames = [...new Set(businesses.map((b) => businessProducts[b.nombre_negocio].categoria))];
    const [categories] = await queryInterface.sequelize.query(`
      SELECT id_categoria, nombre_categoria FROM categoria
      WHERE nombre_categoria IN (${categoryNames.map((n) => `'${n}'`).join(',')})
    `);
    const categoryIdByName = {};
    categories.forEach((c) => {
      categoryIdByName[c.nombre_categoria] = c.id_categoria;
    });

    // --- Lookup the "Disponible" service status ---

    const [statuses] = await queryInterface.sequelize.query(
      `SELECT id_estado_servicio FROM estado_servicio WHERE nombre_estado_servicio = 'Disponible' LIMIT 1`
    );
    if (!statuses.length) {
      throw new Error('Service status "Disponible" not found. Run the service status seeder first.');
    }
    const availableStatusId = statuses[0].id_estado_servicio;

    // --- Insert the products (servicio) ---

    const servicesToInsert = [];
    for (const businessName of businessNames) {
      const { categoria, productos } = businessProducts[businessName];
      for (const producto of productos) {
        servicesToInsert.push({
          nombre_servicio: producto.nombre_servicio,
          descripcion_servicio: producto.descripcion_servicio,
          precio_servicio: producto.precio_servicio,
          id_categoria_servicio: categoryIdByName[categoria],
          id_estado_servicio: availableStatusId,
          id_restriccion_edad_servicio: null,
          id_negocio: businessIdByName[businessName],
          fecha_creacion_servicio: now,
          fecha_modificacion_servicio: now,
        });
      }
    }

    await queryInterface.bulkInsert('servicio', servicesToInsert);

    // --- Re-fetch the generated ids so we can attach images to each one ---

    const [createdServices] = await queryInterface.sequelize.query(`
      SELECT id_servicio, nombre_servicio FROM servicio
      WHERE nombre_servicio IN (${ALL_PRODUCT_NAMES.map((n) => `'${n}'`).join(',')})
    `);
    const serviceIdByName = {};
    createdServices.forEach((s) => {
      serviceIdByName[s.nombre_servicio] = s.id_servicio;
    });

    // --- Insert the images for each product ---

    const imagesToInsert = [];
    for (const { productos } of Object.values(businessProducts)) {
      for (const producto of productos) {
        const serviceId = serviceIdByName[producto.nombre_servicio];
        producto.imagenes.forEach((seed, index) => {
          imagesToInsert.push({
            id_servicio: serviceId,
            url_imagen_servicio: `https://picsum.photos/seed/${seed}/800/600`,
            descripcion_imagen_servicio: `${producto.nombre_servicio} - foto ${index + 1}`,
            fecha_creacion_imagen_servicio: now,
            fecha_modificacion_imagen_servicio: now,
          });
        });
      }
    }

    await queryInterface.bulkInsert('imagen_servicio', imagesToInsert);
  },

  // ============================================================
  // DOWN — Remove the products (images cascade-delete automatically)
  // ============================================================
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('servicio', {
      nombre_servicio: ALL_PRODUCT_NAMES,
    });
  },
};
