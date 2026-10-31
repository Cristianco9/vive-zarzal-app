# Sabor Comunitario

Foro comunitario de comida para compartir **platos** y **recetas**. Cada persona puede publicar lo que cocina, explorar por categorías, dar me gusta, calificar de 1 a 5, comentar y gestionar su propio perfil.

La aplicación conserva la base técnica del proyecto original (Node.js, Express, EJS, Sequelize y PostgreSQL) y reemplaza por completo el dominio de marketplace turístico por un foro gastronómico.

## Tabla de contenidos

* [Funcionalidades](#funcionalidades)
* [Tecnologías](#tecnologías)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Requisitos](#requisitos)
* [Instalación](#instalación)
* [Variables de entorno](#variables-de-entorno)
* [Uso](#uso)
* [Rutas principales](#rutas-principales)
* [Modelo de datos](#modelo-de-datos)
* [Pruebas](#pruebas)
* [Scripts disponibles](#scripts-disponibles)
* [Limitaciones conocidas](#limitaciones-conocidas)
* [Licencia](#licencia)

## Funcionalidades

* Registro e inicio de sesión con contraseñas cifradas y sesión mediante cookie JWT.
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
* Perfil público con las publicaciones de cada usuario.
* Edición del perfil propio (nombre, apellido, correo y biografía).
* Validación de formularios con Joi y manejo centralizado de errores.

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
├── controllers/              # Lógica de autenticación, usuarios, publicaciones e interacciones
├── db/
│   ├── config.cjs            # Configuración de sequelize-cli
│   ├── migrations/           # Migraciones de las seis tablas del dominio
│   ├── models/               # Modelos Sequelize y asociaciones
│   └── seeders/              # Categorías iniciales
├── libraries/DBConnection.js # Conexión a PostgreSQL
├── middlewares/              # Autenticación, errores y subida de archivos
├── public/                   # CSS, JavaScript del formulario e imágenes subidas
├── router/                   # Rutas HTTP
├── schemas/index.js          # Esquemas de validación con Joi
├── utils/                    # JWT, bcrypt y errores HTTP
└── views/                    # Vistas EJS
tests/
└── forum.test.js             # Pruebas de integración de los flujos principales
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
5. Entra a tu perfil para ver tus publicaciones o editar tus datos.

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

El dominio final está compuesto por seis tablas:

* **users**: nombre, apellido, nombre de usuario único, correo único, contraseña cifrada y biografía.
* **categories**: nombre, slug único y descripción.
* **publications**: autor, categoría, tipo (`dish` o `recipe`), título, descripción, imagen opcional e ingredientes/instrucciones para recetas.
* **likes**: un registro único por usuario y publicación.
* **ratings**: puntuación de 1 a 5, única por usuario y publicación.
* **comments**: contenido, autor y publicación.

Las claves foráneas usan `ON DELETE CASCADE` para las interacciones y las publicaciones de un usuario, de modo que al eliminar una publicación o un usuario desaparecen sus likes, calificaciones y comentarios. Las categorías usan `ON DELETE RESTRICT` para no dejar publicaciones huérfanas.

## Pruebas

Las pruebas de integración cubren registro, inicio de sesión, creación de platos y recetas, permisos de edición y eliminación, me gusta, calificaciones, comentarios, perfil, cierre de sesión y la ausencia de las rutas del marketplace anterior.

Requisitos:

* Base de datos migrada y con las categorías sembradas.
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
| `npm test` | Ejecuta las pruebas de integración |
| `npm run test:setup` | Ejecuta migraciones y seeders |
| `npm run lint` | Analiza `src` y `tests` con ESLint |
| `npm run env-var` | Copia `env/.envExample` a `.env` |
| `npm run migrations:run` | Ejecuta las migraciones pendientes |
| `npm run migrations:revert` | Revierte la última migración |
| `npm run migrations:delete` | Revierte todas las migraciones |
| `npm run seeds:run` | Ejecuta los seeders |
| `npm run seeds:revert` | Revierte el último seeder |
| `npm run seeds:delete` | Revierte todos los seeders |

## Limitaciones conocidas

* Las imágenes se almacenan en el sistema de archivos local, no en un servicio externo. En un despliegue con varias instancias o contenedores efímeros se necesita almacenamiento compartido u objeto (por ejemplo, S3).
* No se implementa paginación en el feed ni en los perfiles; el feed limita la consulta a las 30 publicaciones más recientes.
* No hay recuperación de contraseña, verificación de correo ni roles de administración.
* Los formularios no incluyen protección CSRF. La cookie de autenticación es `httpOnly` y `sameSite=lax`, y se marca `secure` en producción.
* Si una escritura en base de datos falla después de que Multer guardó la imagen, puede quedar un archivo huérfano en `src/public/uploads/`.
* `npm audit` reporta vulnerabilidades moderadas en dependencias transitivas de desarrollo (principalmente `sequelize-cli` y `nodemon`). La única alerta de producción restante proviene de `uuid` dentro de Sequelize 6; corregirla requeriría una actualización mayor del ORM.

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo [`LICENSE`](LICENSE) para más información.

## Contacto

* LinkedIn: <https://www.linkedin.com/in/cristianco9/>
* Repositorio: <https://github.com/Cristianco9/vive-zarzal-app>
