# Acta de Planificación del Sprint 3

## 1. Información general

| Campo | Información |
|---|---|
| Código | ACT-SP-003 |
| Proyecto | Vive Zarzal App |
| Sprint | Sprint 3 |
| Fecha prevista | 2026-12-07 |
| Duración | 2026-12-07 al 2026-12-14 |
| Scrum Master | Felipe Nuñez Navarro |
| Product Owner | Cristian Camilo Cortes Ortiz |

## 2. Sprint Goal

Permitir que los usuarios registren documentos y direcciones, y que el formulario de ubicación funcione con selectores dependientes país → departamento → ciudad.

## 3. Elementos seleccionados

| ID | Historia / elemento | Origen tablero | Prioridad | SP |
|---|---|---|---|---|
| US-301 | Como miembro, quiero registrar mis documentos de identidad y cargar soportes. | GB-10, GB-01 | Alta | 4 |
| US-302 | Como equipo, quiero ampliar el seeder de ubicaciones y crear selectores dependientes. | GB-05, GB-04 | Alta | 3 |
| US-303 | Como miembro, quiero gestionar mis direcciones asociadas a una ciudad. | GB-03 | Media | 3 |

**Total:** 10 SP.

## 4. Actividades

| ID | Actividad | Estimación |
|---|---|---|
| TASK-301 | Revisar pendientes del Sprint 2. | 1 h |
| TASK-302 | Formulario de documentos de usuario. | 3 h |
| TASK-303 | Ruta y controlador para guardar documentos. | 3 h |
| TASK-304 | Carga de soportes con validación de archivo. | 3 h |
| TASK-305 | Pruebas de documentos: válido, duplicado y archivo inválido. | 2 h |
| TASK-306 | Ampliar seeder de países, departamentos y ciudades. | 2 h |
| TASK-307 | Endpoint para departamentos por país y ciudades por departamento. | 3 h |
| TASK-308 | Selectores dependientes en el formulario. | 3 h |
| TASK-309 | CRUD básico de direcciones del usuario. | 4 h |
| TASK-310 | Pruebas de ubicaciones y direcciones. | 2 h |
| TASK-311 | Documentación y demo. | 2 h |

**Total:** 28 h.

## 5. Criterios de aceptación

**US-301**

- [ ] El usuario puede seleccionar un tipo de documento y registrar un número.
- [ ] Puede cargar un soporte válido.
- [ ] Un archivo inválido o demasiado grande muestra error.
- [ ] No se duplica el mismo documento para el mismo usuario.

**US-302**

- [ ] El seeder incluye países, departamentos y ciudades suficientes para probar.
- [ ] Al elegir país se cargan sus departamentos.
- [ ] Al elegir departamento se cargan sus ciudades.

**US-303**

- [ ] El usuario puede crear, listar y editar sus direcciones.
- [ ] Solo puede ver y modificar sus propias direcciones.
- [ ] La dirección se asocia a una ciudad existente.

## 6. Plan de trabajo

| Fecha | Actividad |
|---|---|
| 2026-12-07 | Planificación y revisión de pendientes |
| 2026-12-08 al 2026-12-09 | Documentos y carga de soportes |
| 2026-12-09 al 2026-12-10 | Seeder de ubicaciones y selectores |
| 2026-12-11 al 2026-12-12 | Gestión de direcciones |
| 2026-12-13 | Pruebas, documentación y demo |
| 2026-12-14 | Sprint Review y Retrospectiva |

## 7. Riesgos

| ID | Riesgo | Impacto | Acción |
|---|---|---|---|
| RISK-301 | Subida de archivos sin validación suficiente. | Alto | Validar tipo, tamaño y propiedad. |
| RISK-302 | Datos de ubicación incompletos. | Medio | Ampliar seeder con datos de prueba. |
| RISK-303 | Selectores dependientes con muchos errores de JavaScript. | Medio | Implementación guiada y prueba manual. |
| RISK-304 | Direcciones de otros usuarios accesibles. | Alto | Verificar propiedad en el servidor. |

## 8. Acuerdos

- Los archivos se guardan en `src/public/uploads/` y no se versionan.
- Cada ruta nueva debe tener prueba de caso exitoso y caso de error.
- Documentar en `DATABASE.md` solo si cambia el esquema.
