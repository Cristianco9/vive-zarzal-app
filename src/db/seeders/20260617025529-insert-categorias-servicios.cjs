'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('categoria', [
      // === ALIMENTACIÓN Y GASTRONOMÍA ===
      {
        nombre_categoria: 'Restaurantes Tradicionales',
        descripcion_categoria: 'Ofrecen platos típicos regionales como bandeja paisa, sancocho, lechona, etc.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Comida Rápida Local',
        descripcion_categoria: 'Establecimientos pequeños con opciones rápidas de comida tradicional.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Postres y Dulcerías',
        descripcion_categoria: 'Negocios dedicados a la venta de postres caseros, dulces típicos y helados.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Productos Orgánicos',
        descripcion_categoria: 'Venta de frutas, verduras y alimentos orgánicos producidos localmente.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Cafeterías Regionales',
        descripcion_categoria: 'Espacios donde degustar café de origen colombiano con tostado local.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === ARTESANÍAS Y PRODUCTOS LOCALES ===
      {
        nombre_categoria: 'Artesanías Típicas',
        descripcion_categoria: 'Objetos elaborados manualmente como sombreros vueltiaos, hamacas, bolsos Wayuu, etc.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Productos de Regalos',
        descripcion_categoria: 'Artículos decorativos y souvenirs elaborados en Colombia.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Textiles y Bordados',
        descripcion_categoria: 'Telas bordadas a mano, mantas, vestimenta tradicional y decorativa.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Muebles Hechos a Mano',
        descripcion_categoria: 'Mueblería artesanal en madera tropical o bambú, piezas únicas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === TURISMO Y EXPERIENCIAS ÚNICAS ===
      {
        nombre_categoria: 'Excursiones Ecológicas',
        descripcion_categoria: 'Viajes guiados por áreas naturales protegidas como parques nacionales.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Turismo Arqueológico',
        descripcion_categoria: 'Visitas a sitios históricos precolombinos y coloniales.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Turismo Rural',
        descripcion_categoria: 'Actividades en fincas cafetaleras, cultivos y comunidades campesinas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Fiestas Populares',
        descripcion_categoria: 'Eventos culturales anuales como carnavales, ferias patronales, festivales folclóricos.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Aventura Extrema',
        descripcion_categoria: 'Actividades como rafting, canopy, paracaidismo, escalada en roca.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Turismo Gastronómico',
        descripcion_categoria: 'Rutas temáticas para descubrir platillos y bebidas típicas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Turismo Religioso',
        descripcion_categoria: 'Visitas a santuarios, iglesias históricas y centros religiosos importantes.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === RECREACIÓN Y OCIO LOCAL ===
      {
        nombre_categoria: 'Centros Culturales',
        descripcion_categoria: 'Espacios comunitarios con exposiciones, talleres culturales y eventos.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Parques Infantiles',
        descripcion_categoria: 'Áreas recreativas para niños con juegos y actividades didácticas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Baños Termales',
        descripcion_categoria: 'Sitios naturales con pozas termales ideales para relajación.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Camping Regional',
        descripcion_categoria: 'Sitios adecuados para acampar en contacto con la naturaleza.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Juegos Tradicionales',
        descripcion_categoria: 'Espacios públicos con juegos de mesa antiguos como rayuela, trompo, etc.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === COMERCIO Y NEGOCIOS LOCALES ===
      {
        nombre_categoria: 'Mercados Locales',
        descripcion_categoria: 'Zonas comerciales donde se venden productos frescos y artesanos.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Tiendas de Barrio',
        descripcion_categoria: 'Microempresas dedicadas a la venta de artículos básicos y útiles diarios.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Emprendimientos Digitales',
        descripcion_categoria: 'Negocios que ofrecen productos/servicios a través de redes sociales y plataformas digitales.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Delivery Local',
        descripcion_categoria: 'Servicios informales o formales de entrega de productos locales.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Ferias Artesanales',
        descripcion_categoria: 'Eventos periódicos donde se exhiben y venden productos hechos por artesanos locales.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === SERVICIOS DE APOYO AL TURISTA ===
      {
        nombre_categoria: 'Guías Turísticos',
        descripcion_categoria: 'Profesionales expertos en historia, cultura y naturaleza local.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Traductores Turísticos',
        descripcion_categoria: 'Intérpretes especializados en múltiples idiomas para facilitar la comunicación.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Hospedaje Alternativo',
        descripcion_categoria: 'Cabañas, glampings, hostales familiares y alojamientos no hoteleros.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Transporte Turístico',
        descripcion_categoria: 'Servicios especializados de transporte para visitantes extranjeros o nacionales.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Agencias de Viaje',
        descripcion_categoria: 'Empresas que organizan paquetes turísticos integrales.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === EDUCACIÓN Y CAPACITACIÓN LOCAL ===
      {
        nombre_categoria: 'Clases de Cocina Local',
        descripcion_categoria: 'Talleres prácticos para preparar comidas típicas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Artesanía Popular',
        descripcion_categoria: 'Cursos para aprender técnicas tradicionales de tejido, cerámica, tallado.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Historia y Mitología Local',
        descripcion_categoria: 'Charlas o tours narrativos sobre leyendas y costumbres autóctonas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Lenguas Indígenas',
        descripcion_categoria: 'Clases introductorias a lengua Wayuu, Embera, Zenú y otras.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === SERVICIOS DE EMERGENCIA Y SEGURIDAD ===
      {
        nombre_categoria: 'Guías de Seguridad',
        descripcion_categoria: 'Personal capacitado para acompañar turistas en zonas potencialmente riesgosas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },

      // === SERVICIOS DE BIENESTAR Y SALUD ===
      {
        nombre_categoria: 'Masajes Tradicionales',
        descripcion_categoria: 'Terapias alternativas basadas en técnicas indígenas o campesinas.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      },
      {
        nombre_categoria: 'Hierbas Medicinales',
        descripcion_categoria: 'Venta de remedios naturales usados tradicionalmente en la región.',
        fecha_creacion_categoria: now,
        fecha_modificacion_categoria: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categoria', null, {});
  }
};