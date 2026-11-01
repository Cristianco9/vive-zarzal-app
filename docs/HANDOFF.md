# Handoff del proyecto

Documento de continuidad para el equipo que retoma el desarrollo de **Vive Zarzal**, un foro comunitario de comida.

## Estado actual

* Rama de trabajo: `refactor/food-community-forum`.
* Aplicación funcional con autenticación, publicaciones, interacciones, comentarios y perfiles.
* Base de datos ampliada a **21 tablas de dominio** con migraciones y seeders.
* Pruebas de integración y esquema aprobadas.
* La aplicación arranca con `npm run dev` en `http://localhost:3377`.

## Qué está implementado

### Producto

* Registro e inicio de sesión con JWT en cookie `httpOnly`.
* Contraseñas cifradas con bcrypt.
* Asignación automática del rol `member`.
* Feed general y feed por categoría.
* Publicaciones de tipo plato (`dish`) y receta (`recipe`).
* Imagen opcional con Multer.
* Edición y eliminación de publicaciones por parte de su autor.
* Me gusta con alternancia y restricción de unicidad.
* Calificación de 1 a 5 con actualización de la calificación existente.
* Comentarios con edición y eliminación por parte de su autor.
* Perfil público con publicaciones y roles.
* Edición de datos del perfil propio.
* Validación con Joi y manejo centralizado de errores.

### Base de datos

* 21 tablas de dominio más `SequelizeMeta`.
* Migraciones reproducibles en `src/db/migrations/`.
* Modelos y asociaciones en `src/db/models/`.
* Seeders idempotentes en `src/db/seeders/`.
* Catálogos iniciales de categorías, roles, permisos, documentos, ubicaciones y etiquetas.
* Restricciones de unicidad e índices para las relaciones principales.
* Restricción `CHECK` en `reports` para exigir publicación o comentario.

### Calidad

* `npm test`: pruebas funcionales y de esquema.
* `npm run lint`: ESLint sobre `src` y `tests`.
* Pruebas de permisos `403`, recursos `404`, duplicados y archivos inválidos.

## Qué está preparado pero todavía no tiene interfaz

Estas tablas y modelos existen para que el siguiente equipo construya las funcionalidades:

| Funcionalidad | Base disponible | Trabajo pendiente |
| --- | --- | --- |
| Roles y permisos | `roles`, `permissions`, `role_permissions`, `user_roles` | Middleware de autorización, panel de administración, asignación de roles. |
| Documentos | `document_types`, `user_documents` | Formulario de documentos, carga de soportes, verificación por administrador. |
| Ubicaciones | `countries`, `departments`, `cities`, `user_addresses` | Selectores dependientes y gestión de direcciones. |
| Etiquetas | `tags`, `publication_tags` | Selector de etiquetas al publicar, filtros y páginas por etiqueta. |
| Favoritos | `favorites` | Botón guardar/quitar y listado de favoritos. |
| Notificaciones | `notifications` | Centro de notificaciones y creación al recibir interacciones. |
| Moderación | `reports` | Formulario de reporte y flujo de revisión para moderadores. |

## Arquitectura

```text
Navegador
  │
  ▼
Express 5 + EJS
  │
  ├── middlewares/auth.js       Carga el usuario y sus roles desde el JWT
  ├── router/*                  Rutas HTTP
  ├── controllers/*             Lógica de aplicación
  ├── schemas/index.js          Validación con Joi
  ├── db/models/*               Modelos Sequelize
  └── db/migrations + seeders   Esquema y catálogos
  │
  ▼
PostgreSQL
```

No hay capa de servicios separada. Para el tamaño actual se mantienen controladores delgados y consultas directas con Sequelize. Si una funcionalidad crece en complejidad, se puede introducir un servicio puntual sin reestructurar todo el proyecto.

## Puntos de entrada

| Archivo | Uso |
| --- | --- |
| `src/app.js` | Configuración de Express, middlewares, rutas y arranque. |
| `src/router/index.js` | Punto de unión de todos los routers. |
| `src/db/models/index.js` | Exportación de modelos y asociaciones. |
| `src/db/migrations/` | Historial del esquema. |
| `src/db/seeders/` | Catálogos iniciales. |
| `src/middlewares/auth.js` | Usuario actual, roles y autenticación requerida. |
| `src/controllers/` | Casos de uso existentes. |
| `src/views/` | Vistas EJS. |
| `tests/forum.test.js` | Flujos funcionales. |
| `tests/schema.test.js` | Tablas, catálogos y asociaciones. |
| `docs/DATABASE.md` | Catálogo detallado del esquema. |

## Cómo ejecutar

```sh
npm install
npm run env-var
# Editar .env con credenciales reales
docker compose up -d
npm run migrations:run
npm run seeds:run
npm run dev
```

Verificación:

```sh
npm test
npm run lint
```

## Backlog priorizado sugerido

### Prioridad alta

1. Middleware de autorización por rol/permiso y pruebas de acceso.
2. Panel de administración para roles, categorías, etiquetas y reportes.
3. Flujo de reportes: crear reporte, listar pendientes, aprobar o descartar.
4. Etiquetas en publicaciones y filtros por etiqueta.
5. Favoritos con listado en el perfil.

### Prioridad media

6. Gestión de documentos y verificación.
7. Direcciones y selectores de país/departamento/ciudad.
8. Notificaciones al recibir likes, comentarios y calificaciones.
9. Búsqueda y paginación del feed.
10. Recuperación de contraseña y verificación de correo.

### Prioridad baja

11. Panel de métricas y auditoría.
12. Integración con almacenamiento de imágenes externo.
13. Notificaciones por correo o push.
14. Pruebas end-to-end de navegador.

## Decisiones y restricciones

* Se conserva la base técnica original: Node.js, Express, EJS, Sequelize y PostgreSQL.
* No se agregó una capa de servicios para CRUD simple.
* La autenticación usa JWT en cookie `httpOnly`, no sesiones de servidor.
* Las imágenes se guardan en `src/public/uploads/` y no se versionan.
* Los seeders no deben usarse en producción sin revisar los catálogos.
* No hay CSRF, paginación, búsqueda ni recuperación de contraseña todavía.
* La alerta de `npm audit` en producción proviene de `uuid` dentro de Sequelize 6; corregirla implica una actualización mayor del ORM.

## Checklist para el equipo entrante

- [ ] Leer `README.md`, `docs/DATABASE.md` y este documento.
- [ ] Crear `.env` y levantar PostgreSQL.
- [ ] Ejecutar migraciones y seeders.
- [ ] Ejecutar `npm test` y `npm run lint`.
- [ ] Revisar el backlog priorizado.
- [ ] Definir la primera funcionalidad y crear una rama desde `refactor/food-community-forum`.
- [ ] Agregar pruebas para cada funcionalidad nueva.
- [ ] Actualizar `docs/DATABASE.md` si cambia el esquema.
