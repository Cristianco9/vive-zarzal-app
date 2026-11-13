# Acta de Planificación del Sprint 2

## 1. Información general

| Campo | Información |
|---|---|
| Código | ACT-SP-002 |
| Proyecto | Vive Zarzal App |
| Sprint | Sprint 2 |
| Fecha prevista | 2026-11-23 |
| Duración | 2026-11-23 al 2026-11-30 |
| Scrum Master | Felipe Nuñez Navarro |
| Product Owner | Cristian Camilo Cortes Ortiz |

## 2. Sprint Goal

Completar la experiencia de favoritos en la interfaz, permitir que los usuarios reporten publicaciones o comentarios y agregar etiquetas a las publicaciones.

## 3. Elementos seleccionados

| ID | Historia / elemento | Origen tablero | Prioridad | SP |
|---|---|---|---|---|
| US-201 | Como miembro, quiero ver y gestionar mi listado de publicaciones favoritas en mi perfil. | GB-12 / GB-13 | Alta | 3 |
| US-202 | Como miembro, quiero guardar o quitar favoritos desde el feed y el detalle. | GB-20 | Alta | 2 |
| US-203 | Como miembro, quiero crear un reporte de una publicación o comentario. | GB-16 / GB-19 | Alta | 3 |
| US-204 | Como autor, quiero agregar etiquetas a mis publicaciones para mejorar el descubrimiento. | GB-11 | Media | 2 |

**Total:** 10 SP.

## 4. Actividades

| ID | Actividad | Estimación |
|---|---|---|
| TASK-201 | Revisar pendientes del Sprint 1. | 1 h |
| TASK-202 | Consulta de favoritos del usuario autenticado. | 2 h |
| TASK-203 | Vista de listado de favoritos en el perfil. | 3 h |
| TASK-204 | Botón de favoritos en feed y detalle. | 3 h |
| TASK-205 | Pruebas de favoritos en interfaz/rutas. | 2 h |
| TASK-206 | Formulario de creación de reporte. | 3 h |
| TASK-207 | Ruta y controlador para crear reporte. | 3 h |
| TASK-208 | Pruebas de reporte: válido, sin sesión y datos inválidos. | 2 h |
| TASK-209 | Selector de etiquetas en formulario de publicación. | 3 h |
| TASK-210 | Guardar y consultar etiquetas de una publicación. | 3 h |
| TASK-211 | Pruebas de etiquetas. | 2 h |
| TASK-212 | Documentación y demo. | 2 h |

**Total:** 29 h.

## 5. Criterios de aceptación

**US-201**

- [ ] El perfil muestra las publicaciones favoritas del usuario.
- [ ] Si no hay favoritos, se muestra un estado vacío.
- [ ] No se muestran favoritos de otros usuarios.

**US-202**

- [ ] El botón de favorito aparece en feed y detalle.
- [ ] Guardar y quitar funciona sin recargar de forma confusa.
- [ ] Un visitante es redirigido al login.

**US-203**

- [ ] Un miembro puede reportar una publicación o un comentario.
- [ ] El reporte exige motivo y guarda el estado inicial `pending`.
- [ ] No se puede reportar sin sesión.

**US-204**

- [ ] El formulario permite seleccionar etiquetas existentes.
- [ ] Las etiquetas se guardan en `publication_tags`.
- [ ] El detalle muestra las etiquetas asociadas.

## 6. Plan de trabajo

| Fecha | Actividad |
|---|---|
| 2026-11-23 | Planificación y revisión de pendientes |
| 2026-11-24 al 2026-11-25 | Favoritos en perfil y botones |
| 2026-11-26 al 2026-11-27 | Reportes de contenido |
| 2026-11-27 al 2026-11-28 | Etiquetas en publicaciones |
| 2026-11-29 | Pruebas, documentación y demo |
| 2026-11-30 | Sprint Review y Retrospectiva |

## 7. Riesgos

| ID | Riesgo | Impacto | Acción |
|---|---|---|---|
| RISK-201 | Duplicar rutas de favoritos ya existentes. | Medio | Revisar PR del Sprint 1. |
| RISK-202 | Reportes sin validación de destino. | Medio | Exigir publicación o comentario. |
| RISK-203 | Relación many-to-many de etiquetas mal configurada. | Medio | Probar guardar y consultar. |
| RISK-204 | Semana con fin de semana, poca capacidad real. | Medio | Priorizar US-201, US-202 y US-203; US-204 puede moverse. |

## 8. Acuerdos

- Mantener PR pequeños.
- Probar cada flujo con dos usuarios.
- Actualizar `docs/HANDOFF.md` si se agregan rutas.
- No iniciar administración ni moderación todavía.
