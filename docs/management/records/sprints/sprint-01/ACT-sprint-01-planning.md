# Acta de Planificación del Sprint 1

## 1. Información general

| Campo | Información |
|---|---|
| Código del documento | ACT-SP-001 |
| Proyecto | Vive Zarzal App |
| Sprint | Sprint 1 |
| Fecha prevista | 2026-11-02 |
| Duración | 2026-11-02 al 2026-11-16 |
| Scrum Master | Felipe Nuñez Navarro |
| Product Owner | Cristian Camilo Cortes Ortiz |
| Repositorio | `https://github.com/Cristianco9/vive-zarzal-app` |
| GitHub Project | `https://github.com/users/FelOnCrackZ/projects/2` |

## 2. Objetivo del Sprint

**Sprint Goal:** dejar una base de trabajo confiable para estudiantes novatos, restaurar los elementos del tablero que quedaron pendientes, implementar el middleware de autorización por rol/permiso y dejar listo el backend de favoritos.

## 3. Punto de partida del tablero

El Sprint 1 toma como punto de partida el tablero actual:

- **Backlog:** 5 elementos.
- **Ready:** 5 elementos.
- **In progress:** 1 de 3.
- **In review:** 0 de 5.
- **Done:** 10 elementos.

Los elementos **Done** no se re-planifican. Los elementos seleccionados para este sprint son los que están en curso o listos, más tareas de onboarding técnico.

## 4. Elementos seleccionados

| ID | Historia / elemento | Origen tablero | Prioridad | SP | Issue |
|---|---|---|---|---|---|
| US-101 | Como equipo, queremos entender y estabilizar el entorno local (Docker, migraciones, seeders, rutas y modelos) para trabajar sin bloqueos. | Onboarding | Alta | 2 | Por crear |
| US-102 | Como equipo, queremos restaurar los seeders y el código del foro eliminados, para que el proyecto vuelva a un estado coherente. | GB-14, GB-17 | Alta | 2 | Por crear |
| US-103 | Como administrador, quiero un middleware de autorización por rol y permiso, para proteger rutas según el rol del usuario. | GB-18 / GB-21 | Alta | 3 | Por crear |
| US-104 | Como miembro, quiero guardar y quitar publicaciones de favoritos, para consultarlas después. | GB-15 | Alta | 3 | Por crear |

**Total:** 10 Story Points.

## 5. Descomposición de actividades

| ID | Actividad | Responsable | Estimación |
|---|---|---|---|
| TASK-101 | Leer `README.md`, `docs/HANDOFF.md` y `docs/Database/DATABASE.md`; anotar dudas. | Por asignar | 2 h |
| TASK-102 | Levantar Docker, ejecutar migraciones y seeders; documentar errores y solución. | Por asignar | 3 h |
| TASK-103 | Recorrido guiado por `app.js`, routers, controladores de auth y modelos. | Por asignar | 2 h |
| TASK-104 | Restaurar seeders eliminados y verificar que sean idempotentes. | Por asignar | 2 h |
| TASK-105 | Restaurar código del foro eliminado y comprobar que `npm test` no rompa. | Por asignar | 2 h |
| TASK-106 | Revisar modelos `Role`, `Permission`, `UserRole` y asociaciones. | Por asignar | 2 h |
| TASK-107 | Implementar `requireRole` y `requirePermission` como middleware reutilizable. | Por asignar | 4 h |
| TASK-108 | Escribir pruebas del middleware: permitido, denegado y sin sesión. | Por asignar | 3 h |
| TASK-109 | Implementar guardar/quitar favorito en controlador y ruta. | Por asignar | 3 h |
| TASK-110 | Probar favoritos: guardar, quitar, duplicado y sin sesión. | Por asignar | 2 h |
| TASK-111 | Documentar rutas y middleware en README/HANDOFF. | Por asignar | 2 h |
| TASK-112 | Preparar demostración corta del Sprint. | Por asignar | 1 h |

**Total estimado:** 28 h.

## 6. Criterios de aceptación

**US-101**

- [ ] El proyecto se levanta desde cero siguiendo la documentación.
- [ ] Migraciones y seeders se ejecutan sin errores.
- [ ] El equipo documenta los bloqueos encontrados y su solución.

**US-102**

- [ ] Los seeders restaurados se pueden ejecutar dos veces sin duplicar datos.
- [ ] El código restaurado no rompe `npm run lint` ni `npm test`.

**US-103**

- [ ] Un usuario con rol permitido accede a la ruta protegida.
- [ ] Un usuario sin rol o sin permiso recibe `403`.
- [ ] Un visitante sin sesión es redirigido al login.
- [ ] Existen pruebas para los tres casos.

**US-104**

- [ ] Un miembro autenticado puede guardar una publicación como favorita.
- [ ] Puede quitarla y no se duplica el registro.
- [ ] Sin sesión, la acción redirige al login.

## 7. Definición de terminado

- [ ] Cumple criterios de aceptación.
- [ ] `npm run lint` y `npm test` pasan.
- [ ] Pull Request revisado por otro integrante.
- [ ] Documentación actualizada.
- [ ] Issue actualizado en GitHub Projects.

## 8. Plan de trabajo

| Fecha | Actividad |
|---|---|
| 2026-11-02 | Planificación, onboarding y lectura de documentación |
| 2026-11-03 al 2026-11-04 | Setup, Docker, migraciones y restauración de seeders/código |
| 2026-11-05 al 2026-11-08 | Middleware de autorización y pruebas |
| 2026-11-09 al 2026-11-12 | Backend de favoritos y pruebas |
| 2026-11-13 al 2026-11-15 | Documentación, pruebas finales y demo |
| 2026-11-16 | Sprint Review y Retrospectiva |

## 9. Riesgos

| ID | Riesgo | Impacto | Acción |
|---|---|---|---|
| RISK-101 | El equipo es novato en Node/Express y Docker. | Medio | Pair programming y tareas guiadas. |
| RISK-102 | La restauración de código puede generar conflictos. | Medio | Revisar con `git diff` y PR pequeño. |
| RISK-103 | Middleware de permisos mal implementado. | Alto | Pruebas con tres usuarios y revisión cruzada. |
| RISK-104 | Favoritos duplicados por falta de restricción única. | Medio | Verificar índice único y probar duplicado. |

## 10. Acuerdos

- Una rama por historia.
- PR revisado por otro integrante.
- Actualizar el tablero al mover cada issue.
- Consultar al Product Owner antes de agregar alcance.

## 11. Aprobación

| Participante | Rol | Fecha |
|---|---|---|
| Cristian Camilo Cortes Ortiz | Product Owner | YYYY-MM-DD |
| Felipe Nuñez Navarro | Scrum Master | YYYY-MM-DD |
| Jorge Humberto Leyes Rojas | Developer | YYYY-MM-DD |
| Manuel Alejandro Mera Ruiz | Developer | YYYY-MM-DD |
| Jesus Gabriel Ortiz Saac | Developer | YYYY-MM-DD |
