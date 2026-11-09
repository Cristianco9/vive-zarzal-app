# Roles y permisos

Guía de los roles y permisos que crea el seeder `src/db/seeders/20261031000002-roles-and-permissions.cjs` y de cómo usarlos para proteger rutas y vistas.

## Roles

| Slug | Nombre | Descripción |
| --- | --- | --- |
| `admin` | Administrador | Acceso completo a la administración del foro. Tiene todos los permisos. |
| `moderator` | Moderador | Revisa reportes y modera publicaciones y comentarios. |
| `member` | Miembro | Rol por defecto al registrarse (se asigna en `authController.register`). |

## Permisos sembrados

La columna **Uso previsto** indica dónde debería comprobarse cada permiso. Los que todavía no tienen pantalla están pensados para las funcionalidades del backlog.

| Slug | Uso previsto | `member` | `moderator` | `admin` |
| --- | --- | :---: | :---: | :---: |
| `publications:create` | Publicar platos y recetas. | ✔ | | ✔ |
| `publications:update:own` | Editar las publicaciones propias. | ✔ | | ✔ |
| `publications:delete:own` | Eliminar las publicaciones propias. | ✔ | | ✔ |
| `publications:moderate` | Editar o retirar publicaciones de cualquier usuario. | | ✔ | ✔ |
| `comments:create` | Comentar publicaciones. | ✔ | | ✔ |
| `comments:moderate` | Editar o retirar comentarios de cualquier usuario. | | ✔ | ✔ |
| `ratings:create` | Calificar publicaciones. | ✔ | | ✔ |
| `favorites:manage` | Guardar y quitar publicaciones favoritas. | ✔ | | ✔ |
| `users:manage` | Administrar cuentas y estados de usuario. | | | ✔ |
| `roles:manage` | Asignar roles y permisos. | | | ✔ |
| `categories:manage` | Crear y editar categorías. | | | ✔ |
| `tags:manage` | Crear y editar etiquetas. | | ✔ | ✔ |
| `documents:verify` | Revisar y verificar documentos de identidad. | | | ✔ |
| `reports:manage` | Revisar y resolver reportes de contenido (cola de moderación). | | ✔ | ✔ |

## Cómo se cargan

`loadCurrentUser` (en `src/middlewares/auth.js`) lee el JWT de la cookie `authentication`, busca al usuario y carga:

* `req.currentUser.roles`: los roles del usuario.
* `req.currentUser.permissions`: arreglo de slugs con los permisos de todos sus roles, sin repetidos (se obtienen por `role_permissions`).

Los permisos se consultan en cada petición, así que un cambio de rol se aplica sin tener que volver a iniciar sesión.

## Proteger rutas

```js
import { requirePermission, requireRole } from '../middlewares/auth.js';

// Solo administradores
router.get('/admin', requireRole('admin'), adminController.index);

// Basta con tener uno de los roles
router.get('/moderacion', requireRole('admin', 'moderator'), moderationController.index);

// Por permiso (recomendado cuando la regla es sobre una acción)
router.post('/reports/:id/resolve', requirePermission('reports:manage'), reportController.resolve);
```

Respuestas:

| Situación | Respuesta |
| --- | --- |
| Sin sesión | Redirección a `/login?next=...` (igual que `requireAuth`). |
| Con sesión pero sin el rol o permiso | `403` con la vista `error.ejs` (o `{ "error": "..." }` si el cliente no pide HTML). |
| Con el rol o permiso | Continúa a la siguiente función de la ruta. |

Los permisos terminados en `:own` solo indican que el usuario puede hacer esa acción **sobre sus propios recursos**. `requirePermission` no sabe de quién es el recurso, así que el controlador debe seguir comprobando la propiedad (como ya hacen `publicationController` e `interactionController`).

## Mostrar u ocultar elementos en las vistas

Todas las vistas EJS tienen disponible `can('permiso')`, que devuelve `true` o `false` (siempre `false` si no hay sesión):

```ejs
<% if (can('reports:manage')) { %>
  <a href="/moderacion">Cola de reportes</a>
<% } %>
```

Ocultar un botón no protege la ruta: la ruta también debe llevar su `requireRole` o `requirePermission`.

## Pruebas

`tests/authorization.test.js` cubre los tres roles y el caso sin sesión: `403` para `member` y `moderator` en una ruta `requireRole('admin')`, `200` para `admin`, redirección al login sin sesión, permisos por rol y el helper `can()`. Necesita la base con migraciones y seeders aplicados (`npm run test:setup`).
