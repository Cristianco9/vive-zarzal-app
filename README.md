# Vive Zarzal - Marketplace Turístico

Vive Zarzal es una aplicación web tipo Marketplace Turístico diseñada para promover el turismo local en el municipio de Zarzal, Valle del Cauca, Colombia. La plataforma conecta turistas, visitantes, comercios, emprendedores y prestadores de servicios turísticos locales en un solo lugar.

## Tabla de Contenidos

* [Características](#características)
* [Tecnologías Utilizadas](#tecnologías-utilizadas)
* [Primeros Pasos](#primeros-pasos)
* [Instalación](#instalación)
* [Uso](#uso)
* [Comandos Adicionales](#comandos-adicionales)
* [Contribuciones](#contribuciones)
* [Licencia](#licencia)
* [Contacto](#contacto)

## Características

* Explorar servicios y productos turísticos locales.
* Filtrar servicios y establecimientos por categoría.
* Contactar anunciantes mediante WhatsApp.
* Solicitar reservas de servicios turísticos.
* Gestión de perfiles de usuarios (clientes y anunciantes).
* Publicación y administración de negocios locales.
* Promoción de emprendimientos y atractivos turísticos del municipio.

## Tecnologías Utilizadas

* **JavaScript (ES6+)**
* **Node.js**
* **Express.js**
* **JWT (JSON Web Tokens)**
* **Docker**
* **PostgreSQL**
* **pgAdmin**
* **Sequelize ORM**
* **HTML**
* **CSS**
* **EJS (Embedded JavaScript Templates)**

## Primeros Pasos

Sigue estos pasos para obtener una copia local del proyecto y ejecutarla en tu entorno de desarrollo.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu equipo:

* [Node.js](https://nodejs.org/en/) (versión 18 o superior recomendada)
* [npm](https://www.npmjs.com/)
* [Docker](https://www.docker.com/)

#### Extensiones recomendadas para Visual Studio Code

* [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/Cristianco9/vive-zarzal-app.git
   ```

2. Navega al directorio del proyecto:

   ```sh
   cd vive-zarzal-app
   ```

3. Crea el contenedor de la base de datos y el sistema gestor de bases de datos:

   ```bash
   docker compose up -d
   ```

4. Genera e inserta las variables de entorno necesarias para el proyecto:

   ```bash
   npm run env-var
   ```

5. Instala las dependencias de desarrollo necesarias para ejecutar el proyecto:

   ```sh
   npm run dev-dep
   ```

6. Ejecuta las migraciones para crear las tablas y relaciones de la base de datos:

   ```bash
   npm run migrations:run
   ```

7. Ejecuta los seeders para poblar la base de datos con la información inicial requerida:

   ```bash
   npm run seeds:run
   ```

## Uso

Para iniciar el servidor de desarrollo y ejecutar el proyecto, utiliza el siguiente comando:

```sh
npm run dev
```

Una vez iniciado, podrás acceder a la aplicación desde:

```text
http://localhost:3377
```

O mediante el puerto configurado en tu archivo `.env`.

## Comandos Adicionales

### Migraciones

Generar una nueva migración:

```bash
npm run migrations:generate -- nombre_de_la_migracion
```

Ejecutar migraciones pendientes:

```bash
npm run migrations:run
```

Revertir la última migración:

```bash
npm run migrations:revert
```

Eliminar todas las migraciones:

```bash
npm run migrations:delete
```

### Seeders

Generar un nuevo seeder:

```bash
npm run seeds:generate -- nombre_del_seeder
```

Ejecutar seeders:

```bash
npm run seeds:run
```

Revertir el último seeder:

```bash
npm run seeds:revert
```

Eliminar todos los seeders:

```bash
npm run seeds:delete
```

## Contribuciones

Las contribuciones hacen que la comunidad de código abierto sea un lugar increíble para aprender, inspirar y crear. Cualquier aporte que realices será muy apreciado.

1. Haz un Fork del proyecto.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/NuevaFuncionalidad`).
3. Realiza tus cambios y confirma los commits (`git commit -m 'Agregar nueva funcionalidad'`).
4. Envía tus cambios al repositorio remoto (`git push origin feature/NuevaFuncionalidad`).
5. Abre un Pull Request.

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

## Contacto

LinkedIn: https://www.linkedin.com/in/cristianco9/

Repositorio del proyecto:

https://github.com/Cristianco9/vive-zarzal-app

---

Siéntete libre de adaptar este documento según las necesidades del proyecto y agregar información adicional que pueda ser útil para usuarios y colaboradores.
