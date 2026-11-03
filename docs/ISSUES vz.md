# Issues propuestos para Vive Zarzal

Cada issue está listo para copiar y pegar en GitHub: el título va en el campo *Title*, las etiquetas en *Labels* y el resto en la descripción.

## Definición de terminado (aplica a todos los issues)

Se copia como checklist al final de cada issue de código:

- [ ] Rama creada desde `refactor/food-community-forum`.
- [ ] Pruebas nuevas en `tests/` (casos felices, `403`, `404` y validación cuando aplique).
- [ ] `npm test` y `npm run lint` sin errores.
- [ ] Si cambia el esquema: migración con `up` y `down`, modelo, asociaciones y `docs/DATABASE.md` actualizado.
- [ ] README y `docs/HANDOFF.md` actualizados si cambia el alcance.

## Etiquetas sugeridas

`priority: high` · `priority: medium` · `priority: low` · `auth` · `admin` · `moderation` · `discovery` · `identity` · `location` · `notifications` · `db` · `ux` · `security` · `tech-debt` · `docs` · `testing` · `infra`

## Milestones sugeridos

* **v0.2 – Autorización y moderación**: issues 1 a 5.
* **v0.3 – Descubrimiento**: issues 6 a 9, 18, 19.
* **v0.4 – Identidad y ubicación**: issues 10 a 15.
* **v0.5 – Notificaciones y cuentas**: issues 16, 17, 20, 21.
* **Seguridad y deuda técnica**: issues 27 a 31.

---

# Prioridad alta

## 1. Middleware de autorización por rol y permiso

**Etiquetas:** `priority: high`, `auth`, `security` · **Milestone:** v0.2

**Contexto**
El registro asigna el rol `member` y `req.currentUser.roles` ya se carga desde el JWT, pero ninguna ruta usa roles ni permisos. Las tablas `roles`, `permissions`, `role_permissions` y `user_roles` existen y están pobladas por seeders.

**Objetivo**
Poder proteger rutas y acciones según rol o permiso.

**Tareas**
- [ ] Ampliar `src/middlewares/auth.js` para cargar también los permisos del usuario (vía `role_permissions`).
- [ ] Crear `requireRole(...slugs)` y `requirePermission(slug)`.
- [ ] Responder `403` con la vista de error existente cuando no haya acceso.
- [ ] Exponer una función auxiliar en las vistas EJS (por ejemplo `can('permiso')`) para mostrar u ocultar botones.
- [ ] Documentar la lista de permisos sembrados y su uso previsto.

**Criterios de aceptación**
- Una ruta protegida con `requireRole('admin')` responde `403` a un `member` y `200` a un `admin`.
- Un usuario no autenticado recibe la respuesta de login/401 ya existente.
- Pruebas de acceso para los tres roles.

---

## 2. Panel de administración: gestión de roles de usuarios

**Etiquetas:** `priority: high`, `admin`, `auth` · **Milestone:** v0.2 · **Depende de:** #1

**Objetivo**
Que un administrador pueda ver usuarios y asignar o quitar roles.

**Tareas**
- [ ] Ruta `GET /admin/users` con listado de usuarios y sus roles (solo `admin`).
- [ ] Rutas para asignar y quitar rol sobre `user_roles`.
- [ ] Impedir que el último `admin` pierda su rol.
- [ ] Impedir quitar el único rol de un usuario sin dejar `member` (definir la regla y documentarla).
- [ ] Vistas EJS del panel con navegación propia.

**Criterios de aceptación**
- Solo `admin` accede al panel.
- Asignar un rol duplicado no genera error de unicidad visible al usuario.
- Pruebas de asignación, duplicado y protección del último administrador.

---

## 3. Panel de administración: CRUD de categorías y etiquetas

**Etiquetas:** `priority: high`, `admin` · **Milestone:** v0.2 · **Depende de:** #1

**Objetivo**
Gestionar los catálogos `categories` y `tags` sin tocar la base de datos.

**Tareas**
- [ ] Listar, crear, editar y eliminar categorías y etiquetas.
- [ ] Generar `slug` automáticamente a partir del nombre y validar unicidad.
- [ ] Validación con Joi en `src/schemas/index.js`.
- [ ] No permitir eliminar una categoría con publicaciones (la FK es `RESTRICT`); mostrar un mensaje claro.
- [ ] Acceso según permiso (`admin` para categorías; `moderator` también para etiquetas, si el catálogo de permisos lo permite).

**Criterios de aceptación**
- Nombres o slugs duplicados devuelven error de validación entendible.
- Eliminar una categoría en uso no rompe la aplicación.
- Pruebas de permisos y de duplicados.

---

## 4. Reportes: crear un reporte de publicación o comentario

**Etiquetas:** `priority: high`, `moderation` · **Milestone:** v0.2

**Objetivo**
Que cualquier usuario autenticado pueda reportar contenido inadecuado.

**Tareas**
- [ ] Botón "Reportar" en el detalle de la publicación y en cada comentario.
- [ ] Formulario con `reason` (lista cerrada) y `details` (opcional).
- [ ] Rutas `POST /publications/:id/report` y `POST /comments/:id/report`.
- [ ] Guardar con `status = pending` respetando la restricción `reports_target_check`.
- [ ] Evitar reportes duplicados del mismo usuario sobre el mismo contenido (definir regla; si requiere índice único, crear migración).
- [ ] No permitir reportar contenido propio.

**Criterios de aceptación**
- Reportar contenido inexistente devuelve `404`.
- Un usuario sin sesión no puede reportar.
- Pruebas de creación, duplicado y contenido propio.

---

## 5. Reportes: cola de revisión para moderadores

**Etiquetas:** `priority: high`, `moderation`, `admin` · **Milestone:** v0.2 · **Depende de:** #1, #4

**Objetivo**
Permitir a `moderator` y `admin` revisar los reportes pendientes.

**Tareas**
- [ ] Ruta `GET /admin/reports` con filtro por estado (`pending`, `approved`, `dismissed`).
- [ ] Vista de detalle con el contenido reportado, el motivo y quien reporta.
- [ ] Acciones **Aprobar** (elimina o oculta el contenido, a definir) y **Descartar**.
- [ ] Registrar `reviewed_by` y `reviewed_at`.
- [ ] Definir si "aprobar" borra el contenido o lo oculta (si se oculta, agregar columna y migración).

**Criterios de aceptación**
- Solo `moderator` y `admin` acceden.
- Un reporte ya revisado no se puede revisar de nuevo.
- Pruebas del flujo completo y de permisos `403`.

---

## 6. Etiquetas en publicaciones

**Etiquetas:** `priority: high`, `discovery` · **Milestone:** v0.3

**Objetivo**
Asociar etiquetas a platos y recetas.

**Tareas**
- [ ] Selector múltiple de etiquetas en el formulario de crear y editar publicación.
- [ ] Guardar en `publication_tags` dentro de una transacción.
- [ ] Mostrar las etiquetas en el feed y en el detalle.
- [ ] Limitar el número de etiquetas por publicación (por ejemplo, 5).
- [ ] Validar que los ids existan.

**Criterios de aceptación**
- Editar quita y agrega etiquetas correctamente, sin duplicados.
- Un id de etiqueta inválido devuelve error de validación.
- Pruebas de creación, edición y límite.

---

## 7. Filtros y páginas por etiqueta

**Etiquetas:** `priority: high`, `discovery` · **Milestone:** v0.3 · **Depende de:** #6

**Tareas**
- [ ] Ruta `GET /tags/:slug` con las publicaciones de la etiqueta.
- [ ] Enlaces desde las etiquetas del feed y del detalle.
- [ ] Combinación opcional categoría + etiqueta mediante query string.
- [ ] Respuesta `404` para un slug inexistente.

**Criterios de aceptación**
- La página lista solo publicaciones con esa etiqueta, ordenadas por fecha.
- Pruebas de etiqueta existente, inexistente y vacía.

---

## 8. Favoritos: guardar y quitar publicaciones

**Etiquetas:** `priority: high`, `discovery` · **Milestone:** v0.3

**Objetivo**
Que un usuario pueda guardar publicaciones para verlas después.

**Tareas**
- [ ] Ruta `POST /publications/:id/favorite` con alternancia, siguiendo el patrón de `likes`.
- [ ] Botón en el feed y en el detalle que refleje el estado actual.
- [ ] Manejar la restricción única `(user_id, publication_id)` sin errores `500`.

**Criterios de aceptación**
- Guardar dos veces seguidas deja la publicación sin guardar.
- Requiere sesión; publicación inexistente devuelve `404`.
- Pruebas de alternancia y autenticación.

---

## 9. Favoritos: listado en el perfil

**Etiquetas:** `priority: high`, `discovery`, `ux` · **Milestone:** v0.3 · **Depende de:** #8

**Tareas**
- [ ] Ruta `GET /favorites` (o pestaña en el perfil propio) con las publicaciones guardadas.
- [ ] Decidir la privacidad: solo el dueño ve sus favoritos (recomendado).
- [ ] Estado vacío con mensaje y enlace al feed.

**Criterios de aceptación**
- Un usuario no puede ver los favoritos de otro.
- Pruebas de listado y de acceso.

---

# Prioridad media

## 10. Formulario de documentos de usuario

**Etiquetas:** `priority: medium`, `identity` · **Milestone:** v0.4

**Tareas**
- [ ] CRUD en el perfil propio sobre `user_documents`.
- [ ] Selector de `document_types` activos (`is_active`).
- [ ] Validar `document_number`, `issued_at` y `expires_at` (la expedición no puede ser posterior al vencimiento).
- [ ] Manejar las restricciones únicas `(user_id, document_type_id)` y `(document_type_id, document_number)` con mensajes claros.
- [ ] Definir qué datos se muestran y cuáles se enmascaran (el número de documento nunca debe aparecer en el perfil público).

**Criterios de aceptación**
- Un documento duplicado muestra un error entendible.
- Un usuario solo ve y edita sus propios documentos.

---

## 11. Carga de soportes de documentos

**Etiquetas:** `priority: medium`, `identity`, `security` · **Milestone:** v0.4 · **Depende de:** #10

**Tareas**
- [ ] Migración para guardar la ruta del archivo de soporte.
- [ ] Subida con Multer con validación de tipo (PDF, JPG, PNG) y tamaño.
- [ ] Guardar fuera de `src/public/` o servir mediante una ruta con autorización, porque son datos sensibles.
- [ ] Eliminar el archivo físico al borrar el documento.

**Criterios de aceptación**
- Los soportes no son accesibles por URL pública directa.
- Pruebas de archivo inválido, tamaño excedido y acceso de terceros (`403`).

---

## 12. Verificación de documentos por administrador

**Etiquetas:** `priority: medium`, `identity`, `admin` · **Milestone:** v0.4 · **Depende de:** #1, #10

**Tareas**
- [ ] Listado de documentos pendientes en el panel.
- [ ] Acciones verificar y revocar, con `is_verified` y `verified_at`.
- [ ] Si el usuario edita un documento ya verificado, volver a `is_verified = false`.
- [ ] Insignia "Verificado" visible en el perfil (sin exponer el número).

**Criterios de aceptación**
- Solo `admin` puede verificar.
- Pruebas de verificación, revocación y reinicio al editar.

---

## 13. Gestión de direcciones de usuario

**Etiquetas:** `priority: medium`, `location` · **Milestone:** v0.4

**Tareas**
- [ ] CRUD de `user_addresses` en el perfil propio.
- [ ] Mantener una sola dirección con `is_primary = true` por usuario (transacción al cambiarla).
- [ ] Validación Joi de `label`, `line1`, `line2` y `postal_code`.
- [ ] Impedir ver o editar direcciones de otros usuarios.

**Criterios de aceptación**
- Marcar una dirección como principal desmarca la anterior.
- Pruebas de CRUD, principal única y permisos.

---

## 14. Selectores dependientes país → departamento → ciudad

**Etiquetas:** `priority: medium`, `location`, `ux` · **Milestone:** v0.4

**Tareas**
- [ ] Endpoints JSON: `GET /api/countries`, `/api/countries/:id/departments`, `/api/departments/:id/cities`.
- [ ] Script en `src/public/` que cargue los selects en cascada.
- [ ] Funcionar sin JavaScript como mejora progresiva si es viable (al menos validar en servidor).
- [ ] Validar en servidor que la ciudad pertenezca al departamento y país elegidos.

**Criterios de aceptación**
- Cambiar el país limpia departamento y ciudad.
- El servidor rechaza combinaciones incoherentes.

---

## 15. Ampliar el seeder de ubicaciones

**Etiquetas:** `priority: medium`, `location`, `db` · **Milestone:** v0.4

**Contexto**
Hoy el seeder solo incluye Colombia, 3 departamentos y 5 ciudades.

**Tareas**
- [ ] Incluir los 32 departamentos de Colombia y las ciudades principales (o importar desde una fuente oficial como DIVIPOLA/DANE).
- [ ] Mantener la idempotencia: consultar antes de insertar.
- [ ] Decidir si se incluyen otros países.
- [ ] Actualizar el conteo en `docs/DATABASE.md` y las pruebas de esquema.

**Criterios de aceptación**
- Ejecutar el seeder dos veces no duplica registros.
- Las pruebas de catálogo reflejan los nuevos conteos.

---

## 16. Notificaciones: creación automática

**Etiquetas:** `priority: medium`, `notifications` · **Milestone:** v0.5

**Tareas**
- [ ] Crear una notificación al recibir un me gusta, comentario o calificación en una publicación propia.
- [ ] No notificar acciones sobre contenido propio.
- [ ] Definir los valores de `type` (`like`, `comment`, `rating`) y las plantillas de `title` y `message`.
- [ ] Enlazar con `related_publication_id`.
- [ ] Evitar notificaciones repetidas al alternar un me gusta (definir regla: por ejemplo, crear solo al dar like y no al quitarlo).

**Criterios de aceptación**
- Pruebas por cada tipo de interacción y para el caso de contenido propio.

---

## 17. Notificaciones: centro de notificaciones

**Etiquetas:** `priority: medium`, `notifications`, `ux` · **Milestone:** v0.5 · **Depende de:** #16

**Tareas**
- [ ] Ruta `GET /notifications` con listado paginado.
- [ ] Contador de no leídas en la barra de navegación (usa el índice `(user_id, is_read)`).
- [ ] Marcar una o todas como leídas (`is_read`, `read_at`).
- [ ] Enlace de cada notificación a la publicación relacionada (manejar que se haya eliminado: FK `SET NULL`).

**Criterios de aceptación**
- Un usuario solo ve y marca sus propias notificaciones.
- Pruebas de listado, lectura y acceso ajeno (`403`/`404`).

---

## 18. Paginación del feed

**Etiquetas:** `priority: medium`, `discovery`, `ux` · **Milestone:** v0.3

**Tareas**
- [ ] Paginación con `page` y `limit` en `/`, `/categories/:slug` y `/tags/:slug`.
- [ ] Límite máximo y valores por defecto validados.
- [ ] Controles de navegación en las vistas.
- [ ] Usar el índice existente sobre `created_at`.

**Criterios de aceptación**
- Un `page` fuera de rango muestra una página vacía o redirige, sin errores `500`.
- Pruebas con más publicaciones que el tamaño de página.

---

## 19. Búsqueda de publicaciones

**Etiquetas:** `priority: medium`, `discovery` · **Milestone:** v0.3

**Tareas**
- [ ] Parámetro `q` que busque en título, descripción e ingredientes.
- [ ] Empezar con `ILIKE`; evaluar índices `pg_trgm` o búsqueda de texto completo si el rendimiento lo exige.
- [ ] Escapar los comodines `%` y `_` de la entrada del usuario.
- [ ] Combinar con paginación y filtros.

**Criterios de aceptación**
- La búsqueda no es vulnerable a inyección ni a comodines no deseados.
- Pruebas de coincidencias, sin resultados y caracteres especiales.

---

## 20. Recuperación de contraseña

**Etiquetas:** `priority: medium`, `auth`, `security` · **Milestone:** v0.5

**Tareas**
- [ ] Migración para tokens de restablecimiento (hash del token, expiración, uso único).
- [ ] Formularios "Olvidé mi contraseña" y "Restablecer contraseña".
- [ ] Respuesta idéntica exista o no el correo (evitar enumeración de usuarios).
- [ ] Servicio de envío de correo configurable por variables de entorno.
- [ ] Invalidar el token tras usarlo.

**Criterios de aceptación**
- Tokens expirados o reutilizados son rechazados.
- Pruebas con un transporte de correo simulado.

---

## 21. Verificación de correo electrónico

**Etiquetas:** `priority: medium`, `auth` · **Milestone:** v0.5

**Tareas**
- [ ] Migración con `email_verified_at` y tokens de verificación.
- [ ] Envío de enlace al registrarse y reenvío bajo demanda.
- [ ] Definir qué acciones requieren correo verificado (por ejemplo, publicar).
- [ ] Reiniciar la verificación al cambiar el correo en `/profile/edit`.

**Criterios de aceptación**
- Un usuario sin verificar ve un aviso y puede reenviar el enlace.
- Pruebas del flujo y de la restricción de acciones.

---

# Prioridad baja

## 22. Panel de métricas

**Etiquetas:** `priority: low`, `admin` · Usuarios registrados, publicaciones por categoría y por semana, reportes pendientes y actividad reciente, visibles solo para `admin`.

## 23. Auditoría de acciones administrativas

**Etiquetas:** `priority: low`, `admin`, `security` · Tabla de auditoría (quién, qué, cuándo, sobre qué recurso) alimentada por asignación de roles, verificación de documentos y revisión de reportes. Vista de consulta solo para `admin`.

## 24. Almacenamiento externo de imágenes

**Etiquetas:** `priority: low`, `infra` · Abstraer el guardado de imágenes detrás de una interfaz y agregar un adaptador para almacenamiento de objetos (S3 compatible). Mantener el disco local como opción de desarrollo. Incluir migración de las imágenes existentes.

## 25. Notificaciones por correo o push

**Etiquetas:** `priority: low`, `notifications` · **Depende de:** #16, #20 · Envío opcional según preferencias del usuario (nueva tabla o columnas de preferencias), con límite de frecuencia y enlace para darse de baja.

## 26. Pruebas end-to-end de navegador

**Etiquetas:** `priority: low`, `testing` · Configurar Playwright o Cypress y cubrir los flujos críticos: registro, publicar, interactuar, editar perfil y, cuando existan, reportes y panel.

---

# Seguridad y deuda técnica

## 27. Protección CSRF en formularios

**Etiquetas:** `priority: high`, `security` · **Milestone:** Seguridad

**Contexto**
La documentación indica que no hay CSRF. Hoy todas las acciones (`like`, `delete`, `logout`, etc.) son `POST` con cookie `sameSite=lax`.

**Tareas**
- [ ] Elegir mecanismo (token sincronizado o doble envío de cookie), compatible con Express 5.
- [ ] Incluir el token en todos los formularios EJS, incluidos los `multipart`.
- [ ] Rechazar con `403` las peticiones sin token válido.
- [ ] Actualizar las pruebas existentes para enviar el token.

**Criterios de aceptación**
- Una petición `POST` sin token es rechazada.
- Todos los flujos actuales siguen funcionando.

---

## 28. Actualizar Sequelize para corregir la alerta de `uuid`

**Etiquetas:** `priority: medium`, `tech-debt`, `security` · **Milestone:** Seguridad

**Contexto**
`npm audit` reporta una alerta de producción que viene de `uuid` dentro de Sequelize 6.

**Tareas**
- [ ] Evaluar la migración a la versión mayor siguiente de Sequelize y su guía de cambios.
- [ ] Revisar compatibilidad con `sequelize-cli`, migraciones, modelos y asociaciones.
- [ ] Ejecutar la suite completa y probar migraciones desde cero.
- [ ] Si el costo es alto, documentar la decisión y evaluar un `overrides` en `package.json` como medida temporal.

**Criterios de aceptación**
- `npm audit --omit=dev` sin alertas de `uuid`, o decisión documentada.

---

## 29. Revisar vulnerabilidades de dependencias de desarrollo

**Etiquetas:** `priority: low`, `tech-debt`, `security` · Revisar las alertas moderadas transitivas de `npm audit`, actualizar lo que sea seguro y documentar lo que se acepte.

## 30. Límite de intentos en login y registro

**Etiquetas:** `priority: medium`, `security`, `auth` · Agregar *rate limiting* por IP y por cuenta en `/login` y `/register`, con mensajes genéricos y pruebas. Configurable por variables de entorno.

## 31. Seeders seguros para producción

**Etiquetas:** `priority: medium`, `db`, `infra` · Separar los seeders de catálogos esenciales (roles, permisos, tipos de documento) de los de ejemplo (ubicaciones demo, etiquetas demo) y documentar cuáles son seguros en producción. Considerar una variable `NODE_ENV` para decidir cuáles se ejecutan.

---

# Documentación y procesos

## 32. Crear `CONTRIBUTING.md`

**Etiquetas:** `docs` · Flujo de ramas desde `refactor/food-community-forum`, convención de commits, cómo correr pruebas y lint, y la checklist de pull request.

## 33. Plantillas de issues y pull requests

**Etiquetas:** `docs`, `infra` · Crear `.github/ISSUE_TEMPLATE/` (bug, funcionalidad) y `.github/pull_request_template.md` con la definición de terminado de este documento.

## 34. Integración continua con GitHub Actions

**Etiquetas:** `priority: high`, `infra`, `testing`

**Tareas**
- [ ] Workflow en `.github/workflows/ci.yml` con Node 18+ y un servicio PostgreSQL.
- [ ] Pasos: `npm ci`, `npm run migrations:run`, `npm run seeds:run`, `npm run lint`, `npm test`.
- [ ] Variables de entorno de prueba (nunca secretos reales).
- [ ] Ejecutar en cada pull request hacia la rama de trabajo.

**Criterios de aceptación**
- Un PR con lint o pruebas fallidas queda marcado en rojo.

## 35. Verificar las rutas de documentación

**Etiquetas:** `docs` · El README apunta a `docs/DATABASE.md` y `docs/HANDOFF.md`. Confirmar que ambos archivos estén en `docs/` y que los enlaces funcionen. Corregir también la nota "`README.md`" vs. el nombre real del archivo en el repositorio si difiere.
