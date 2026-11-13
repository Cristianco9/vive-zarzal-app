# Acta de Reunión

## 1. Información general

| Campo | Información |
|---|---|
| Código del documento | ACT-MIN-001 |
| Nombre del proyecto | Vive Zarzal App |
| Tipo de reunión | Requerimientos |
| Fecha | Por definir (YYYY-MM-DD) |
| Hora de inicio | Por definir (HH:MM) |
| Hora de finalización | Por definir (HH:MM) |
| Modalidad | Por definir (Presencial / Virtual) |
| Lugar o plataforma | Por definir |
| Responsable del acta | Por definir |
| Repositorio | `https://github.com/Cristianco9/vive-zarzal-app` |
| GitHub Project | `https://github.com/users/FelOnCrackZ/projects/2` |

## 2. Objetivo de la reunión

Presentar al equipo de desarrollo el proyecto Vive Zarzal App y su estado actual, entregar los requerimientos (historias de usuario y reglas de negocio) junto con la hoja de ruta de sprints, y acordar la forma de trabajo y de seguimiento.

Resultado esperado: el equipo comprende el alcance del proyecto, cuenta con el Product Backlog y el calendario de sprints, y queda listo para realizar la planificación del Sprint 1 (acta ACT-SP-001).

## 3. Participantes

Registrar las personas convocadas y su participación en la reunión.

| Nombre completo | Rol | Usuario de GitHub | Asistencia |
|---|---|---|---|
| Cristian Camilo Cortes Ortiz | Project Owner | @Cristianco9 | Por confirmar (Presente / Ausente) |
| Felipe Nuñez Navarro (2460817) | Scrum Master | @FelOnCrackZ | Por confirmar (Presente / Ausente) |
| Jorge Humberto Leyes Rojas (2460809) | Developer | [Por confirmar] | Por confirmar (Presente / Ausente) |
| Manuel Alejandro Mera Ruiz (2460971) | Developer | [Por confirmar] | Por confirmar (Presente / Ausente) |
| Jesus Gabriel Ortiz Saac (2369566) | Developer | [Por confirmar] | Por confirmar (Presente / Ausente) |

## 4. Agenda

Enumerar los temas que serán abordados durante la reunión.

1. Presentación del proyecto: propósito, alcance y exclusiones.
2. Estado actual del repositorio.
3. Entrega de requerimientos: historias de usuario, reglas de negocio y prioridades.
4. Calendario de sprints y forma de trabajo y seguimiento.
5. Dudas del equipo y cierre de acuerdos.

## 5. Desarrollo de la reunión

Documentar los temas tratados, las explicaciones proporcionadas y los aspectos relevantes discutidos por los participantes.

### 5.1. Presentación del proyecto

Vive Zarzal App es un foro comunitario gastronómico. Los usuarios registrados publican platos (`dish`) y recetas (`recipe`), exploran el contenido por categorías e interactúan mediante me gusta, valoraciones de 1 a 5 y comentarios. Cada persona tiene un perfil y solo puede editar o eliminar sus propias publicaciones y comentarios.

Tecnologías: Node.js 18 o superior, Express 5, EJS, Sequelize 6, PostgreSQL 17 con Docker Compose, JWT en cookie `httpOnly`, bcryptjs, Joi y Multer.

Alcance: la plataforma no es un marketplace. No vende productos ni procesa pagos, carritos, pedidos o envíos (regla RN-16). Quedan fuera del alcance, salvo aprobación expresa del Project Owner: chat en tiempo real, redes de seguidores, transmisiones o video, clases en línea, planificación de comidas, notificaciones por correo o push, y recuperación de contraseña y verificación de correo.

**Preguntas y observaciones del equipo:** [Registrar durante la reunión]

### 5.2. Estado actual del repositorio

La rama `main` tiene un único commit y contiene: registro, inicio y cierre de sesión con JWT en cookie, middleware de autenticación, controlador de edición de perfil (sin su vista), esquemas de validación con Joi, middleware de carga de imágenes, 21 modelos Sequelize, 13 migraciones, Docker Compose y los diagramas de la carpeta `docs/`.

No contiene: controladores y rutas de publicaciones, categorías, me gusta, valoraciones, comentarios ni perfil público; la ruta raíz `/`; vistas distintas de `login.ejs` y `register.ejs`; la carpeta `tests/` ni la carpeta de seeders.

El README y `docs/HANDOFF.md` describen como implementadas funcionalidades que no existen en `main`. El Documento del proyecto (sección 11.3) ya reconoce esa diferencia y recomienda reconciliarla antes de planificar. Por eso la primera actividad del equipo es verificar el repositorio y planificar con base en el código real.

**Preguntas y observaciones del equipo:** [Registrar durante la reunión]

### 5.3. Entrega de requerimientos

El Product Backlog base está formado por las historias HU-01 a HU-17 del Documento del proyecto (`docs/project/Vive Zarzal - Documento del proyecto.pdf`), con sus requisitos funcionales (RF), requisitos no funcionales y reglas de negocio (RN). Las historias HU-18 a HU-23 (favoritos, notificaciones, reportes, moderación, administración y perfil ampliado) corresponden a fases futuras y no se desarrollan sin aprobación expresa.

Los requerimientos se organizan en cuatro bloques: autenticación y perfiles; publicaciones; categorías y descubrimiento; e interacción comunitaria. Se identifican en la sección 6 de esta acta.

Decisiones pendientes del Documento del proyecto (DP-01 a DP-18): se aplican las propuestas por defecto, salvo la regla sobre si un autor puede dar me gusta, valorar o comentar su propia publicación (DP-09), que el Project Owner definirá antes del Sprint 3.

**Preguntas y observaciones del equipo:** [Registrar durante la reunión]

### 5.4. Calendario de sprints y forma de trabajo

| Sprint | Fechas | Enfoque |
|---|---|---|
| Sprint 1 | 2026-11-02 al 2026-11-16 | Base estable, autenticación, perfil, publicar y feed |
| Sprint 2 | 2026-11-23 al 2026-11-30 | Exploración, detalle y propiedad de recursos |
| Sprint 3 | 2026-12-07 al 2026-12-14 | Interacción comunitaria |
| Sprint 4 | 2026-12-21 al 2026-12-28 | Cierre, calidad y entrega |

Forma de trabajo: el equipo se organiza con su Scrum Master; el Project Owner entrega los requerimientos y consulta el avance en el GitHub Project. Se trabaja con una rama por historia a partir de `main`, con Pull Request y revisión de otro integrante. Cada sprint se formaliza con un acta de planificación.

**Preguntas y observaciones del equipo:** [Registrar durante la reunión]

## 6. Requerimientos y necesidades identificadas

Registrar los requerimientos, necesidades o solicitudes identificadas durante la reunión, cuando corresponda.

| ID | Descripción | Tipo | Prioridad | Responsable |
|---|---|---|---|---|
| REQ-001 | Registro, inicio y cierre de sesión con JWT en cookie `httpOnly` y contraseñas con hash (HU-01 a HU-03). Sprint 1. | Funcional | Alta | Equipo de desarrollo |
| REQ-002 | Edición del perfil propio (HU-04, Sprint 1) y perfil público con las publicaciones del usuario (HU-05, Sprint 2). | Funcional | Alta | Equipo de desarrollo |
| REQ-003 | Publicar platos y recetas con imagen opcional (HU-08, HU-09). Sprint 1. | Funcional | Alta | Equipo de desarrollo |
| REQ-004 | Feed de publicaciones recientes (HU-07, Sprint 1), detalle de publicación (HU-10) y exploración por categoría (HU-12), Sprint 2. | Funcional | Alta | Equipo de desarrollo |
| REQ-005 | Editar y eliminar solo las publicaciones propias, con control de acceso y propiedad en el servidor (HU-11, HU-06). Sprint 2. | Funcional | Alta | Equipo de desarrollo |
| REQ-006 | Me gusta, valoración de 1 a 5 con promedio y comentarios con edición y eliminación por su autor (HU-14 a HU-17). Sprint 3. | Funcional | Alta | Equipo de desarrollo |
| REQ-007 | Búsqueda de publicaciones y paginación (HU-13). Sprint 4, sujeto a aprobación expresa del Project Owner. | Funcional | Baja | Equipo de desarrollo |
| REQ-008 | Seeders idempotentes de las 7 categorías, roles y permisos (RF-11, RF-31). Sprint 1. | Funcional | Alta | Equipo de desarrollo |
| REQ-009 | Protección CSRF en los formularios que modifican datos con autenticación por cookie. Sprint 2. | No funcional | Alta | Equipo de desarrollo |
| REQ-010 | Pruebas automatizadas de autenticación, perfiles, publicaciones, categorías, interacciones y base de datos (sección 16.3 del Documento del proyecto). Sprints 1 a 4. | No funcional | Alta | Equipo de desarrollo |
| REQ-011 | Validación de entradas en el servidor con Joi, manejo centralizado de errores, interfaz accesible y adaptable a escritorio, tableta y móvil. Sprints 1 a 4. | No funcional | Media | Equipo de desarrollo |
| REQ-012 | Entorno reproducible y documentación actualizada (README, `docs/HANDOFF.md`, `docs/Database/DATABASE.md`). Sprints 1 y 4. | No funcional | Media | Equipo de desarrollo |

## 7. Acuerdos y decisiones

Registrar las decisiones tomadas y los acuerdos establecidos entre los participantes.

| ID | Acuerdo o decisión | Responsable | Fecha de cumplimiento |
|---|---|---|---|
| AC-001 | El Product Backlog base son las historias HU-01 a HU-17 del Documento del proyecto; las historias HU-18 a HU-23 quedan fuera del alcance salvo aprobación expresa del Project Owner. | Cristian Camilo Cortes Ortiz | Por definir |
| AC-002 | Se conserva la base técnica: Node.js, Express 5, EJS, Sequelize y PostgreSQL, sin capa de servicios para los CRUD simples. | Equipo de desarrollo | Por definir |
| AC-003 | Se trabaja con una rama por historia (`feature/US-00X-nombre`) a partir de `main`, con Pull Request y revisión de al menos otro integrante antes de integrar. | Felipe Nuñez Navarro | Por definir |
| AC-004 | El avance se registra en el GitHub Project y el Project Owner lo consulta ahí; se realiza una revisión de avance a mitad de cada sprint. | Felipe Nuñez Navarro | Por definir |
| AC-005 | Todo cambio de alcance se consulta y se aprueba con el Project Owner. | Cristian Camilo Cortes Ortiz | Por definir |
| AC-006 | Los sprints se ejecutan en las fechas definidas en la sección 5.4 y cada uno se formaliza con su acta de planificación. | Todo el equipo | Por definir |

## 8. Compromisos y tareas pendientes

Registrar las actividades que deben realizarse como resultado de la reunión.

| ID | Actividad | Responsable | Fecha límite | Estado |
|---|---|---|---|---|
| TASK-001 | Compartir con el equipo el Documento del proyecto, `docs/HANDOFF.md` y los diagramas de la carpeta `docs/`, y resolver las dudas que surjan. | Cristian Camilo Cortes Ortiz | Por definir | Pendiente |
| TASK-002 | Definir y otorgar el acceso al repositorio (colaboradores o fork) y confirmar los usuarios de GitHub de los desarrolladores. | Cristian Camilo Cortes Ortiz | Por definir | Pendiente |
| TASK-003 | Crear el tablero del Sprint 1 y los issues de las historias y tareas en el GitHub Project. | Felipe Nuñez Navarro | Por definir | Pendiente |
| TASK-004 | Clonar el repositorio, levantar el entorno (Docker, migraciones) y reportar cualquier bloqueo. | Jorge Humberto Leyes Rojas, Manuel Alejandro Mera Ruiz y Jesus Gabriel Ortiz Saac | Por definir | Pendiente |
| TASK-005 | Elaborar el informe de verificación del repositorio con las diferencias entre la documentación y `main`. | Equipo de desarrollo | Por definir | Pendiente |
| TASK-006 | Estimar en Story Points las historias del Sprint 1, seleccionar las que se comprometen y repartir las tareas (acta ACT-SP-001). | Equipo de desarrollo y Scrum Master | Por definir | Pendiente |

## 9. Riesgos, problemas e impedimentos

Registrar situaciones que puedan afectar el desarrollo del proyecto o el cumplimiento de los compromisos establecidos.

| ID | Descripción | Impacto | Acción propuesta | Responsable |
|---|---|---|---|---|
| RISK-001 | La documentación describe como implementadas funcionalidades que `main` no contiene (publicaciones, interacciones, perfil público, pruebas y seeders). | Alto | Elaborar el informe de verificación y planificar con base en el código real. | Felipe Nuñez Navarro |
| RISK-002 | Sin seeders ni pruebas: el registro crea usuarios sin rol, no hay categorías para publicar y `npm test` apunta a una carpeta inexistente. | Alto | Resolverlo al inicio del Sprint 1 (historias US-001 y US-002 del acta ACT-SP-001). | Equipo de desarrollo |
| RISK-003 | El repositorio pertenece al Project Owner y el flujo de acceso y de Pull Requests del equipo no está definido. | Medio | Definir si se usan colaboradores o fork (TASK-002). | Cristian Camilo Cortes Ortiz |
| RISK-004 | Desvío del alcance hacia las tablas de extensión (administración, favoritos, notificaciones, reportes, documentos y ubicaciones). | Medio | Implementar solo lo seleccionado en cada sprint y consultar cambios con el Project Owner. | Cristian Camilo Cortes Ortiz |
| RISK-005 | Experiencia limitada del equipo con el stack tecnológico y con el entorno de Docker. | Medio | Trabajo en parejas en las historias iniciales y consultas oportunas al Project Owner. | Felipe Nuñez Navarro |
| RISK-006 | Los formularios con cookie no tienen protección CSRF. | Medio | Incorporarla en el Sprint 2 junto con el control de acceso (REQ-009). | Felipe Nuñez Navarro |

## 10. Observaciones generales

Esta acta complementa el acta de planificación del Sprint 1 (ACT-SP-001), que detalla las historias, tareas y estimaciones que el equipo debe validar.

Los campos marcados como «Por definir» o «Por confirmar» (fecha, hora, modalidad, asistencia, responsable del acta, plazos y usuarios de GitHub) y las secciones «Preguntas y observaciones del equipo» deben completarse con la información real de la reunión antes de la revisión y aprobación del acta.

## 11. Próxima reunión

| Campo | Información |
|---|---|
| Fecha propuesta | Por definir (YYYY-MM-DD) |
| Hora propuesta | Por definir (HH:MM) |
| Objetivo | Planificación del Sprint 1: estimar las historias, seleccionar el alcance del sprint, repartir tareas y firmar el acta ACT-SP-001. |
| Temas pendientes | Resultados del informe de verificación del repositorio; acceso al repositorio y flujo de Pull Requests; dudas sobre los requerimientos. |

## 12. Evidencias y referencias

Registrar los recursos relacionados con los temas tratados durante la reunión.

- Repositorio del proyecto: https://github.com/Cristianco9/vive-zarzal-app.
- GitHub Project: https://github.com/users/FelOnCrackZ/projects/2.
- Issues relacionados: pendientes de crear (TASK-003).
- Pull Requests relacionados: No aplica.
- Documentación relacionada: `docs/project/Vive Zarzal - Documento del proyecto.pdf`, `docs/HANDOFF.md`, `docs/Database/DATABASE.md` y `README.md`.
- Material de apoyo: diagramas de la carpeta `docs/` (casos de uso, clases, base de datos, secuencia, estados, componentes y despliegue).
- Grabación de la reunión (si aplica): Por definir.

## 13. Revisión y aprobación del acta

Los participantes pueden revisar el contenido del acta, solicitar correcciones y dejar constancia de su conformidad con los acuerdos y compromisos registrados.

| Participante | Rol | Usuario de GitHub | Fecha de revisión |
|---|---|---|---|
| Cristian Camilo Cortes Ortiz | Project Owner | @Cristianco9 | YYYY-MM-DD |
| Felipe Nuñez Navarro | Scrum Master | @FelOnCrackZ | YYYY-MM-DD |
| Jorge Humberto Leyes Rojas | Developer | [Por confirmar] | YYYY-MM-DD |
| Manuel Alejandro Mera Ruiz | Developer | [Por confirmar] | YYYY-MM-DD |
| Jesus Gabriel Ortiz Saac | Developer | [Por confirmar] | YYYY-MM-DD |

### Estado del acta

- [ ] Acta elaborada.
- [ ] Información y participantes verificados.
- [ ] Acuerdos y decisiones documentados.
- [ ] Compromisos y responsables identificados.
- [ ] Acta revisada por los participantes.
- [ ] Observaciones atendidas.
- [ ] Acta aprobada.

**Evidencia de revisión y aprobación:** [URL del Pull Request o discusión correspondiente]

---

**Fin del documento**

*Esta acta constituye el registro documental de los temas tratados, decisiones tomadas y compromisos establecidos durante la reunión. Cualquier modificación posterior deberá conservar la trazabilidad de los cambios realizados.*
