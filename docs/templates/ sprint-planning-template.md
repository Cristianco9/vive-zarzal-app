# Acta de Planificación del Sprint

## 1. Información general

| Campo | Información |
|---|---|
| Código del documento | ACT-SP-001 |
| Nombre del proyecto | Vive Zarzal App |
| Número del Sprint | Sprint 1 |
| Fecha de planificación | 2026-11-02 |
| Hora de inicio | 07:00 |
| Hora de finalización | 22:00 |
| Duración del Sprint | 2 semanas (2026-11-02 al 2026-11-16) |
| Scrum Master | Felipe Nuñez Navarro (2460817) |
| Product Owner | Cristian Camilo Cortes Ortiz |
| Repositorio | `https://github.com/Cristianco9/vive-zarzal-app` |
| GitHub Project | `https://github.com/users/FelOnCrackZ/projects/2` |

## 2. Objetivo de la reunión

Definir el objetivo del Sprint, seleccionar los elementos del Product Backlog que 
serán abordados durante el periodo de trabajo y establecer el plan necesario para 
alcanzar los resultados esperados.

## 3. Participantes

| Nombre completo | Rol | Asistencia |
|---|---|---|
| Cristian Camilo Cortes Ortiz | Product Owner | Presente |
| Felipe Nuñez Navarro (2460817) | Scrum Master | Presente |
| Jorge Humberto Leyes Rojas (2460809) | Developer | Presente |
| Manuel Alejandro Mera Ruiz (2460971) | Developer | Presente |
| Jesus Gabriel Ortiz Saac (2369566) | Developer | Presente |

## 4. Objetivo del Sprint (Sprint Goal)

**Objetivo:**

Dejar la base del proyecto estable y reproducible desde cero (base de datos con 
datos semilla, pruebas y análisis estático funcionando) y entregar el primer 
flujo de valor del foro gastronómico: que una persona pueda registrarse, iniciar 
sesión, editar su perfil, publicar un plato o una receta y verla en el feed público 
de publicaciones recientes.

## 5. Elementos seleccionados del Product Backlog

Registrar las historias de usuario, requerimientos o elementos del Product Backlog 
seleccionados para el Sprint.

Las referencias HU, RF y RN corresponden al documento `docs/project/Vive Zarzal 
- Documento del proyecto.pdf`.

| ID | Historia de usuario / Requerimiento | Prioridad | Story Points | Issue |
|---|---|---|---|---|
| US-001 | Como equipo de desarrollo, quiero verificar y estabilizar la base del repositorio (instalación desde cero, migraciones, `npm run lint`, `npm test`) y reconciliar la documentación con el código real de `main`, para trabajar sobre una base confiable. (Plan de trabajo, prioridad 0) | Alta | 3 | Por crear |
| US-002 | Como equipo de desarrollo, quiero seeders idempotentes de categorías, roles y permisos, para que el registro asigne el rol `member` y existan categorías al publicar. (RF-11, RF-31, RN-02) | Alta | 2 | Por crear |
| US-003 | Como visitante, quiero una interfaz con layout y navegación coherentes según mi sesión, y páginas de error y de recurso no encontrado, para moverme con claridad por la aplicación. (RNF de usabilidad) | Alta | 3 | Por crear |
| US-004 | Como visitante y miembro, quiero registrarme, iniciar sesión y cerrar sesión con redirecciones correctas hacia la ruta raíz o el destino solicitado, para acceder a las funciones de miembro. (HU-01, HU-02, HU-03) | Alta | 3 | Por crear |
| US-005 | Como miembro autenticado, quiero consultar y actualizar mis datos básicos desde un formulario de edición de perfil, para mantener mi información al día. (HU-04) | Alta | 2 | Por crear |
| US-006 | Como miembro autenticado, quiero publicar un plato o una receta con imagen opcional, para compartir lo que cocino. (HU-08, HU-09) | Alta | 5 | Por crear |
| US-007 | Como visitante, quiero ver el feed de publicaciones recientes, para descubrir platos y recetas. (HU-07, versión inicial sin resumen de interacción) | Alta | 3 | Por crear |

**Total de Story Points comprometidos:** 21

## 6. Descomposición de actividades

Describir las actividades técnicas necesarias para implementar los elementos seleccionados.

La asignación de responsables la define el equipo junto con el Scrum Master durante el Sprint.

| ID | Actividad | Responsable | Issue relacionado | Estimación |
|---|---|---|---|---|
| TASK-001 | Instalar el proyecto en una base vacía (dependencias, Docker con PostgreSQL, migraciones) y documentar los pasos y los errores encontrados (US-001) | Por asignar (Developer) | Por crear | 4 h |
| TASK-002 | Elaborar el informe de verificación del repositorio: comparar README, HANDOFF y Documento del proyecto con el código real de `main` (rutas, controladores, vistas, seeders y pruebas) (US-001) | Por asignar (Developer) | Por crear | 4 h |
| TASK-003 | Crear la carpeta `tests/` con una prueba base para que `npm test` funcione, verificar `npm run lint` y documentar `PGADMIN_EMAIL` y `PGADMIN_PASSWORD` en `env/.envExample` (US-001) | Por asignar (Developer) | Por crear | 4 h |
| TASK-004 | Crear el seeder idempotente de las 7 categorías: desayuno, almuerzo, cena, postres, bebidas, comida tradicional y vegetariana (US-002) | Por asignar (Developer) | Por crear | 3 h |
| TASK-005 | Crear el seeder idempotente de roles (`admin`, `moderator`, `member`) y permisos con sus asignaciones (US-002) | Por asignar (Developer) | Por crear | 3 h |
| TASK-006 | Verificar que el registro asigna el rol `member` y que los seeders pueden ejecutarse varias veces sin duplicar datos (US-002) | Por asignar (Developer) | Por crear | 2 h |
| TASK-007 | Crear el layout base en EJS (parciales de encabezado y pie), la navegación para visitante y para miembro, y los estilos en `src/public/styles/style.css` (US-003) | Por asignar (Developer) | Por crear | 6 h |
| TASK-008 | Crear las vistas de error y de recurso no encontrado, y conectarlas a los manejadores de errores existentes (US-003) | Por asignar (Developer) | Por crear | 3 h |
| TASK-009 | Registrar la ruta raíz `/` y validar las redirecciones de inicio y cierre de sesión, incluido el destino `next` seguro (US-004) | Por asignar (Developer) | Por crear | 3 h |
| TASK-010 | Escribir pruebas automatizadas de autenticación: registro válido e inválido, usuario o correo duplicado, inicio de sesión por usuario y por correo, credenciales inválidas y cierre de sesión (US-004) | Por asignar (Developer) | Por crear | 6 h |
| TASK-011 | Crear la vista `editProfile.ejs` con los valores actuales y los mensajes de error (US-005) | Por asignar (Developer) | Por crear | 3 h |
| TASK-012 | Escribir pruebas del perfil: actualizar el propio, rechazar correo de otra cuenta y rechazar el acceso sin sesión (US-005) | Por asignar (Developer) | Por crear | 3 h |
| TASK-013 | Crear el router y el controlador de publicaciones: `GET /publications/new` y `POST /publications` con `publicationSchema` y el middleware de carga de imágenes (US-006) | Por asignar (Developer) | Por crear | 8 h |
| TASK-014 | Crear la vista del formulario de publicación con campos condicionales para recetas y selector de categorías (US-006) | Por asignar (Developer) | Por crear | 5 h |
| TASK-015 | Eliminar los archivos subidos cuando falla el guardado y validar tipo y tamaño de la imagen (US-006) | Por asignar (Developer) | Por crear | 3 h |
| TASK-016 | Escribir pruebas de publicaciones: crear plato, crear receta, rechazar receta sin ingredientes o instrucciones, rechazar categoría inválida y rechazar imagen no permitida (US-006) | Por asignar (Developer) | Por crear | 5 h |
| TASK-017 | Crear el controlador y la consulta del feed `GET /` con autor y categoría, ordenado por fecha descendente (US-007) | Por asignar (Developer) | Por crear | 4 h |
| TASK-018 | Crear la vista del feed con tarjetas (título, imagen o marcador de posición, autor, categoría y tipo) y el estado vacío (US-007) | Por asignar (Developer) | Por crear | 5 h |
| TASK-019 | Escribir pruebas del feed: lista vacía y aparición de una publicación recién creada (US-007) | Por asignar (Developer) | Por crear | 2 h |
| TASK-020 | Actualizar README, `docs/HANDOFF.md` y `docs/Database/DATABASE.md` con el estado real del proyecto al cierre del Sprint | Por asignar (Developer) | Por crear | 3 h |
| TASK-021 | Preparar la demostración del recorrido: registrar usuario, iniciar sesión, crear plato y receta, y ver el feed | Por asignar (Developer) | Por crear | 2 h |

**Total de horas estimadas:** 81 h

## 7. Criterios de aceptación

Establecer las condiciones que deben cumplirse para considerar que los elementos 
seleccionados satisfacen sus requerimientos.

**US-001**

- [ ] El proyecto se instala y se ejecuta desde cero siguiendo únicamente la documentación (`npm install`, `docker compose up -d`, migraciones, seeders y `npm run dev`).
- [ ] `npm run lint` y `npm test` se ejecutan sin errores.
- [ ] Existe un informe de verificación con las diferencias entre la documentación y el código de la rama `main`.

**US-002**

- [ ] Tras ejecutar los seeders existen las 7 categorías y los 3 roles con sus permisos.
- [ ] Ejecutar los seeders de nuevo no duplica datos.
- [ ] Un usuario nuevo recibe el rol `member` al registrarse.

**US-003**

- [ ] Todas las páginas comparten el mismo layout y la navegación cambia según exista o no una sesión iniciada.
- [ ] Una ruta inexistente muestra la página de recurso no encontrado y un error inesperado muestra una página de error controlada.

**US-004**

- [ ] El registro valida los campos, rechaza usuario o correo duplicados y una confirmación de contraseña distinta, y guarda la contraseña con hash.
- [ ] El inicio de sesión funciona con nombre de usuario o correo, y las credenciales inválidas muestran un error genérico.
- [ ] El cierre de sesión elimina la cookie y redirige a una página pública; las rutas protegidas vuelven a exigir inicio de sesión.

**US-005**

- [ ] El formulario carga los datos actuales y permite editar nombre, apellido, correo y biografía (máximo 500 caracteres).
- [ ] Un correo que pertenece a otra cuenta es rechazado y un usuario no puede consultar ni modificar el perfil de otro mediante este flujo.

**US-006**

- [ ] Un miembro autenticado puede crear un plato con título (3 a 150 caracteres), descripción (10 a 2000 caracteres) y categoría.
- [ ] La imagen es opcional y solo se aceptan JPEG, PNG, WEBP y GIF hasta 5 MB.
- [ ] Una receta exige ingredientes e instrucciones (3 a 3000 caracteres cada uno).
- [ ] Datos inválidos, una categoría inexistente o una imagen no permitida impiden la creación, y si falla el guardado se eliminan los archivos subidos.

**US-007**

- [ ] La ruta `/` es pública y lista las publicaciones recientes con título, imagen o marcador, autor, categoría y tipo.
- [ ] Si no hay publicaciones se muestra un mensaje de estado vacío.

**Criterio general del Sprint**

- [ ] El equipo demuestra el recorrido completo: registrar un usuario, iniciar sesión, crear un plato y una receta, y verlos en el feed (pasos 1 a 3 del escenario manual del Documento del proyecto).

## 8. Definición de terminado (Definition of Done)

Establecer las condiciones mínimas que deben cumplir los entregables para considerarse terminados.

- [ ] La funcionalidad cumple los criterios de aceptación.
- [ ] El código cumple los estándares de calidad establecidos.
- [ ] Se realizaron las pruebas correspondientes.
- [ ] `npm run lint` y `npm test` se ejecutan sin errores.
- [ ] La documentación técnica fue actualizada cuando corresponde.
- [ ] Se creó el Pull Request correspondiente.
- [ ] El código fue revisado y aprobado.
- [ ] Los cambios fueron integrados a la rama principal según el flujo de trabajo establecido.

## 9. Plan de trabajo

| Actividad | Fecha de inicio | Fecha estimada de finalización | Responsable |
|---|---|---|---|
| US-001: Verificación y estabilización de la base | 2026-11-02 | 2026-11-04 | Equipo de desarrollo |
| US-002: Seeders de categorías, roles y permisos | 2026-11-03 | 2026-11-05 | Equipo de desarrollo |
| US-003: Layout, navegación y páginas de error | 2026-11-04 | 2026-11-09 | Equipo de desarrollo |
| US-004: Flujo de autenticación y pruebas | 2026-11-05 | 2026-11-10 | Equipo de desarrollo |
| US-006: Publicar plato y receta | 2026-11-06 | 2026-11-12 | Equipo de desarrollo |
| Revisión de avance con el Product Owner | 2026-11-09 | 2026-11-09 | Scrum Master y Product Owner |
| US-005: Edición de perfil | 2026-11-09 | 2026-11-11 | Equipo de desarrollo |
| US-007: Feed público | 2026-11-10 | 2026-11-13 | Equipo de desarrollo |
| Actualización de documentación y preparación de la demostración | 2026-11-13 | 2026-11-15 | Equipo de desarrollo |
| Sprint Review y Retrospectiva | 2026-11-16 | 2026-11-16 | Todo el equipo Scrum |

## 10. Riesgos, dependencias e impedimentos

Registrar situaciones que puedan afectar el desarrollo del Sprint.

| ID | Descripción | Impacto | Acción preventiva o correctiva | Responsable |
|---|---|---|---|---|
| RISK-001 | La documentación (README, HANDOFF y Documento del proyecto) describe como implementados las publicaciones, las interacciones, el perfil público, las pruebas y los seeders, pero la rama `main` solo contiene autenticación, el controlador de edición de perfil (sin vista), los modelos y las migraciones. | Alto | Elaborar el informe de verificación (TASK-002) y planificar con base en el código real, no en la documentación. | Scrum Master |
| RISK-002 | No existen seeders: sin el rol `member` el registro crea usuarios sin rol y sin categorías no se puede publicar. | Alto | Resolver US-002 al inicio del Sprint, antes de US-006. | Equipo de desarrollo |
| RISK-003 | El script `npm test` apunta a una carpeta `tests/` que no existe y no hay pruebas base. | Medio | Crear la estructura y la prueba base en TASK-003. | Equipo de desarrollo |
| RISK-004 | Desvío del alcance hacia las tablas de extensión (administración, favoritos, notificaciones, reportes, documentos y ubicaciones) sin que estén aprobadas. | Medio | Implementar solo lo seleccionado en este Sprint; todo cambio de alcance se consulta con el Product Owner. | Product Owner |
| RISK-005 | Los formularios con autenticación por cookie no tienen protección CSRF. | Medio | Incorporar la protección en el Sprint 2 junto con el control de acceso y propiedad (HU-06); no desplegar en producción antes. | Scrum Master |
| RISK-006 | Curva de aprendizaje del stack (Express 5, EJS, Sequelize, Multer) y del entorno con Docker. | Medio | Trabajo en parejas en US-001 y US-006, y consultas oportunas al Product Owner. | Scrum Master |
| RISK-007 | La regla sobre si un autor puede dar me gusta, valorar o comentar su propia publicación (DP-09) no está definida. | Bajo | El Product Owner la define antes del Sprint 3. | Product Owner |
| DEP-001 | US-006 depende de US-002 (categorías) y de US-003 (layout). | Alto | Priorizar US-002 y US-003 en la primera semana. | Scrum Master |
| DEP-002 | US-007 depende de US-006 para mostrar publicaciones reales. | Medio | Coordinar a los desarrolladores para que el feed se pruebe con publicaciones creadas por el flujo real. | Equipo de desarrollo |

## 11. Acuerdos y compromisos

Registrar las decisiones tomadas durante la reunión y los compromisos establecidos por los participantes.

| ID | Acuerdo o compromiso | Responsable | Fecha límite |
|---|---|---|---|
| AC-001 | Trabajar con una rama por historia (`feature/US-00X-nombre`) creada desde `main`, con Pull Request y revisión de al menos otro integrante antes de integrar. | Felipe Nuñez Navarro | 2026-11-03 |
| AC-002 | Crear en el GitHub Project los issues de las historias y tareas de este Sprint, con su ID y sus Story Points. | Felipe Nuñez Navarro | 2026-11-03 |
| AC-003 | Entregar el informe de verificación del repositorio con las diferencias entre la documentación y `main`. | Equipo de desarrollo | 2026-11-04 |
| AC-004 | Mantener fuera de este Sprint las funcionalidades de extensión y confirmar por defecto las decisiones pendientes DP-01 a DP-08 del Documento del proyecto. | Cristian Camilo Cortes Ortiz | 2026-11-02 |
| AC-005 | Mantener actualizado el estado de los issues en el GitHub Project para que el Product Owner consulte el avance. | Equipo de desarrollo | Durante el Sprint |
| AC-006 | Realizar una revisión de avance con el Product Owner a mitad del Sprint. | Felipe Nuñez Navarro | 2026-11-09 |

## 12. Evidencias y referencias

- Repositorio del proyecto: https://github.com/Cristianco9/vive-zarzal-app
- GitHub Project: https://github.com/users/FelOnCrackZ/projects/2
- Product Backlog: GitHub Project del equipo (https://github.com/users/FelOnCrackZ/projects/2)
- Issues seleccionados: pendientes de crear (US-001 a US-007 y TASK-001 a TASK-021)
- Documentación relacionada: `docs/project/Vive Zarzal - Documento del proyecto.pdf`, `docs/HANDOFF.md`, `docs/Database/DATABASE.md`, `README.md` y los diagramas de la carpeta `docs/`
- Grabación de la reunión (si aplica): No aplica

## 13. Observaciones

**Estado del repositorio al iniciar el Sprint (rama `main`, un único commit)**

- Existe: registro, inicio y cierre de sesión con JWT en cookie, middleware de autenticación, controlador de edición de perfil, esquemas de validación con Joi, middleware de carga de imágenes, 21 modelos Sequelize, 13 migraciones, Docker Compose y diagramas de la carpeta `docs/`.
- No existe: controladores y rutas de publicaciones, categorías, me gusta, valoraciones, comentarios y perfil público; ruta raíz `/`; vistas distintas de `login.ejs` y `register.ejs` (falta, por ejemplo, `editProfile.ejs`); carpeta `tests/`; carpeta `src/db/seeders/`.
- El README y `docs/HANDOFF.md` mencionan la rama `refactor/food-community-forum`, pero el remoto solo tiene `main`. El propio Documento del proyecto (sección 11.3) reconoce estas diferencias y recomienda reconciliarlas antes de planificar.

**Hoja de ruta propuesta (referencial; cada Sprint se formaliza en su propia acta)**

| Sprint | Fechas | Enfoque | Historias de usuario del Documento del proyecto |
|---|---|---|---|
| Sprint 1 | 2026-11-02 al 2026-11-16 | Base estable, autenticación, perfil, publicar y feed | HU-01 a HU-04, HU-07 (inicial), HU-08, HU-09 |
| Sprint 2 | 2026-11-23 al 2026-11-30 | Exploración, detalle y propiedad de recursos | HU-05, HU-06 (incluye CSRF), HU-10, HU-11, HU-12 |
| Sprint 3 | 2026-12-07 al 2026-12-14 | Interacción comunitaria | HU-14, HU-15, HU-16, HU-17 y resumen de interacción del feed (cierra HU-07) |
| Sprint 4 | 2026-12-21 al 2026-12-28 | Cierre, calidad y entrega | HU-13 (búsqueda y paginación), cobertura de pruebas, escenario manual completo, documentación final y lista de problemas conocidos |

Las historias de fase futura (HU-18 a HU-23) quedan fuera de la hoja de ruta salvo aprobación expresa del Product Owner.

## 14. Aprobación y validación

Los participantes dejan constancia de que revisaron el objetivo del Sprint, los elementos seleccionados y el plan de trabajo establecido.

| Participante | Rol | Usuario de GitHub | Fecha de aprobación |
|---|---|---|---|
| Cristian Camilo Cortes Ortiz | Product Owner | @Cristianco9 | YYYY-MM-DD |
| Felipe Nuñez Navarro | Scrum Master | @FelOnCrackZ | YYYY-MM-DD |
| Jorge Humberto Leyes Rojas | Developer | [Por confirmar] | YYYY-MM-DD |
| Manuel Alejandro Mera Ruiz | Developer | [Por confirmar] | YYYY-MM-DD |
| Jesus Gabriel Ortiz Saac | Developer | [Por confirmar] | YYYY-MM-DD |

### Estado del acta

- [ ] Objetivo del Sprint definido.
- [ ] Elementos del Product Backlog seleccionados.
- [ ] Criterios de aceptación revisados.
- [ ] Plan de trabajo establecido.
- [ ] Compromisos registrados.
- [ ] Acta revisada por los participantes.

**Evidencia de aprobación:** [URL del Pull Request o discusión correspondiente]

---

**Fin del documento**

*Este documento constituye el registro formal de la planificación del Sprint. 
Cualquier modificación significativa del alcance, los acuerdos o los elementos 
seleccionados deberá quedar documentada y contar con la correspondiente trazabilidad.*
