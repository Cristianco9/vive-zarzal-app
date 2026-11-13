# Acta de Aceptación y Cierre del Proyecto

## 1. Información general

| Campo | Información |
|---|---|
| Código del documento | ACT-PA-001 |
| Nombre del proyecto | Vive Zarzal App |
| Fecha de evaluación | 2026-12-28 (prevista) |
| Fecha de cierre | 2026-12-28 (prevista) |
| Project Owner | Cristian Camilo Cortes Ortiz (2478542) |
| Scrum Master | Felipe Nuñez Navarro (2460817) |
| Equipo de desarrollo | Jorge Humberto Leyes Rojas (2460809), Manuel Alejandro Mera Ruiz (2460971) y Jesus Gabriel Ortiz Saac (2369566) |
| Repositorio | `https://github.com/Cristianco9/vive-zarzal-app` |
| GitHub Project | `https://github.com/users/FelOnCrackZ/projects/2` |
| Versión entregada | v1.0.0 (prevista) |

## 2. Objetivo del documento

Registrar la evaluación final de los entregables del proyecto, verificar el 
cumplimiento de los requerimientos establecidos y documentar la aceptación formal 
de la solución desarrollada por parte del Product Owner.

Esta acta se prepara al inicio del proyecto con los criterios de aceptación 
acordados con el equipo. Las columnas de estado, resultado y evidencia se completan 
en la evaluación final; hasta entonces permanecen como «Pendiente» o «Por registrar».

## 3. Descripción general del proyecto

**Nombre del proyecto:**

Vive Zarzal App.

**Descripción:**

Vive Zarzal App es una aplicación web que funciona como foro comunitario gastronómico. 
Las personas registradas publican platos y recetas, descubren las publicaciones de 
otras personas por categorías y participan mediante me gusta, valoraciones de 1 a 5 
y comentarios. La plataforma no es una tienda: no vende productos ni procesa pagos.

La solución es una aplicación renderizada en el servidor con Node.js, Express 5, 
EJS, Sequelize 6 y PostgreSQL, con autenticación mediante JWT en cookie, validación 
con Joi y carga de imágenes con Multer.

**Objetivo general:**

Desarrollar una aplicación web de foro comunitario en la que los usuarios registrados 
publiquen platos y recetas, exploren contenido por categorías e interactúen mediante 
me gusta, valoraciones y comentarios, con control de acceso y validaciones en el servidor.

## 4. Alcance del proyecto

Describir las funcionalidades y componentes que fueron incluidos dentro del alcance aprobado.

- Registro, inicio y cierre de sesión, y perfil propio y público.
- Publicaciones de tipo plato y receta con imagen opcional, y edición y eliminación por su autor.
- Feed de publicaciones recientes, detalle de publicación y exploración por categoría.
- Me gusta, valoraciones de 1 a 5 con promedio, y comentarios con edición y eliminación por su autor.
- Validación de entradas en el servidor, manejo centralizado de errores y protección CSRF.
- Pruebas automatizadas de los flujos principales, documentación actualizada y entorno reproducible con Docker.

**Limitaciones conocidas:**

Las siguientes funcionalidades están fuera del alcance acordado y no se consideran 
parte de la entrega, salvo aprobación expresa del Product Owner: administración 
de roles y permisos desde la interfaz, favoritos, notificaciones, reportes y moderación, 
documentos de identidad, ubicaciones y direcciones, recuperación de contraseña, 
verificación de correo, almacenamiento externo de imágenes y pruebas de extremo 
a extremo en navegador.

Limitaciones técnicas previstas: las imágenes se guardan en disco local y la alerta 
de `npm audit` por la dependencia `uuid` de Sequelize 6 requeriría una actualización 
mayor del ORM. La búsqueda y la paginación del feed son una meta opcional. Esta 
sección se actualiza en la evaluación final con las limitaciones reales.

## 5. Evaluación de requerimientos

Verificar el cumplimiento de los requerimientos definidos y aprobados durante la 
etapa inicial del proyecto.

**Criterio mínimo de aceptación:** el proyecto puede aceptarse cuando todos los 
requerimientos marcados como Obligatorio están cumplidos y el equipo ejecuta sin 
fallos, ante el Product Owner, el escenario manual de nueve pasos: registrar un 
usuario e iniciar sesión; crear un plato y una receta; recorrer el feed y una 
categoría; abrir una receta y revisar sus ingredientes e instrucciones; dar me gusta, 
valorar y comentar; editar y eliminar un comentario propio; editar y eliminar una 
publicación propia; abrir un perfil público y editar el propio; y cerrar sesión 
comprobando que las acciones restringidas exigen autenticación.

**Criterio de carga:** el alcance obligatorio se dimensionó para unos 10 Story 
Points por semana de sprint, equivalentes a unas 13 horas semanales por desarrollador. 
Los requerimientos Deseables no condicionan la aceptación.

| ID | Requerimiento | Estado | Evidencia |
|---|---|---|---|
| REQ-F-001 | Registro, inicio y cierre de sesión con contraseñas cifradas y sesión por cookie (HU-01 a HU-03). Obligatorio. Sprint 1. | Pendiente | Por registrar |
| REQ-F-002 | Edición del perfil propio (HU-04) y perfil público con las publicaciones del usuario (HU-05). Obligatorio. Sprints 1 y 2. | Pendiente | Por registrar |
| REQ-F-003 | Publicar plato y receta con imagen opcional (HU-08, HU-09). Obligatorio. Sprint 1. | Pendiente | Por registrar |
| REQ-F-004 | Feed de publicaciones recientes, detalle y exploración por categoría (HU-07, HU-10, HU-12). Obligatorio. Sprints 1, 2 y 4. | Pendiente | Por registrar |
| REQ-F-005 | Editar y eliminar solo las publicaciones propias (HU-11). Obligatorio. Sprint 2. | Pendiente | Por registrar |
| REQ-F-006 | Me gusta y valoración de 1 a 5 con promedio (HU-14, HU-15). Obligatorio. Sprint 3. | Pendiente | Por registrar |
| REQ-F-007 | Comentarios: crear, leer, editar y eliminar los propios (HU-16, HU-17). Obligatorio. Sprint 3. | Pendiente | Por registrar |
| REQ-F-008 | Seeders idempotentes de categorías, roles y permisos (RF-11, RF-31). Obligatorio. Sprint 1. | Pendiente | Por registrar |
| REQ-F-009 | Búsqueda de publicaciones y paginación (HU-13). Deseable: solo si el equipo termina antes el compromiso del Sprint 4. | Pendiente | Por registrar |
| REQ-NF-001 | Protección CSRF en los formularios que modifican datos. Obligatorio. Sprint 4. | Pendiente | Por registrar |
| REQ-NF-002 | Pruebas automatizadas de los flujos principales. Obligatorio. Sprints 1 a 4. | Pendiente | Por registrar |
| REQ-NF-003 | Validación de entradas con Joi, manejo centralizado de errores e interfaz adaptable a escritorio y móvil. Obligatorio. Sprints 1 a 4. | Pendiente | Por registrar |
| REQ-NF-004 | Entorno reproducible y documentación actualizada (README, `docs/HANDOFF.md` y `docs/Database/DATABASE.md`). Obligatorio. Sprints 1 y 4. | Pendiente | Por registrar |

## 6. Entregables finales

Registrar los productos, componentes y documentos entregados como resultado del desarrollo.

| ID | Entregable | Descripción | Evidencia |
|---|---|---|---|
| DEL-001 | Código fuente | Código fuente del sistema en la rama `main` del repositorio, con la etiqueta v1.0.0 | https://github.com/Cristianco9/vive-zarzal-app |
| DEL-002 | Documentación técnica | README, `docs/HANDOFF.md` y `docs/Database/DATABASE.md` actualizados al estado real, y el informe de verificación del repositorio del Sprint 1 | Por registrar |
| DEL-003 | Pruebas | Resultado de `npm test` y `npm run lint` sin errores, registrado en el Pull Request final | Por registrar |
| DEL-004 | Aplicación funcional | Versión v1.0.0 del sistema, demostrada con el escenario manual de nueve pasos en la Sprint Review del Sprint 4 | Por registrar |
| DEL-005 | Actas del proyecto | Actas de reunión, de planificación de cada sprint y de aceptación y cierre | Por registrar |

## 7. Evaluación de calidad y validación

Registrar las verificaciones realizadas antes de aceptar el proyecto.

Cada fila indica el criterio de aprobación acordado; el resultado y las 
observaciones se registran en la evaluación final.

| Aspecto evaluado | Resultado | Observaciones |
|---|---|---|
| Cumplimiento de requerimientos | Pendiente | Criterio de aprobación: todos los requerimientos obligatorios (REQ-F-001 a REQ-F-008 y REQ-NF-001 a REQ-NF-004) en estado Cumplido. Los deseables pueden quedar Parcial o No cumplido. |
| Funcionamiento de las funcionalidades principales | Pendiente | Criterio de aprobación: el escenario manual de nueve pasos se ejecuta sin fallos, ante el Product Owner, sobre una instalación limpia. |
| Pruebas funcionales | Pendiente | Criterio de aprobación: `npm test` pasa sin fallos y existe al menos una prueba de caso exitoso y una de caso de error por cada módulo: autenticación, perfil, publicaciones y categorías, me gusta y valoraciones, y comentarios. |
| Calidad del código | Pendiente | Criterio de aprobación: `npm run lint` sin errores; sin secretos ni archivo `.env` versionados; una rama por historia con Pull Request revisado por otro integrante; validación con Joi en cada entrada; verificación de propiedad en el servidor. |
| Documentación técnica | Pendiente | Criterio de aprobación: README y HANDOFF reflejan el estado real, `DATABASE.md` está al día si cambió el esquema, y otra persona logra instalar el proyecto desde cero siguiendo el README. |
| Integración de los componentes | Pendiente | Criterio de aprobación: la aplicación arranca desde una base vacía con Docker, migraciones y seeders, y los flujos funcionan de punta a punta sobre la rama `main` sin conflictos pendientes. |

## 8. Historial de entregas

Registrar los principales entregables y versiones generadas durante el desarrollo.

Las fechas corresponden al cierre previsto de cada sprint; se confirman con la 
fecha real al publicar cada versión.

| Versión | Descripción | Fecha | Referencia |
|---|---|---|---|
| v0.1.0 | Base estable, seeders, autenticación, edición de perfil, publicar plato y receta, y feed público (Sprint 1) | 2026-11-16 | Por registrar |
| v0.2.0 | Detalle de publicación, exploración por categoría, perfil público, y edición y eliminación de publicaciones propias (Sprint 2) | 2026-11-30 | Por registrar |
| v0.3.0 | Me gusta, valoraciones con promedio y comentarios (Sprint 3) | 2026-12-14 | Por registrar |
| v1.0.0 | Resumen de interacción en el feed, protección CSRF, pruebas y documentación finales (Sprint 4) | 2026-12-28 | Por registrar |

## 9. Requerimientos pendientes y limitaciones

Registrar los elementos que no fueron completados o que requieren trabajo adicional.

La siguiente lista contiene los elementos que se prevé que queden fuera de la entrega. 
Se actualiza en la evaluación final con los pendientes reales.

| ID | Descripción | Justificación | Estado |
|---|---|---|---|
| PEND-001 | Búsqueda de publicaciones y paginación (HU-13). | Meta opcional: se desarrolla solo si el equipo termina antes el compromiso del Sprint 4. | Opcional |
| PEND-002 | Favoritos, notificaciones, reportes, moderación, administración, documentos y ubicaciones (HU-18 a HU-23). | Fase futura, fuera del alcance acordado salvo aprobación expresa. | Pendiente |
| PEND-003 | Recuperación de contraseña y verificación de correo (RF-12). | Fuera del alcance acordado. | Pendiente |
| PEND-004 | Almacenamiento externo de imágenes y pruebas de extremo a extremo en navegador. | Mejoras operativas fuera del alcance académico del curso. | Pendiente |
| PEND-005 | Actualización mayor de Sequelize por la alerta de `uuid` en `npm audit`. | Requiere un cambio de versión mayor del ORM; se documenta como problema conocido. | Pendiente |

Estos elementos deberán ser identificados y documentados para evitar que se 
interpreten como funcionalidades entregadas y aceptadas.

## 10. Observaciones del Product Owner

**Aspectos satisfactorios:**

[Se completa en la evaluación final.]

**Observaciones generales:**

[Se completa en la evaluación final.]

**Recomendaciones futuras:**

[Se completa en la evaluación final.]

## 11. Declaración de aceptación

Mediante esta acta se deja constancia de que el Product Owner ha revisado los 
entregables presentados, evaluado el cumplimiento de los requerimientos establecidos 
y registrado las observaciones correspondientes.

**Estado de aceptación:**

- [ ] Proyecto aceptado.
- [ ] Proyecto aceptado con observaciones menores.
- [ ] Proyecto no aceptado; requiere correcciones.

**Criterio de decisión acordado:**

- Aceptado: todos los requerimientos obligatorios están cumplidos y todos los aspectos de la sección 7 están aprobados.
- Aceptado con observaciones menores: el escenario manual se ejecuta sin fallos y los requerimientos obligatorios están cumplidos, pero quedan observaciones que no lo impiden (por ejemplo, documentación parcial o un requerimiento obligatorio secundario en estado Parcial con justificación).
- No aceptado: el escenario manual falla o no se cumple alguno de los requerimientos obligatorios principales (REQ-F-001 a REQ-F-007).

**Justificación de la decisión:**

[Se completa en la evaluación final.]

## 12. Acuerdos de cierre

| ID | Acuerdo | Responsable | Fecha límite |
|---|---|---|---|
| AC-001 | Congelar el código el 2026-12-26: del 26 al 28 de diciembre solo se corrigen errores y se prepara la demostración. | Felipe Nuñez Navarro | 2026-12-26 |
| AC-002 | Realizar la demostración del escenario manual ante el Product Owner en la Sprint Review del Sprint 4 y registrar la decisión de aceptación. | Cristian Camilo Cortes Ortiz | 2026-12-28 |
| AC-003 | Publicar el release v1.0.0 en GitHub con los entregables finales. | Felipe Nuñez Navarro | 2026-12-28 |
| AC-004 | Registrar como issues los pendientes y las mejoras futuras (PEND-001 a PEND-005) para que no se interpreten como funcionalidades entregadas. | Felipe Nuñez Navarro | 2026-12-28 |

## 13. Evidencias y referencias

- Repositorio: https://github.com/Cristianco9/vive-zarzal-app.
- GitHub Project: https://github.com/users/FelOnCrackZ/projects/2.
- Documentación final: `README.md`, `docs/HANDOFF.md` y `docs/Database/DATABASE.md` (URL por registrar).
- Release final: Por registrar (v1.0.0).
- Pull Requests principales: Por registrar.
- Evidencias de pruebas: Por registrar (resultado de `npm test` y `npm run lint`).
- Actas de revisiones anteriores: ACT-MIN-001 (reunión de requerimientos), ACT-SP-001 (planificación del Sprint 1) y las actas de planificación de los Sprints 2 a 4 cuando existan.

## 14. Aprobación y cierre

Los participantes dejan constancia de que participaron en el proceso de revisión final y reconocen el estado de los entregables documentados en esta acta.

| Participante | Rol | Usuario de GitHub | Fecha |
|---|---|---|---|
| Cristian Camilo Cortes Ortiz | Project Owner | @Cristianco9 | YYYY-MM-DD |
| Felipe Nuñez Navarro | Scrum Master | @FelOnCrackZ | YYYY-MM-DD |
| Jorge Humberto Leyes Rojas | Developer | [Por confirmar] | YYYY-MM-DD |
| Manuel Alejandro Mera Ruiz | Developer | [Por confirmar] | YYYY-MM-DD |
| Jesus Gabriel Ortiz Saac | Developer | [Por confirmar] | YYYY-MM-DD |

### Estado final del proyecto

- [ ] Requerimientos evaluados.
- [ ] Entregables revisados.
- [ ] Pruebas verificadas.
- [ ] Documentación final entregada.
- [ ] Pendientes identificados.
- [ ] Decisión de aceptación registrada.
- [ ] Acta de cierre aprobada.

**Evidencia de aprobación:** [URL del Pull Request o discusión correspondiente]

---

**Fin del documento**

*Esta acta constituye el registro documental de la evaluación final y aceptación 
del proyecto. La aceptación debe corresponder a los entregables realmente verificados 
y no implica que las funcionalidades pendientes se consideren completadas.*
