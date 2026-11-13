# Acta de Planificación del Sprint 4

## 1. Información general

| Campo | Información |
|---|---|
| Código | ACT-SP-004 |
| Proyecto | Vive Zarzal App |
| Sprint | Sprint 4 |
| Fecha prevista | 2026-12-21 |
| Duración | 2026-12-21 al 2026-12-28 |
| Scrum Master | Felipe Nuñez Navarro |
| Product Owner | Cristian Camilo Cortes Ortiz |
| Congelamiento de código | 2026-12-26 |

## 2. Sprint Goal

Cerrar las funcionalidades administrativas y de moderación, agregar filtros por etiqueta, verificar documentos y dejar el proyecto listo para la demostración final y aceptación.

## 3. Elementos seleccionados

| ID | Historia / elemento | Origen tablero | Prioridad | SP |
|---|---|---|---|---|
| US-401 | Como administrador, quiero gestionar roles de usuarios. | GB-06 | Alta | 2 |
| US-402 | Como administrador, quiero gestionar categorías y etiquetas. | GB-07 | Alta | 2 |
| US-403 | Como moderador, quiero una cola de reportes para revisar y resolver. | GB-08 | Alta | 2 |
| US-404 | Como administrador, quiero verificar documentos de usuario. | GB-02 | Media | 1 |
| US-405 | Como visitante, quiero filtrar publicaciones por etiqueta y ver páginas por etiqueta. | GB-09 | Media | 1 |
| US-406 | Como equipo, queremos ejecutar el escenario manual, corregir errores y preparar la entrega. | Cierre | Alta | 1 |

**Total:** 9 SP.

## 4. Actividades

| ID | Actividad | Estimación |
|---|---|---|
| TASK-401 | Revisar pendientes del Sprint 3. | 1 h |
| TASK-402 | Listado de usuarios y asignación de roles. | 4 h |
| TASK-403 | CRUD básico de categorías y etiquetas. | 4 h |
| TASK-404 | Cola de reportes pendientes y acciones aprobar/descartar. | 3 h |
| TASK-405 | Verificación de documentos por administrador. | 3 h |
| TASK-406 | Filtro y página por etiqueta. | 3 h |
| TASK-407 | Pruebas de integración de administración y moderación. | 3 h |
| TASK-408 | Actualización final de README, HANDOFF y DATABASE. | 2 h |
| TASK-409 | Ensayo del escenario manual de 9 pasos. | 2 h |
| TASK-410 | Congelamiento, correcciones menores y release v1.0.0. | 2 h |

**Total:** 27 h.

## 5. Criterios de aceptación

**US-401**

- [ ] Solo un administrador puede asignar o quitar roles.
- [ ] Un usuario normal recibe `403`.
- [ ] Los cambios se reflejan en el perfil público.

**US-402**

- [ ] El administrador puede crear, editar y listar categorías.
- [ ] Puede crear y editar etiquetas.
- [ ] No se eliminan categorías con publicaciones asociadas sin control.

**US-403**

- [ ] El moderador ve solo reportes pendientes.
- [ ] Puede aprobar o descartar un reporte.
- [ ] Se registra revisor y fecha.

**US-404**

- [ ] El administrador puede marcar un documento como verificado.
- [ ] Se guarda `verified_at`.

**US-405**

- [ ] Las publicaciones muestran sus etiquetas.
- [ ] Existe página `/tags/:slug` con publicaciones filtradas.
- [ ] Un slug inexistente muestra recurso no encontrado.

**US-406**

- [ ] El escenario manual de 9 pasos se ejecuta sin fallos.
- [ ] `npm test` y `npm run lint` pasan.
- [ ] El release v1.0.0 queda publicado.

## 6. Plan de trabajo

| Fecha | Actividad |
|---|---|
| 2026-12-21 | Planificación y revisión de pendientes |
| 2026-12-22 al 2026-12-23 | Administración de roles, categorías y etiquetas |
| 2026-12-23 al 2026-12-24 | Moderación y verificación de documentos |
| 2026-12-24 al 2026-12-25 | Filtros por etiqueta y pruebas de integración |
| 2026-12-26 | Congelamiento de código |
| 2026-12-27 | Correcciones menores y ensayo de demo |
| 2026-12-28 | Sprint Review, aceptación y release v1.0.0 |

## 7. Riesgos

| ID | Riesgo | Impacto | Acción |
|---|---|---|---|
| RISK-401 | Rutas administrativas sin autorización. | Alto | Probar con usuario normal y visitante. |
| RISK-402 | Modificación de reportes por usuarios no moderadores. | Alto | Middleware de rol y pruebas. |
| RISK-403 | Falta de tiempo por cierre de semestre. | Medio | Congelar el 26 y priorizar correcciones. |
| RISK-404 | Documentación desactualizada. | Medio | Actualizar antes del 26. |

## 8. Acuerdos de cierre

- El 2026-12-26 se congela el código.
- Del 26 al 28 solo se corrigen errores y se prepara la demo.
- El release v1.0.0 se publica el 2026-12-28.
- Los pendientes se registran como issues y no como funcionalidades entregadas.
