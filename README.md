# Vive Zarzal

Foro comunitario de comida para compartir **platos** y **recetas**. Cada persona puede publicar lo que cocina, explorar por categorías, dar me gusta, calificar de 1 a 5, comentar y gestionar su propio perfil.

El proyecto queda preparado como punto de entrada para un equipo de desarrollo que continúe construyendo funcionalidades sobre una base estable: autenticación, CRUD de publicaciones, interacciones sociales y un esquema de base de datos ampliado con roles, permisos, documentos, ubicaciones, etiquetas, favoritos, notificaciones y reportes.

## Tabla de contenidos

* [Estado del proyecto](#estado-del-proyecto)
* [Funcionalidades actuales](#funcionalidades-actuales)
* [Base preparada para nuevas funcionalidades](#base-preparada-para-nuevas-funcionalidades)
* [Tecnologías](#tecnologías)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Requisitos](#requisitos)
* [Instalación](#instalación)
* [Variables de entorno](#variables-de-entorno)
* [Uso](#uso)
* [Rutas principales](#rutas-principales)
* [Modelo de datos](#modelo-de-datos)
* [Roles y permisos](#roles-y-permisos)
* [Catálogos iniciales](#catálogos-iniciales)
* [Pruebas](#pruebas)
* [Scripts disponibles](#scripts-disponibles)
* [Limitaciones y siguientes pasos](#limitaciones-y-siguientes-pasos)
* [Documentación de entrega](#documentación-de-entrega)
* [Licencia](#licencia)

## Estado del proyecto

* Foro funcional con registro, inicio de sesión, publicaciones, interacciones, comentarios y perfiles.
* Base de datos con **21 tablas de dominio** (más `SequelizeMeta`), migraciones y seeders reproducibles.
* Pruebas de integración y de esquema ejecutadas con `node --test`.
* Rama de trabajo: `refactor/food-community-forum`.
* El equipo entrante puede continuar desde `src/app.js`, `src/router/index.js` y `src/db/models/index.js`.

## Funcionalidades actuales

* Registro e inicio de sesión con contraseñas cifradas y sesión mediante cookie JWT.
* Asignación automática del rol `member` a las cuentas nuevas.
* Feed con las publicaciones más recientes.
* Publicaciones de dos tipos:
  * `dish`: un plato con título, descripción, categoría e imagen opcional.
  * `recipe`: además incluye ingredientes y pasos de preparación.
* Filtro de publicaciones por categoría.
* Imagen opcional por publicación (JPG, PNG, WEBP o GIF, hasta 5 MB por defecto).
* Edición y eliminación de publicaciones solo por su autor.
* Me gusta: un registro por usuario y publicación, con alternancia (dar/quitar).
* Calificación de 1 a 5: una calificación activa por usuario y publicación, actualizable.
* Comentarios editables y eliminables únicamente por su autor.
* Perfil público con las publicaciones y roles de cada usuario.
* Edición del perfil propio (nombre, apellido, correo y biografía).
* Validación de formularios con Joi y manejo centralizado de errores.

## Base preparada para nuevas funcionalidades

El esquema incluye tablas y modelos listos para que el siguiente equipo implemente:

| Área | Tablas | Siguiente paso sugerido |
| --- | --- | --- |
| Control de acceso | `roles`, `permissions`, `role_permissions`, `user_roles` | Middleware `requireRole`, panel de administración y asignación de roles. |
| Identidad | `document_types`, `user_documents` | Formulario de documentos, carga de soportes y verificación. |
| Ubicación | `countries`, `departments`, `cities`, `user_addresses` | Selectores de ubicación y direcciones del perfil. |
| Descubrimiento | `tags`, `publication_tags`, `favorites` | Etiquetas en publicaciones, filtros y lista de favoritos. |
| Notificaciones | `notifications` | Centro de notificaciones y envío al recibir likes, comentarios o calificaciones. |
| Moderación | `reports` | Formulario de reporte y flujo de revisión para moderadores. |

## Tecnologías

* **Node.js** (18 o superior)
* **Express 5**
* **EJS** para las vistas del servidor
* **Sequelize 6** como ORM
* **PostgreSQL** como base de datos
* **JWT** y **bcryptjs** para autenticación
* **Joi** para validación
* **Multer** para la subida de imágenes
* **Docker Compose** para levantar PostgreSQL y pgAdmin
* **ESLint** y el runner de pruebas integrado de Node.js

## Estructura del proyecto

```text
src/
├── app.js                    # Configuración de Express y arranque
├── config/config.js          # Lectura de variables de entorno
├── controllers/              # Autenticación, usuarios, publicaciones e interacciones
├── db/
│   ├── config.cjs            # Configuración de sequelize-cli
│   ├── migrations/           # 13 migraciones; 21 tablas de dominio
│   ├── models/               # 21 modelos Sequelize y asociaciones
│   └── seeders/              # Categorías, roles, permisos, documentos, ubicaciones y etiquetas
├── libraries/DBConnection.js # Conexión a PostgreSQL
├── middlewares/              # Autenticación, errores y subida de archivos
├── public/                   # CSS, JavaScript del formulario e imágenes subidas
├── router/                   # Rutas HTTP
├── schemas/index.js          # Esquemas de validación con Joi
├── utils/                    # JWT, bcrypt y errores HTTP
└── views/                    # Vistas EJS
tests/
├── forum.test.js             # Flujos funcionales del foro
└── schema.test.js            # Tablas, catálogos y asociaciones
docs/
├── DATABASE.md               # Catálogo detallado del esquema
└── HANDOFF.md                # Estado, pendientes y guía de continuidad
```

## Requisitos

* [Node.js](https://nodejs.org/) 18 o superior
* [npm](https://www.npmjs.com/)
* [Docker](https://www.docker.com/) (recomendado para la base de datos) o una instancia local de PostgreSQL

## Instalación

1. Clona el repositorio y entra en el directorio:

   ```sh
   git clone git@github.com:Cristianco9/vive-zarzal-app.git
   cd vive-zarzal-app
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Crea el archivo `.env` a partir de la plantilla:

   ```sh
   npm run env-var
   ```

   Edita `.env` y define al menos `DB_NAME`, `DB_USER`, `DB_PASSWORD` y un `AUTH_APP_JWT_SECRET_KEY` seguro.

4. Levanta PostgreSQL con Docker Compose:

   ```sh
   docker compose up -d
   ```

   Si prefieres una base local, crea un usuario y una base de datos que coincidan con tu `.env`.

5. Ejecuta las migraciones y los seeders:

   ```sh
   npm run migrations:run
   npm run seeds:run
   ```

6. Inicia la aplicación:

   ```sh
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3377` (o en el puerto definido en `APP_PORT`).

## Variables de entorno

La plantilla completa está en [`env/.envExample`](env/.envExample).

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `APP_PORT` | Puerto HTTP de la aplicación | `3377` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_DIALECT` | Dialecto de Sequelize | `postgres` |
| `DB_HOST` | Host de PostgreSQL | `127.0.0.1` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `food_forum` |
| `DB_USER` | Usuario de la base de datos | `food_forum_user` |
| `DB_PASSWORD` | Contraseña de la base de datos | `local_dev_password` |
| `DB_POOL_*` | Configuración del pool de conexiones | Ver plantilla |
| `AUTH_APP_JWT_SECRET_KEY` | Clave para firmar los JWT | Valor de desarrollo |
| `AUTH_APP_JWT_EXPIRES_IN` | Duración del token | `24h` |
| `UPLOAD_MAX_SIZE_MB` | Tamaño máximo de imagen | `5` |

> El archivo `.env` está ignorado por Git. No subas secretos reales al repositorio.

## Uso

1. Crea una cuenta desde **Crear cuenta**.
2. Inicia sesión y publica un plato o una receta desde **Publicar**.
3. Explora el feed y las categorías, y abre cualquier publicación para ver el detalle.
4. Da me gusta, califica con estrellas y comenta.
5. Entra a tu perfil para ver tus publicaciones, tus roles o editar tus datos.

Las imágenes subidas se guardan en `src/public/uploads/`. Ese contenido no se versiona; solo se conserva el archivo `.gitkeep`.

## Rutas principales

| Método | Ruta | Descripción | Acceso |
| --- | --- | --- | --- |
| `GET` | `/` | Feed de publicaciones recientes | Público |
| `GET` | `/categories/:slug` | Publicaciones de una categoría | Público |
| `GET` | `/publications/:id` | Detalle de una publicación | Público |
| `GET` | `/publications/new` | Formulario de nueva publicación | Autenticado |
| `POST` | `/publications` | Crear publicación (multipart) | Autenticado |
| `GET` | `/publications/:id/edit` | Formulario de edición | Autor |
| `POST` | `/publications/:id/edit` | Actualizar publicación (multipart) | Autor |
| `POST` | `/publications/:id/delete` | Eliminar publicación | Autor |
| `POST` | `/publications/:id/like` | Dar o quitar me gusta | Autenticado |
| `POST` | `/publications/:id/rating` | Crear o actualizar calificación | Autenticado |
| `POST` | `/publications/:id/comments` | Crear comentario | Autenticado |
| `POST` | `/comments/:id/edit` | Editar comentario | Autor |
| `POST` | `/comments/:id/delete` | Eliminar comentario | Autor |
| `GET` | `/users/:id` | Perfil público | Público |
| `GET` | `/profile/edit` | Formulario de perfil | Autenticado |
| `POST` | `/profile/edit` | Actualizar perfil | Autenticado |
| `GET` | `/login` | Formulario de inicio de sesión | Público |
| `POST` | `/login` | Iniciar sesión | Público |
| `GET` | `/register` | Formulario de registro | Público |
| `POST` | `/register` | Crear cuenta | Público |
| `POST` | `/logout` | Cerrar sesión | Autenticado |

## Modelo de datos

El dominio tiene **21 tablas** (además de `SequelizeMeta`):

**Núcleo del foro**

* **users**: nombre, apellido, nombre de usuario único, correo único, contraseña cifrada y biografía.
* **categories**: nombre, slug único y descripción.
* **publications**: autor, categoría, tipo (`dish` o `recipe`), título, descripción, imagen opcional e ingredientes/instrucciones para recetas.
* **likes**: un registro único por usuario y publicación.
* **ratings**: puntuación de 1 a 5, única por usuario y publicación.
* **comments**: contenido, autor y publicación.

**Control de acceso**

* **roles**: roles del sistema (`admin`, `moderator`, `member`).
* **permissions**: permisos granulares por acción.
* **role_permissions**: permisos asignados a cada rol.
* **user_roles**: roles asignados a cada usuario.

**Identidad**

* **document_types**: catálogo de tipos de documento.
* **user_documents**: documentos asociados a un usuario, con estado de verificación.

**Ubicación**

* **countries**: países.
* **departments**: departamentos o estados por país.
* **cities**: ciudades por departamento.
* **user_addresses**: direcciones de usuario.

**Descubrimiento**

* **tags**: etiquetas reutilizables.
* **publication_tags**: relación entre publicaciones y etiquetas.
* **favorites**: publicaciones guardadas por un usuario.

**Notificaciones y moderación**

* **notifications**: notificaciones por usuario, con estado de lectura.
* **reports**: reportes de publicaciones o comentarios, con estado y revisor.

Las claves foráneas usan `ON DELETE CASCADE` para las interacciones y las publicaciones de un usuario. Las categorías y los catálogos geográficos usan `ON DELETE RESTRICT` donde corresponde para no dejar registros huérfanos. `reports` exige que el reporte apunte a una publicación o a un comentario mediante una restricción `CHECK`.

La documentación detallada del esquema está en [`docs/DATABASE.md`](docs/DATABASE.md).

## Roles y permisos

Los seeders crean tres roles:

| Rol | Slug | Uso previsto |
| --- | --- | --- |
| Administrador | `admin` | Acceso total y gestión de usuarios, roles y catálogos. |
| Moderador | `moderator` | Moderación de publicaciones, comentarios, etiquetas y reportes. |
| Miembro | `member` | Rol por defecto para personas registradas. |

El registro asigna automáticamente el rol `member`. Los roles del usuario autenticado se cargan en `req.currentUser.roles` y se muestran en su perfil público. La autorización por permisos todavía no se aplica a las rutas: el siguiente equipo debe implementar el middleware y las políticas de acceso.

## Catálogos iniciales

* 7 categorías de comida.
* 3 roles y 14 permisos con sus asignaciones.
* 6 tipos de documento: CC, CE, PA, TI, PPT y NIT.
* Colombia, 3 departamentos y 5 ciudades de ejemplo.
* 8 etiquetas de comida.

Los seeders son idempotentes: se pueden ejecutar varias veces sin duplicar los catálogos.

## Pruebas

Las pruebas cubren los flujos funcionales y la estructura de la base de datos:

* Registro, inicio de sesión, cierre de sesión y asignación del rol `member`.
* Creación de platos y recetas, imágenes y validación de archivos.
* Permisos de edición y eliminación de publicaciones y comentarios.
* Me gusta, calificaciones y comentarios.
* Perfil público y edición de perfil.
* Presencia de las 21 tablas, catálogos iniciales y asociaciones nuevas.

Requisitos:

* Base de datos migrada y con los seeders ejecutados.
* Archivo `.env` válido.

```sh
npm run migrations:run
npm run seeds:run
npm test
```

Las pruebas usan usuarios con nombres únicos y eliminan los datos que crean. No ejecutes la suite contra una base de datos de producción.

También puedes ejecutar el análisis estático:

```sh
npm run lint
```

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm start` | Inicia la aplicación en modo producción |
| `npm run dev` | Inicia la aplicación con recarga automática |
| `npm test` | Ejecuta las pruebas de integración y esquema |
| `npm run test:setup` | Ejecuta migraciones y seeders |
| `npm run lint` | Analiza `src` y `tests` con ESLint |
| `npm run env-var` | Copia `env/.envExample` a `.env` |
| `npm run migrations:run` | Ejecuta las migraciones pendientes |
| `npm run migrations:revert` | Revierte la última migración |
| `npm run migrations:delete` | Revierte todas las migraciones |
| `npm run seeds:run` | Ejecuta los seeders |
| `npm run seeds:revert` | Revierte el último seeder |
| `npm run seeds:delete` | Revierte todos los seeders |

## Limitaciones y siguientes pasos

* Los roles, permisos, documentos, direcciones, etiquetas, favoritos, notificaciones y reportes existen en base de datos y modelos, pero aún no tienen flujos completos en la interfaz.
* Falta implementar autorización por rol/permiso en rutas y controladores.
* No hay paginación, búsqueda ni filtros por etiquetas.
* No hay recuperación de contraseña, verificación de correo ni panel administrativo.
* Las imágenes se almacenan en el sistema de archivos local; para producción se recomienda almacenamiento compartido u objeto.
* Los formularios no incluyen protección CSRF. La cookie de autenticación es `httpOnly` y `sameSite=lax`, y se marca `secure` en producción.
* `npm audit` reporta vulnerabilidades moderadas en dependencias transitivas de desarrollo. La única alerta de producción restante proviene de `uuid` dentro de Sequelize 6; corregirla requeriría una actualización mayor del ORM.

El detalle de pendientes y la guía de continuidad están en [`docs/HANDOFF.md`](docs/HANDOFF.md).

## Documentación de entrega

* [`docs/DATABASE.md`](docs/DATABASE.md): catálogo de tablas, relaciones, convenciones y cómo extender el esquema.
* [`docs/HANDOFF.md`](docs/HANDOFF.md): estado actual, arquitectura, pendientes y checklist para el equipo entrante.

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo [`LICENSE`](LICENSE) para más información.

## Contacto

* LinkedIn: <https://www.linkedin.com/in/cristianco9/>
* Repositorio: <https://github.com/Cristianco9/vive-zarzal-app>
