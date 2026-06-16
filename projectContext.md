# Contexto del Proyecto: Vive Zarzal

## Descripción General

**Vive Zarzal** es una aplicación web tipo **Marketplace Turístico** diseñada para promover el turismo 
local en el municipio de Zarzal, Valle del Cauca, Colombia.

La plataforma conecta turistas, visitantes y consumidores con comercios, emprendedores y prestadores 
de servicios turísticos locales, permitiéndoles descubrir experiencias, productos y servicios 
disponibles dentro del municipio.

La aplicación no funciona como una plataforma de comercio electrónico ni procesa pagos en línea.
 Su propósito es actuar como intermediario entre la oferta turística local y la demanda de visitantes.

---

# Objetivo del Sistema

Centralizar la oferta turística del municipio de Zarzal mediante una plataforma digital que permita:

* Promover negocios locales.
* Facilitar el descubrimiento de servicios turísticos.
* Permitir solicitudes de reserva.
* Facilitar el contacto entre clientes y anunciantes.
* Incrementar la visibilidad digital de los prestadores de servicios turísticos.

---

# Tipo de Plataforma

Marketplace Turístico.

La plataforma opera bajo un modelo de oferta y demanda:

* Los anunciantes publican servicios o productos.
* Los clientes exploran las publicaciones y realizan solicitudes de reserva o contacto.

---

# Roles del Sistema

## 1. Cliente (Turista)

Representa a los usuarios que desean descubrir y reservar servicios turísticos.

### Funciones

* Explorar publicaciones.
* Buscar servicios.
* Filtrar servicios por categoría.
* Visualizar detalles de un producto o servicio.
* Contactar anunciantes mediante WhatsApp.
* Realizar solicitudes de reserva.
* Gestionar su perfil.

### Dominio del Cliente

```text
id
nombre
apellido
tipoDocumento
numeroDocumento
telefono
correo
usuario
password
direccion
genero
fechaNacimiento
nacionalidad
ciudadOrigen
fotoPerfil
fechaRegistro
estado
```

---

## 2. Anunciante

Representa a comerciantes, emprendedores o empresas que publican productos y servicios turísticos.

### Funciones

* Crear publicaciones.
* Editar publicaciones.
* Eliminar publicaciones.
* Gestionar reservas.
* Aceptar reservas.
* Cancelar reservas.
* Contactar clientes.
* Gestionar información de su negocio.

### Dominio del Anunciante

```text
id
nombre
apellido
tipoDocumento
numeroDocumento
telefono
correo
usuario
password
genero
fechaNacimiento

nombreNegocio
direccionNegocio
descripcionNegocio

paginaWeb
facebook
instagram
tiktok

fechaRegistro
estado
```

---

## 3. Administrador

Responsable de la gestión y moderación del sistema.

### Funciones

* Gestionar usuarios.
* Gestionar anunciantes.
* Moderar publicaciones.
* Eliminar contenido inapropiado.
* Suspender usuarios.
* Supervisar la plataforma.

---

# Entidades Principales

## Usuario

Entidad base del sistema.

Tipos:

* Cliente
* Anunciante
* Administrador

---

## Categoria

Agrupa productos y servicios.

Ejemplos:

* Gastronomía
* Hospedaje
* Turismo Cultural
* Ecoturismo
* Recreación
* Artesanías
* Transporte Turístico

### Atributos

```text
id
nombre
descripcion
estado
```

---

## Publicacion

Representa un producto o servicio publicado por un anunciante.

### Atributos

```text
id
titulo
descripcion
precio
imagenPrincipal
estado

fechaCreacion
fechaActualizacion

anuncianteId
categoriaId
```

### Estados

```text
ACTIVA
INACTIVA
ELIMINADA
```

---

## ImagenPublicacion

Permite almacenar múltiples imágenes para una publicación.

### Atributos

```text
id
url
publicacionId
```

---

## Reserva

Representa una solicitud realizada por un cliente sobre una publicación.

### Atributos

```text
id
fechaReserva
cantidadPersonas
comentarios

clienteId
publicacionId

estado
fechaCreacion
```

### Estados

```text
PENDIENTE
CONFIRMADA
CANCELADA
COMPLETADA
```

---

# Flujo Principal del Sistema

## Descubrimiento

1. El visitante ingresa al sitio.
2. Explora las publicaciones.
3. Filtra por categorías.
4. Visualiza detalles de la publicación.
5. Decide reservar o contactar al anunciante.

---

## Reserva

1. Cliente inicia sesión.
2. Selecciona una publicación.
3. Realiza una solicitud de reserva.
4. El anunciante recibe la solicitud.
5. El anunciante acepta o cancela la reserva.
6. El cliente recibe la notificación correspondiente.

---

## Contacto por WhatsApp

Cada publicación posee un botón:

```text
Contactar por WhatsApp
```

Al presionarlo:

1. Se muestra una ventana de confirmación.
2. Se abre WhatsApp con un mensaje predefinido.

Mensaje sugerido:

```text
Hola, encontré este servicio en Vive Zarzal y me gustaría recibir más información o 
consultar disponibilidad.
```

---

# Dashboard del Anunciante

Opciones principales:

```text
Servicios
Reservas
Perfil
Configuración
```

Estado inicial:

```text
Bienvenido a Vive Zarzal

Administra tus publicaciones, consulta tus reservas y gestiona la información de tu negocio 
desde este panel.

Selecciona una opción del menú para comenzar.
```

---

# Tecnologías Previstas

Frontend:

```text
React
TypeScript
TailwindCSS
```

Backend:

```text
Java
Spring Boot
Spring Security
JWT
```

Base de Datos:

```text
PostgreSQL
```

Infraestructura:

```text
Docker
Nginx
```

---

# Reglas de Negocio Importantes

1. Los visitantes pueden navegar sin autenticarse.
2. Solo usuarios registrados pueden realizar reservas.
3. Solo anunciantes pueden publicar productos o servicios.
4. Un anunciante puede tener múltiples publicaciones.
5. Una publicación pertenece a una única categoría.
6. Una publicación puede tener múltiples imágenes.
7. Una reserva pertenece a un cliente.
8. Una reserva pertenece a una publicación.
9. El anunciante puede aceptar o cancelar reservas.
10. El administrador puede moderar cualquier contenido del sistema.

---

# Visión del Proyecto

Vive Zarzal busca convertirse en la plataforma digital de referencia para la promoción del 
turismo local en Zarzal, permitiendo a visitantes descubrir experiencias auténticas mientras 
impulsa el crecimiento económico de los negocios y emprendedores de la región.
