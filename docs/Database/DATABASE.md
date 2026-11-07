# Catálogo de base de datos

El proyecto usa PostgreSQL y Sequelize 6. El esquema tiene **21 tablas de dominio** y la tabla técnica `SequelizeMeta`, que registra las migraciones aplicadas.

## Convenciones

* Tablas y columnas en `snake_case`.
* Modelos y atributos en `camelCase`.
* Cada modelo declara `tableName`, `underscored: true` y `timestamps: true`.
* Las claves primarias son enteros autoincrementales.
* Las fechas de creación y actualización se llaman `created_at` y `updated_at`.
* Las claves foráneas terminan en `_id`.
* Los catálogos usan restricciones `UNIQUE` para evitar duplicados.
* Las tablas de relación usan índices únicos compuestos.

## Resumen

| Grupo | Tablas |
| --- | --- |
| Núcleo del foro | `users`, `categories`, `publications`, `likes`, `ratings`, `comments` |
| Control de acceso | `roles`, `permissions`, `role_permissions`, `user_roles` |
| Identidad | `document_types`, `user_documents` |
| Ubicación | `countries`, `departments`, `cities`, `user_addresses` |
| Descubrimiento | `tags`, `publication_tags`, `favorites` |
| Notificaciones y moderación | `notifications`, `reports` |

## Tablas del núcleo

### `users`

Cuentas de la comunidad.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | integer | PK |
| `first_name` | varchar(80) | Obligatorio |
| `last_name` | varchar(80) | Obligatorio |
| `username` | varchar(50) | Único |
| `email` | varchar(150) | Único |
| `password` | varchar(255) | Hash bcrypt |
| `bio` | text | Opcional |

Relaciones: publicaciones, likes, calificaciones, comentarios, roles, documentos, direcciones, favoritos, notificaciones y reportes.

### `categories`

Catálogo de categorías de comida.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | integer | PK |
| `name` | varchar(80) | Único |
| `slug` | varchar(80) | Único, usado en URLs |
| `description` | varchar(255) | Opcional |

### `publications`

Platos y recetas publicados por los usuarios.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | integer | PK |
| `user_id` | integer | FK a `users`, `CASCADE` |
| `category_id` | integer | FK a `categories`, `RESTRICT` |
| `type` | varchar(10) | `dish` o `recipe` |
| `title` | varchar(150) | Obligatorio |
| `description` | text | Obligatorio |
| `image_url` | varchar(255) | Opcional |
| `ingredients` | text | Obligatorio para recetas |
| `instructions` | text | Obligatorio para recetas |

Índices: `user_id`, `category_id`, `created_at`.

### `likes`

Me gusta de una publicación.

* `user_id` y `publication_id` con FK `CASCADE`.
* Índice único `(user_id, publication_id)`.

### `ratings`

Calificación de 1 a 5.

* `user_id` y `publication_id` con FK `CASCADE`.
* `score` entero validado entre 1 y 5.
* Índice único `(user_id, publication_id)`.

### `comments`

Comentarios de una publicación.

* `user_id` y `publication_id` con FK `CASCADE`.
* `content` en texto.
* Índices por publicación y usuario.

## Control de acceso

### `roles`

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | integer | PK |
| `name` | varchar(50) | Único |
| `slug` | varchar(50) | Único |
| `description` | varchar(255) | Opcional |
| `is_system` | boolean | Indica roles base del sistema |

Roles sembrados: `admin`, `moderator`, `member`.

### `permissions`

Permisos granulares por acción.

* `name` y `slug` únicos.
* Se asignan a roles mediante `role_permissions`.

### `role_permissions`

* `role_id` FK a `roles`, `CASCADE`.
* `permission_id` FK a `permissions`, `CASCADE`.
* Índice único `(role_id, permission_id)`.

### `user_roles`

* `user_id` FK a `users`, `CASCADE`.
* `role_id` FK a `roles`, `CASCADE`.
* Índice único `(user_id, role_id)`.
* El registro asigna `member` por defecto.

## Identidad

### `document_types`

Catálogo de documentos.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | integer | PK |
| `name` | varchar(100) | Único |
| `code` | varchar(20) | Único |
| `description` | varchar(255) | Opcional |
| `is_active` | boolean | Activo por defecto |

Códigos sembrados: `CC`, `CE`, `PA`, `TI`, `PPT`, `NIT`.

### `user_documents`

Documentos asociados a una cuenta.

* `user_id` FK a `users`, `CASCADE`.
* `document_type_id` FK a `document_types`, `RESTRICT`.
* `document_number` varchar(50).
* `issued_at`, `expires_at` como fechas.
* `is_verified`, `verified_at` para el flujo de verificación.
* Índices únicos: `(user_id, document_type_id)` y `(document_type_id, document_number)`.

## Ubicación

### `countries`

* `name` único.
* `iso2` único de 2 caracteres.
* `iso3` único opcional de 3 caracteres.
* `phone_code` opcional.

### `departments`

* `country_id` FK a `countries`, `CASCADE`.
* `name` y `code`.
* Índice único `(country_id, name)`.

### `cities`

* `department_id` FK a `departments`, `CASCADE`.
* `name` y `code`.
* Índice único `(department_id, name)`.

### `user_addresses`

* `user_id` FK a `users`, `CASCADE`.
* `city_id` FK a `cities`, `RESTRICT`.
* `label`, `line1`, `line2`, `postal_code`.
* `is_primary` para marcar la dirección principal.
* Índices por usuario y ciudad.

## Descubrimiento

### `tags`

* `name` varchar(50) único.
* `slug` varchar(60) único.

### `publication_tags`

* `publication_id` FK a `publications`, `CASCADE`.
* `tag_id` FK a `tags`, `CASCADE`.
* Índice único `(publication_id, tag_id)`.

### `favorites`

Publicaciones guardadas por un usuario.

* `user_id` FK a `users`, `CASCADE`.
* `publication_id` FK a `publications`, `CASCADE`.
* Índice único `(user_id, publication_id)`.

## Notificaciones y moderación

### `notifications`

* `user_id` FK a `users`, `CASCADE`.
* `type`, `title`, `message`.
* `related_publication_id` FK a `publications`, `SET NULL`.
* `is_read`, `read_at`.
* Índices por `(user_id, is_read)` y publicación relacionada.

### `reports`

Reportes de contenido para moderación.

* `reporter_id` FK a `users`, `CASCADE`.
* `publication_id` FK a `publications`, `CASCADE`, opcional.
* `comment_id` FK a `comments`, `CASCADE`, opcional.
* `reason`, `details`.
* `status` con valor inicial `pending`.
* `reviewed_by` FK a `users`, `SET NULL`.
* `reviewed_at`.
* Restricción `reports_target_check`: el reporte debe apuntar a una publicación o a un comentario.
* Índices por estado, publicación, comentario y reportero.
* Índices únicos parciales `(reporter_id, publication_id)` y `(reporter_id, comment_id)`: un usuario solo puede reportar una vez cada publicación o comentario.

## Relaciones principales

```text
User 1 ── * Publication
User 1 ── * Like / Rating / Comment / Favorite / Notification
User * ── * Role        (user_roles)
Role * ── * Permission  (role_permissions)

User 1 ── * UserDocument * ── 1 DocumentType
Country 1 ── * Department 1 ── * City 1 ── * UserAddress
User 1 ── * UserAddress

Publication * ── * Tag  (publication_tags)
User 1 ── * Favorite * ── 1 Publication

Report * ── 1 User (reporter)
Report * ── 0..1 Publication
Report * ── 0..1 Comment
```

## Seeders

| Seeder | Contenido |
| --- | --- |
| `20261031000001-categories.cjs` | 7 categorías de comida |
| `20261031000002-roles-and-permissions.cjs` | 3 roles, 14 permisos y asignaciones; asigna `member` a usuarios sin rol |
| `20261031000003-document-types.cjs` | 6 tipos de documento |
| `20261031000004-locations.cjs` | Colombia, 3 departamentos y 5 ciudades |
| `20261031000005-tags.cjs` | 8 etiquetas |

Los seeders consultan los catálogos antes de insertar, por lo que se pueden ejecutar más de una vez.

## Cómo extender el esquema

1. Crear la migración:

   ```sh
   npm run migrations:generate -- nombre-de-la-migracion
   ```

2. Implementar `up` y `down` en `src/db/migrations/`.
3. Crear el modelo en `src/db/models/`.
4. Importarlo y exportarlo desde `src/db/models/index.js`.
5. Registrar sus asociaciones en `setupAssociations()`.
6. Agregar un seeder si la tabla es un catálogo.
7. Ejecutar:

   ```sh
   npm run migrations:run
   npm run seeds:run
   npm test
   ```

8. Actualizar este documento y `docs/HANDOFF.md`.

## Verificación rápida

```sh
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "\dt"
npm test
npm run lint
```
