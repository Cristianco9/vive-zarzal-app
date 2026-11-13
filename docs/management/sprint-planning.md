# Acta de Planificación del Sprint

## 1. Información general

| Campo | Información |
|---|---|
| Código del documento | ACT-SP-002 |
| Proyecto | Vive Zarzal App |
| Sprint | Sprint 2 |
| Fecha | 2026-11-23 (prevista) |
| Hora de inicio | Por definir (HH:MM) |
| Hora de finalización | Por definir (HH:MM) |
| Duración del Sprint | 8 días (2026-11-23 al 2026-11-30) |
| Scrum Master | Felipe Nuñez Navarro (2460817) |
| Product Owner | Cristian Camilo Cortes Ortiz |
| Repositorio | `https://github.com/Cristianco9/vive-zarzal-app` |
| GitHub Project | `https://github.com/users/FelOnCrackZ/projects/2` |

## 2. Objetivo de la reunión

Definir el objetivo del Sprint, seleccionar los elementos del Product Backlog que 
serán abordados y establecer el plan de trabajo necesario para alcanzar los resultados esperados.

## 3. Participantes

| Nombre completo | Rol | Asistencia |
|---|---|---|
| Cristian Camilo Cortes Ortiz | Product Owner | Por confirmar (Presente / Ausente) |
| Felipe Nuñez Navarro (2460817) | Scrum Master | Por confirmar (Presente / Ausente) |
| Jorge Humberto Leyes Rojas (2460809) | Developer | Por confirmar (Presente / Ausente) |
| Manuel Alejandro Mera Ruiz (2460971) | Developer | Por confirmar (Presente / Ausente) |
| Jesus Gabriel Ortiz Saac (2369566) | Developer | Por confirmar (Presente / Ausente) |

## 4. Objetivo del Sprint (Sprint Goal)

**Objetivo:**

Permitir que cualquier visitante explore el contenido del foro (detalle de cada 
publicación, publicaciones por categoría y perfiles públicos) y que cada autor 
pueda editar y eliminar sus propias publicaciones, completando así el recorrido 
de publicaciones del escenario manual del proyecto.

## 5. Elementos seleccionados del Product Backlog

Las referencias HU corresponden al documento `docs/project/Vive Zarzal - Documento del proyecto.pdf`. Las historias continúan la numeración del Sprint 1 (ACT-SP-001).

| ID | Historia de usuario / Requerimiento | Prioridad | Story Points | Issue |
|---|---|---|---|---|
| US-008 | Como visitante, quiero abrir una publicación para leer su contenido completo, incluidos ingredientes e instrucciones cuando es una receta. (HU-10; la valoración, los me gusta y los comentarios se integran en el Sprint 3) | Alta | 3 | Por crear |
| US-009 | Como visitante, quiero filtrar las publicaciones por categoría, para encontrar contenido relevante. (HU-12) | Alta | 2 | Por crear |
| US-010 | Como visitante, quiero ver el perfil público de un miembro con sus publicaciones, para descubrir lo que comparte. (HU-05) | Media | 2 | Por crear |
| US-011 | Como autor, quiero editar o eliminar mis publicaciones, y que otros miembros no puedan hacerlo, para mantener mi contenido. (HU-11) | Alta | 3 | Por crear |

**Total de Story Points seleccionados:** 10

## 6. Descomposición de actividades

La asignación de responsables la define el equipo junto con el Scrum Master durante el Sprint.

| ID | Actividad | Responsable | Issue relacionado | Estimación |
|---|---|---|---|---|
| TASK-022 | Crear la ruta y el controlador `GET /publications/:id` con autor y categoría, y respuesta de no encontrado si la publicación no existe (US-008) | Por asignar (Developer) | Por crear | 3 h |
| TASK-023 | Crear la vista de detalle: datos, imagen o marcador de posición, ingredientes e instrucciones solo en recetas, y botones de editar y eliminar visibles solo para el autor (US-008) | Por asignar (Developer) | Por crear | 4 h |
| TASK-024 | Enlazar las tarjetas del feed con la página de detalle (US-008) | Por asignar (Developer) | Por crear | 1 h |
| TASK-025 | Escribir pruebas del detalle: plato, receta, publicación inexistente y botones visibles solo para el autor (US-008) | Por asignar (Developer) | Por crear | 2 h |
| TASK-026 | Crear la ruta y el controlador `GET /categories/:slug` reutilizando la consulta del feed, con respuesta de no encontrado para un identificador desconocido (US-009) | Por asignar (Developer) | Por crear | 3 h |
| TASK-027 | Crear la vista de categoría con su título y estado vacío, y agregar las categorías a la navegación (US-009) | Por asignar (Developer) | Por crear | 3 h |
| TASK-028 | Escribir pruebas de categorías: solo aparecen publicaciones de la categoría, identificador desconocido y categoría sin publicaciones (US-009) | Por asignar (Developer) | Por crear | 2 h |
| TASK-029 | Crear la ruta y el controlador `GET /users/:id` con los datos públicos y las publicaciones del usuario, sin exponer correo ni contraseña (US-010) | Por asignar (Developer) | Por crear | 3 h |
| TASK-030 | Crear la vista de perfil público con nombre, nombre de usuario, biografía, roles, lista de publicaciones, mensaje de éxito tras actualizar el perfil y enlace de edición solo para el propio usuario (US-010) | Por asignar (Developer) | Por crear | 3 h |
| TASK-031 | Escribir pruebas del perfil público: usuario existente, usuario inexistente y datos privados no expuestos (US-010) | Por asignar (Developer) | Por crear | 2 h |
| TASK-032 | Crear una verificación de propiedad reutilizable (función o middleware) que permita continuar solo al autor y responda con acceso denegado a los demás (US-011) | Por asignar (Developer) | Por crear | 3 h |
| TASK-033 | Crear `GET` y `POST /publications/:id/edit`: formulario precargado, validación con `publicationSchema` y reemplazo opcional de la imagen (US-011) | Por asignar (Developer) | Por crear | 5 h |
| TASK-034 | Crear `POST /publications/:id/delete` que elimine la publicación y su archivo de imagen (US-011) | Por asignar (Developer) | Por crear | 2 h |
| TASK-035 | Escribir pruebas de gestión: editar y eliminar la propia, rechazar las ajenas, solicitud sin sesión y validación inválida que no pierde el registro (US-011) | Por asignar (Developer) | Por crear | 3 h |
| TASK-036 | Actualizar README y `docs/HANDOFF.md` con las rutas nuevas y el estado real del proyecto | Por asignar (Developer) | Por crear | 2 h |
| TASK-037 | Preparar la demostración: abrir una receta desde el feed, recorrer una categoría, abrir un perfil público, y editar y eliminar una publicación propia | Por asignar (Developer) | Por crear | 1 h |

**Total de horas estimadas:** 42 h

## 7. Criterios de aceptación

**US-008**

- [ ] `GET /publications/:id` es público y muestra título, descripción, autor, categoría e imagen o marcador de posición.
- [ ] Los ingredientes y las instrucciones se muestran solo en las recetas.
- [ ] Una publicación inexistente muestra la página de recurso no encontrado.
- [ ] Los botones de editar y eliminar aparecen solo para el autor.
- [ ] Las tarjetas del feed llevan al detalle de la publicación.

**US-009**

- [ ] `GET /categories/:slug` muestra solo las publicaciones de esa categoría.
- [ ] Un identificador de categoría desconocido muestra la página de recurso no encontrado, y una categoría sin publicaciones muestra el estado vacío.
- [ ] Las categorías se pueden elegir desde la navegación.

**US-010**

- [ ] `GET /users/:id` es público y muestra nombre, nombre de usuario, biografía y roles, sin exponer el correo ni la contraseña.
- [ ] La página lista las publicaciones del usuario, y un usuario inexistente muestra la página de recurso no encontrado.
- [ ] Tras actualizar el perfil propio, el mensaje de éxito se muestra en esta página.

**US-011**

- [ ] El autor edita su publicación desde un formulario precargado con validación; si la validación falla, el registro existente no se pierde.
- [ ] El autor elimina su publicación y su imagen asociada, y los registros dependientes se eliminan según las restricciones de la base de datos.
- [ ] Otro miembro recibe una respuesta de acceso denegado al intentar editar o eliminar, incluso con una solicitud directa, y quien no ha iniciado sesión es redirigido al inicio de sesión.

**Criterio general del Sprint**

- [ ] El equipo demuestra el recorrido: abrir una receta desde el feed, recorrer una categoría, abrir un perfil público, y editar y eliminar una publicación propia (pasos 3, 4, 7 y 8 del escenario manual del Documento del proyecto).

## 8. Definición de terminado (Definition of Done)

- [ ] La funcionalidad cumple los criterios de aceptación.
- [ ] El código cumple los estándares establecidos.
- [ ] Se realizaron las pruebas correspondientes.
- [ ] `npm run lint` y `npm test` se ejecutan sin errores.
- [ ] La documentación fue actualizada cuando corresponde.
- [ ] Se creó el Pull Request correspondiente.
- [ ] El código fue revisado y aprobado.
- [ ] Los cambios fueron integrados según el flujo de trabajo establecido.

## 9. Plan de trabajo

| Actividad | Fecha de inicio | Fecha estimada de finalización | Responsable |
|---|---|---|---|
| Cierre de pendientes del Sprint 1 (si los hay) | 2026-11-23 | 2026-11-24 | Equipo de desarrollo |
| US-008: Detalle de publicación | 2026-11-23 | 2026-11-25 | Equipo de desarrollo |
| US-009: Exploración por categoría | 2026-11-24 | 2026-11-26 | Equipo de desarrollo |
| US-010: Perfil público | 2026-11-24 | 2026-11-26 | Equipo de desarrollo |
| US-011: Gestión de mis publicaciones | 2026-11-25 | 2026-11-27 | Equipo de desarrollo |
| Revisión de avance con el Product Owner | 2026-11-26 | 2026-11-26 | Scrum Master y Product Owner |
| Documentación y preparación de la demostración | 2026-11-27 | 2026-11-29 | Equipo de desarrollo |
| Sprint Review y Retrospectiva | 2026-11-30 | 2026-11-30 | Todo el equipo Scrum |

## 10. Riesgos, dependencias e impedimentos

| ID | Descripción | Impacto | Acción preventiva o correctiva | Responsable |
|---|---|---|---|---|
| RISK-001 | Pendientes del Sprint 1 sin cerrar reducen la capacidad de este Sprint. | Alto | Revisarlos al iniciar y cerrarlos primero; si ocupan más de un día de trabajo del equipo, el Product Owner decide mover US-010 al Sprint 3. | Felipe Nuñez Navarro |
| RISK-002 | El Sprint dura 8 días, con un fin de semana en medio, por lo que la capacidad real es de una semana de trabajo. | Medio | Orden de prioridad ante falta de capacidad: US-008, US-009 y US-011 primero; US-010 es la primera en moverse. | Felipe Nuñez Navarro |
| RISK-003 | Una verificación de propiedad mal implementada permitiría editar o eliminar publicaciones ajenas. | Alto | Implementarla una sola vez de forma reutilizable, revisarla en el Pull Request por otro integrante y probarla con un segundo usuario. | Equipo de desarrollo |
| RISK-004 | Al editar o eliminar, pueden quedar archivos de imagen huérfanos en `src/public/uploads/`. | Bajo | Eliminar el archivo anterior al reemplazar o borrar, y cubrirlo con una prueba. | Equipo de desarrollo |
| DEP-001 | US-008 y US-011 dependen de que la creación de publicaciones (US-006) y el feed (US-007) del Sprint 1 funcionen. | Alto | Confirmar su estado en la Sprint Review del Sprint 1. | Felipe Nuñez Navarro |
| DEP-002 | US-009 depende del seeder de categorías (US-002) y de la consulta del feed (US-007) del Sprint 1. | Medio | Reutilizar la consulta del feed y verificar que las 7 categorías existen tras ejecutar los seeders. | Equipo de desarrollo |

## 11. Acuerdos y compromisos

| ID | Acuerdo o compromiso | Responsable | Fecha límite |
|---|---|---|---|
| AC-001 | Revisar el resultado del Sprint 1 al inicio de este Sprint y priorizar el cierre de sus pendientes. | Felipe Nuñez Navarro | 2026-11-23 |
| AC-002 | Crear en el GitHub Project los issues de las historias y tareas del Sprint 2, con su ID y sus Story Points. | Felipe Nuñez Navarro | 2026-11-23 |
| AC-003 | Implementar la verificación de propiedad de forma reutilizable para aplicarla también a los comentarios en el Sprint 3. | Equipo de desarrollo | 2026-11-27 |
| AC-004 | Realizar una revisión de avance con el Product Owner a mitad del Sprint. | Felipe Nuñez Navarro | 2026-11-26 |

## 12. Evidencias y referencias

- Repositorio: https://github.com/Cristianco9/vive-zarzal-app
- GitHub Project: https://github.com/users/FelOnCrackZ/projects/2
- Product Backlog: GitHub Project del equipo (https://github.com/users/FelOnCrackZ/projects/2)
- Issues seleccionados: pendientes de crear (US-008 a US-011 y TASK-022 a TASK-037)
- Documentación relacionada: `docs/project/Vive Zarzal - Documento del proyecto.pdf` (HU-05, HU-10, HU-11 y HU-12), ACT-MIN-001, ACT-SP-001 y ACT-PA-001

## 13. Observaciones

- Este Sprint se dimensiona para unos 10 Story Points, equivalentes a unas 14 horas por desarrollador durante la semana de trabajo.
- El detalle de la publicación muestra por ahora solo su contenido. Los me gusta, la valoración promedio y los comentarios se integran en el Sprint 3 (HU-14 a HU-17), y el resumen de interacción en el feed y la protección CSRF, en el Sprint 4.
- La búsqueda y la paginación (HU-13) no forman parte de este Sprint y son una meta opcional del Sprint 4.
- Los campos marcados como «Por definir» o «Por confirmar» (hora, asistencia, responsables de las tareas e issues) se completan con la información real de la reunión antes de la aprobación del acta.

## 14. Aprobación y validación

| Participante | Rol | Usuario de GitHub | Fecha |
|---|---|---|---|
| Cristian Camilo Cortes Ortiz | Product Owner | @Cristianco9 | YYYY-MM-DD |
| Felipe Nuñez Navarro | Scrum Master | @FelOnCrackZ | YYYY-MM-DD |
| Jorge Humberto Leyes Rojas | Developer | [Por confirmar] | YYYY-MM-DD |
| Manuel Alejandro Mera Ruiz | Developer | [Por confirmar] | YYYY-MM-DD |
| Jesus Gabriel Ortiz Saac | Developer | [Por confirmar] | YYYY-MM-DD |

### Estado de la planificación

- [ ] Objetivo del Sprint definido.
- [ ] Elementos del Product Backlog seleccionados.
- [ ] Criterios de aceptación revisados.
- [ ] Plan de trabajo establecido.
- [ ] Compromisos registrados.

**Evidencia de aprobación:** [URL del Pull Request o discusión correspondiente]

---

**Fin del documento**

*Este documento constituye el registro formal de la planificación del Sprint. 
Los cambios significativos deberán quedar documentados para mantener la 
trazabilidad del trabajo.*
