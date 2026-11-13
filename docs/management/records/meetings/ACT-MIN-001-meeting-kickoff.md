# ACT-MIN-001 — Acta de reunión de inicio y entrega del contexto del proyecto

## 1. Información general

| Campo | Descripción |
|---|---|
| Código del acta | ACT-MIN-001 |
| Nombre de la reunión | Reunión inicial — Entrega del contexto de Vive Zarzal App |
| Fecha de la reunión | 1 de noviembre de 2026 |
| Hora de inicio | 7:00 p. m. |
| Hora de finalización | 9:00 p. m. |
| Duración | 2 horas |
| Proyecto | Vive Zarzal App |
| Modalidad | Remota |
| Responsable de la entrega | Cristian Camilo Cortes Ortiz |
| Tipo de reunión | Inicio del proyecto y transferencia de contexto |

## 2. Participantes

Se registra la participación de los siguientes integrantes:

| Nombre completo | Identificación | Rol | Asistencia |
|---|---|---|---|
| Cristian Camilo Cortes Ortiz | No aplica | Product Owner | Presente |
| Felipe Nuñez Navarro | 2460817 | Scrum Master | Presente |
| Jorge Humberto Leyes Rojas | 2460809 | Developer | Presente |
| Manuel Alejandro Mera Ruiz | 2460971 | Developer | Presente |
| Jesus Gabriel Ortiz Saac | 2369566 | Developer | Presente |

**Total de participantes:** 5  
**Asistentes:** 5  
**Ausentes:** 0

## 3. Objetivo de la reunión

Presentar al equipo de desarrollo el contexto general, el estado inicial, la 
arquitectura, las funcionalidades existentes y los requerimientos pendientes del 
proyecto Vive Zarzal App, con el propósito de proporcionar un punto de partida 
técnico y funcional para que el equipo pudiera analizar la situación del proyecto, 
identificar el trabajo necesario y organizar su primer Sprint.

Durante la reunión, el Product Owner realizó la entrega del contexto del proyecto 
y de los recursos disponibles en el repositorio de GitHub. A partir de esta información, 
el equipo receptor tendría la responsabilidad de revisar la solución existente, 
identificar oportunidades de desarrollo y establecer una propuesta de trabajo para el Sprint 1.

## 4. Agenda

1. Presentación del proyecto Vive Zarzal App.
2. Explicación del propósito y alcance funcional del sistema.
3. Presentación del estado actual del repositorio.
4. Revisión de la arquitectura y las tecnologías utilizadas.
5. Explicación de las funcionalidades existentes.
6. Presentación de los módulos pendientes de implementación.
7. Entrega del repositorio y documentación técnica.
8. Aclaración de responsabilidades del equipo receptor.
9. Identificación inicial de actividades para el desarrollo.
10. Acuerdos y compromisos.

## 5. Desarrollo de la reunión

### 5.1. Presentación y contexto del proyecto

El Product Owner presentó Vive Zarzal App como una aplicación web orientada a 
funcionar como un foro comunitario de comida, en el que los usuarios pueden 
compartir platos y recetas, explorar publicaciones, interactuar con otros miembros 
y gestionar su perfil.

Se explicó que el proyecto había evolucionado desde su planteamiento original de 
marketplace hacia una solución enfocada en una comunidad gastronómica.

Por esta razón, el equipo debía trabajar sobre el alcance actual del proyecto y 
no retomar funcionalidades correspondientes al concepto anterior de marketplace.

El alcance funcional contempla principalmente:

- Gestión de usuarios y perfiles.
- Publicación de platos y recetas.
- Exploración de publicaciones por categorías.
- Interacciones mediante likes, calificaciones y comentarios.
- Gestión de roles y permisos.
- Administración de información complementaria de los usuarios.
- Organización y moderación del contenido publicado.

Se aclaró que el objetivo de la entrega era proporcionar una base de trabajo 
sobre la cual el equipo pudiera continuar desarrollando nuevas funcionalidades.

### 5.2. Estado inicial del repositorio

Se presentó el repositorio de GitHub:

**Repositorio de referencia:**  
https://github.com/Cristianco9/vive-zarzal-app

El equipo recibió como punto de partida una aplicación desarrollada utilizando 
Node.js, Express, EJS, Sequelize y PostgreSQL.

La estructura existente incluía:

- Configuración de la aplicación y servidor Express.
- Organización de rutas, controladores y middlewares.
- Conexión con PostgreSQL mediante Sequelize.
- Modelos, asociaciones y migraciones de base de datos.
- Seeders para la información inicial.
- Vistas desarrolladas con EJS.
- Esquemas de validación mediante Joi.
- Utilidades para autenticación, manejo de contraseñas y errores.
- Pruebas automatizadas para validar componentes del sistema.

La base de datos contemplaba 21 tablas de dominio, además de la tabla de control 
de migraciones `SequelizeMeta`.

### 5.3. Tecnologías y arquitectura entregadas

Se presentó el stack tecnológico existente:

| Tecnología | Responsabilidad |
|---|---|
| Node.js | Entorno de ejecución |
| Express 5 | Framework backend |
| EJS | Renderizado de vistas |
| Sequelize 6 | ORM y gestión de modelos |
| PostgreSQL | Sistema gestor de bases de datos |
| JWT | Gestión de sesiones y autenticación |
| bcryptjs | Cifrado de contraseñas |
| Joi | Validación de datos |
| Multer | Manejo de archivos e imágenes |
| Docker Compose | Entorno de desarrollo de base de datos |
| Node.js Test Runner | Ejecución de pruebas |

Se indicó que el equipo debía respetar la organización arquitectónica existente 
y procurar que las nuevas funcionalidades se integraran con los componentes actuales, 
evitando duplicar responsabilidades o introducir implementaciones desconectadas 
del diseño del proyecto.

### 5.4. Estado funcional y alcance de la entrega

Se explicó que el proyecto contaba con una base de autenticación y gestión de 
usuarios, además de una estructura de datos preparada para ampliar las funcionalidades 
del foro.

La entrega debía entenderse diferenciando las funcionalidades existentes de 
aquellas cuya estructura ya estaba preparada, pero que todavía requerían desarrollo 
e integración.

**Funcionalidades base:**

- Registro e inicio de sesión.
- Gestión básica de usuarios y perfiles.
- Publicaciones de platos y recetas.
- Exploración de publicaciones por categorías.
- Interacciones mediante likes, calificaciones y comentarios.
- Configuración de la conexión con la base de datos.
- Modelos y asociaciones del dominio.

**Módulos preparados para desarrollo posterior:**

- Roles y permisos.
- Gestión de documentos de usuarios.
- Direcciones y ubicación geográfica.
- Etiquetas asociadas a publicaciones.
- Publicaciones favoritas.
- Notificaciones.
- Reportes y moderación de contenido.

Se explicó que disponer de modelos y tablas en la base de datos no significaba 
que los respectivos flujos estuvieran completamente implementados en la aplicación.

Por tanto, el equipo debía analizar las funcionalidades existentes antes de iniciar 
cada implementación, reutilizando los componentes disponibles cuando correspondiera.

### 5.5. Alcance y restricciones del proyecto

Se estableció como referencia el enfoque actual de foro gastronómico.

El equipo debía evitar reincorporar funcionalidades del marketplace anterior, entre ellas:

- Gestión de emprendimientos y tiendas.
- Catálogos de productos comerciales.
- Inventarios.
- Carritos de compra.
- Órdenes de compra.
- Ventas y pagos.
- Transacciones comerciales.

Las nuevas funcionalidades debían contribuir al propósito comunitario del sistema 
y mantener coherencia con el modelo de negocio definido para Vive Zarzal App.

### 5.6. Entrega del contexto al equipo de desarrollo

El Product Owner proporcionó al equipo el repositorio de GitHub como fuente principal 
del código y la documentación técnica disponible.

Se indicó que el equipo receptor debía realizar su propio análisis del proyecto 
para comprender:

1. La organización del código fuente.
2. Los modelos y relaciones de la base de datos.
3. Las funcionalidades existentes.
4. Los componentes que podían reutilizarse.
5. Las funcionalidades pendientes.
6. Las dependencias entre los diferentes módulos.
7. Las necesidades de implementación y validación.

A partir de esta revisión, el equipo debía construir su propia propuesta de trabajo, 
organizar las actividades y definir los elementos que considerara pertinentes 
para el primer Sprint.

## 6. Identificación inicial de áreas de trabajo

Como resultado del contexto entregado, se identificaron las siguientes áreas que 
podían requerir implementación o ampliación:

| Área | Necesidad identificada |
|---|---|
| Documentos de usuario | Formularios, carga de soportes y verificación administrativa. |
| Ubicaciones | Gestión de direcciones y selectores dependientes de ubicación. |
| Roles y permisos | Autorización de operaciones y administración de roles. |
| Categorías y etiquetas | Administración de categorías y asociación de etiquetas a publicaciones. |
| Favoritos | Guardar publicaciones y consultar el listado personal. |
| Reportes | Reportar contenido y gestionar su revisión por moderadores. |

Esta identificación inicial sirvió como referencia para el análisis posterior del
 equipo. No representó por sí misma una asignación definitiva de tareas ni una 
 aprobación del alcance del Sprint.

## 7. Acuerdos y decisiones

| N.º | Acuerdo |
|---|---|
| 1 | El repositorio de GitHub será la fuente principal del código y la documentación técnica del proyecto. |
| 2 | El equipo receptor trabajará sobre la base existente y deberá analizarla antes de implementar nuevas funcionalidades. |
| 3 | Se conservará el enfoque de Vive Zarzal App como foro comunitario gastronómico. |
| 4 | No se retomarán funcionalidades correspondientes al marketplace original. |
| 5 | Las funcionalidades pendientes deberán integrarse respetando la arquitectura y el modelo de datos existentes. |
| 6 | El equipo receptor analizará los requerimientos y organizará las actividades correspondientes al primer Sprint. |
| 7 | Las actividades de desarrollo deberán registrarse y mantenerse trazables mediante GitHub Issues y GitHub Projects. |
| 8 | Los cambios de código deberán entregarse mediante Pull Requests para su respectiva revisión. |
| 9 | Las decisiones relevantes y los resultados de las reuniones deberán quedar documentados en el repositorio. |

## 8. Compromisos y responsabilidades

| Responsable | Compromiso |
|---|---|
| Cristian Camilo Cortes Ortiz — Product Owner | Entregar el contexto funcional y técnico del proyecto. |
| Cristian Camilo Cortes Ortiz — Product Owner | Proporcionar acceso al repositorio y a los recursos disponibles. |
| Felipe Nuñez Navarro — Scrum Master | Facilitar la organización del trabajo y apoyar la coordinación del equipo. |
| Jorge Humberto Leyes Rojas — Developer | Revisar la estructura y el estado del proyecto. |
| Manuel Alejandro Mera Ruiz — Developer | Analizar las funcionalidades existentes y las necesidades pendientes. |
| Jesus Gabriel Ortiz Saac — Developer | Participar en el análisis técnico y la identificación de actividades de desarrollo. |
| Equipo de desarrollo | Organizar y priorizar las actividades para el Sprint 1. |
| Equipo de desarrollo | Registrar las tareas mediante GitHub Issues. |
| Equipo de desarrollo | Organizar el trabajo del Sprint mediante GitHub Projects. |
| Equipo de desarrollo | Presentar los avances mediante Pull Requests y evidencias verificables. |

## 9. Resultado de la reunión

Como resultado de la primera reunión, el equipo de desarrollo recibió el contexto 
funcional y técnico de Vive Zarzal App, así como el repositorio que serviría como 
punto de partida para el desarrollo.

Se estableció una comprensión inicial del propósito del sistema, sus tecnologías, 
su estructura arquitectónica y las áreas funcionales que requerían ampliación.

A partir de esta entrega, el equipo receptor inició el análisis del proyecto y la 
organización de su trabajo. Posteriormente, elaboró una propuesta de backlog para 
el Sprint 1, en la que se identificaron actividades relacionadas con documentos, 
ubicaciones, roles, permisos, etiquetas, favoritos y reportes.

La definición y organización de dichas actividades se considera parte del trabajo 
de planificación del equipo receptor y debe quedar complementada con el acta específica 
de Sprint Planning.

## 10. Evidencias y recursos

| Recurso | Ubicación |
|---|---|
| Repositorio de Vive Zarzal App | https://github.com/Cristianco9/vive-zarzal-app |
| Tablero de seguimiento de actividades | GitHub Projects del equipo receptor |
| Issues del proyecto | Repositorio de desarrollo del equipo receptor |
| Pull Requests | Repositorio de desarrollo del equipo receptor |

## 11. Observaciones

Esta acta documenta la reunión inicial de entrega del contexto del proyecto 
realizada el 1 de noviembre de 2026, en modalidad remota, entre las 7:00 p. m. y las 9:00 p. m.

No corresponde al acta de planificación del Sprint 1 ni constituye por sí misma 
una aprobación de todas las actividades posteriormente registradas en el tablero del equipo.

La selección definitiva de los elementos del Sprint, su objetivo, estimaciones, 
responsables y criterios de aceptación deberá quedar documentada en el acta de 
Sprint Planning correspondiente.

## 12. Aprobación y constancia

La presente acta deja constancia del contexto funcional y técnico proporcionado 
al equipo receptor, así como de los acuerdos y compromisos establecidos durante la reunión.

| Rol | Nombre completo | Asistencia |
|---|---|---|
| Product Owner | Cristian Camilo Cortes Ortiz | Presente |
| Scrum Master | Felipe Nuñez Navarro | Presente |
| Developer | Jorge Humberto Leyes Rojas | Presente |
| Developer | Manuel Alejandro Mera Ruiz | Presente |
| Developer | Jesus Gabriel Ortiz Saac | Presente |

La confirmación de aprobación del contenido del acta podrá registrarse mediante 
revisión o comentario de los participantes en el repositorio de GitHub.

---

**Código del documento:** ACT-MIN-001  
**Proyecto:** Vive Zarzal App  
**Fecha de la reunión:** 1 de noviembre de 2026  
**Horario:** 7:00 p. m. – 9:00 p. m.  
**Modalidad:** Remota  
**Estado:** Registro de reunión elaborado.
