# Acta de Revisión del Sprint

## 1. Información general

| Campo | Información |
|---|---|
| Código del documento | ACT-SR-002 |
| Proyecto | Vive Zarzal App |
| Sprint | Sprint 2 |
| Fecha de revisión | 2026-11-30 (prevista) |
| Hora de inicio | Por definir (HH:MM) |
| Hora de finalización | Por definir (HH:MM) |
| Scrum Master | Felipe Nuñez Navarro (2460817) |
| Product Owner | Cristian Camilo Cortes Ortiz |
| Repositorio | `https://github.com/Cristianco9/vive-zarzal-app` |
| GitHub Project | `https://github.com/users/FelOnCrackZ/projects/2` |

## 2. Objetivo de la reunión

Inspeccionar los resultados obtenidos durante el Sprint, revisar el
Incremento desarrollado, verificar el cumplimiento de los criterios de
aceptación y recopilar retroalimentación para orientar las siguientes
etapas del proyecto.

Esta acta se prepara al inicio del Sprint con los datos de la planificación
(ACT-SP-002). Las columnas de estado, resultado y evidencia se completan
durante la Sprint Review; hasta entonces permanecen como «Pendiente» o
«Por registrar».

## 3. Participantes

| Nombre completo | Rol | Asistencia |
|---|---|---|
| Cristian Camilo Cortes Ortiz | Product Owner | Remota |
| Felipe Nuñez Navarro (2460817) | Scrum Master | Remota|
| Jorge Humberto Leyes Rojas (2460809) | Developer | Remota |
| Manuel Alejandro Mera Ruiz (2460971) | Developer | Remota |
| Jesus Gabriel Ortiz Saac (2369566) | Developer | Remota |
| Interesado / Invitado | Interesado | Remota |

## 4. Objetivo del Sprint

**Sprint Goal establecido:**

Permitir que cualquier visitante explore el contenido del foro (detalle de
cada publicación, publicaciones por categoría y perfiles públicos) y que
cada autor pueda editar y eliminar sus propias publicaciones, completando
así el recorrido de publicaciones del escenario manual del proyecto.

**Resultado general:**

[Se completa en la Sprint Review: indicar si se alcanzó el objetivo.]

## 5. Revisión de los elementos del Sprint Backlog

| ID | Elemento seleccionado | Estado | Story Points | Issue |
|---|---|---|---|---|
| US-008 | Detalle de publicación (HU-10) | Pendiente | 3 | Por crear |
| US-009 | Exploración por categoría (HU-12) | Pendiente | 2 | Por crear |
| US-010 | Perfil público (HU-05) | Pendiente | 2 | Por crear |
| US-011 | Gestión de mis publicaciones (HU-11) | Pendiente | 3 | Por crear |

**Total de Story Points planificados:** 10

**Total de Story Points completados:** Por registrar

Nota: según RISK-001 y RISK-002 de la planificación, si falta capacidad la
primera historia en moverse al Sprint 3 es US-010.

## 6. Incremento desarrollado

Funcionalidades previstas para el Incremento (versión v0.2.0).

| ID | Funcionalidad | Descripción | Evidencia |
|---|---|---|---|
| INC-001 | Detalle de publicación | `GET /publications/:id` | Por registrar |
| INC-002 | Exploración categorías | `GET /categories/:slug` | Por registrar |
| INC-003 | Perfil público | `GET /users/:id` | Por registrar |
| INC-004 | Editar y eliminar propias | Control de propiedad | Por registrar |
| INC-005 | Documentación | README y `docs/HANDOFF.md` | Por registrar |

## 7. Validación de criterios de aceptación

| ID | Criterio de aceptación | Resultado | Observaciones |
|---|---|---|---|
| CA-001 | US-008: detalle público con sus datos | Pendiente | Por registrar |
| CA-002 | US-008: ingredientes solo en recetas | Pendiente | Por registrar |
| CA-003 | US-008: inexistente da no encontrado | Pendiente | Por registrar |
| CA-004 | US-008: editar/eliminar solo al autor | Pendiente | Por registrar |
| CA-005 | US-008: feed enlaza al detalle | Pendiente | Por registrar |
| CA-006 | US-009: solo las de la categoría | Pendiente | Por registrar |
| CA-007 | US-009: slug desconocido y vacío | Pendiente | Por registrar |
| CA-008 | US-009: categorías en la navegación | Pendiente | Por registrar |
| CA-009 | US-010: perfil sin correo ni contraseña | Pendiente | Por registrar |
| CA-010 | US-010: publicaciones del usuario y 404 | Pendiente | Por registrar |
| CA-011 | US-010: mensaje tras actualizar perfil | Pendiente | Por registrar |
| CA-012 | US-011: edición con formulario validado | Pendiente | Por registrar |
| CA-013 | US-011: eliminación con imagen asociada | Pendiente | Por registrar |
| CA-014 | US-011: denegado a otros y sin sesión | Pendiente | Por registrar |
| CA-015 | General: demostración pasos 3, 4, 7 y 8 | Pendiente | Por registrar |

Los criterios completos de cada historia están en la sección 7 de ACT-SP-002.

## 8. Pull Requests y evidencias técnicas

| Pull Request | Descripción | Estado | Revisor |
|---|---|---|---|
| Por registrar | Detalle de publicación (US-008) | Pendiente | Por asignar |
| Por registrar | Exploración por categoría (US-009) | Pendiente | Por asignar |
| Por registrar | Perfil público (US-010) | Pendiente | Por asignar |
| Por registrar | Gestión de publicaciones (US-011) | Pendiente | Por asignar |

**Otras evidencias:**

- Pruebas ejecutadas: Por registrar (`npm test` y `npm run lint`).
- Capturas de pantalla: Por registrar.
- Documentación técnica: README y `docs/HANDOFF.md` actualizados.
- Versión o demostración: Por registrar (v0.2.0).

## 9. Retroalimentación del Product Owner y los interesados

**Aspectos satisfactorios:**

[Se completa en la Sprint Review.]

**Observaciones y oportunidades de mejora:**

[Se completa en la Sprint Review.]

**Nuevas necesidades identificadas:**

[Se completa en la Sprint Review.]

## 10. Elementos pendientes

| ID | Elemento pendiente | Motivo | Acción propuesta |
|---|---|---|---|
| PEND-001 | Por registrar | Por registrar | Por registrar |

Los elementos no completados deberán regresar al Product Backlog para su
evaluación y priorización. No se consideran automáticamente comprometidos
para el siguiente Sprint.

## 11. Acuerdos y decisiones

| ID | Acuerdo o decisión | Responsable | Fecha límite |
|---|---|---|---|
| AC-001 | Registrar resultado de la demostración | Scrum Master | 2026-11-30 |
| AC-002 | Devolver pendientes al Product Backlog | Product Owner | 2026-11-30 |
| AC-003 | Reusar control de propiedad en comentarios | Equipo | 2026-11-30 |
| AC-004 | Publicar el release v0.2.0 en GitHub | Scrum Master | 2026-11-30 |

## 12. Evidencias y referencias

- Repositorio: https://github.com/Cristianco9/vive-zarzal-app.
- GitHub Project: https://github.com/users/FelOnCrackZ/projects/2.
- Sprint Backlog: GitHub Project del equipo (US-008 a US-011).
- Pull Requests: Por registrar.
- Incremento presentado: Por registrar (v0.2.0).
- Documentación relacionada: ACT-SP-002, ACT-SP-001, ACT-PA-001 y
  `docs/project/Vive Zarzal - Documento del proyecto.pdf`.

## 13. Observaciones

- El detalle de la publicación muestra por ahora solo su contenido. Los me
  gusta, la valoración y los comentarios se integran en el Sprint 3.
- La búsqueda y la paginación (HU-13) son una meta opcional del Sprint 4.
- Los campos «Por registrar», «Por confirmar» y «Por definir» se completan
  con la información real de la reunión antes de la aprobación del acta.

## 14. Validación y aprobación

| Participante | Rol | Usuario de GitHub | Fecha |
|---|---|---|---|
| Cristian Camilo Cortes Ortiz | Product Owner | @Cristianco9 | YYYY-MM-DD |
| Felipe Nuñez Navarro | Scrum Master | @FelOnCrackZ | YYYY-MM-DD |
| Jorge Humberto Leyes Rojas | Developer | [Por confirmar] | YYYY-MM-DD |
| Manuel Alejandro Mera Ruiz | Developer | [Por confirmar] | YYYY-MM-DD |
| Jesus Gabriel Ortiz Saac | Developer | [Por confirmar] | YYYY-MM-DD |

### Estado de la revisión

- [ ] Se presentó el Incremento desarrollado.
- [ ] Se revisaron los elementos del Sprint Backlog.
- [ ] Se verificaron los criterios de aceptación.
- [ ] Se registró la retroalimentación.
- [ ] Se identificaron elementos pendientes.
- [ ] Se documentaron los acuerdos y decisiones.

**Evidencia de aprobación:** [URL del Pull Request o discusión correspondiente]

---

**Fin del documento**

*La Sprint Review es una sesión de inspección y adaptación del producto. No
debe entenderse únicamente como una presentación de resultados ni como una
reunión exclusiva de aprobación del trabajo realizado.*
