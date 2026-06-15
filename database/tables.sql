-- ============================================================
-- VIVE ZARZAL - SCRIPT PostgreSQL REFACTORIZADO
-- ============================================================

-- ============================================================
-- TABLAS DE CATÁLOGO
-- ============================================================

CREATE TABLE Pais (
    id_pais SERIAL PRIMARY KEY,
    nombre_pais VARCHAR(100) NOT NULL UNIQUE,
    descripcion_pais VARCHAR(255)
);

CREATE TABLE Departamento (
    id_departamento SERIAL PRIMARY KEY,
    nombre_departamento VARCHAR(100) NOT NULL,
    descripcion_departamento VARCHAR(255),
    id_pais INT NOT NULL,

    CONSTRAINT fk_departamento_pais
        FOREIGN KEY (id_pais)
        REFERENCES Pais(id_pais),

    CONSTRAINT uq_departamento_nombre_pais
        UNIQUE(nombre_departamento, id_pais)
);

CREATE TABLE Ciudad (
    id_ciudad SERIAL PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL,
    descripcion_ciudad VARCHAR(255),
    id_departamento INT NOT NULL,

    CONSTRAINT fk_ciudad_departamento
        FOREIGN KEY (id_departamento)
        REFERENCES Departamento(id_departamento),

    CONSTRAINT uq_ciudad_nombre_departamento
        UNIQUE(nombre_ciudad, id_departamento)
);

CREATE TABLE Ubicacion (
    id_ubicacion SERIAL PRIMARY KEY,
    nombre_ubicacion VARCHAR(150) NOT NULL,
    descripcion_ubicacion TEXT,
    codigo_ubicacion VARCHAR(50),
    id_ciudad INT NOT NULL,

    fecha_creacion_ubicacion TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_ubicacion TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_ubicacion_ciudad
        FOREIGN KEY (id_ciudad)
        REFERENCES Ciudad(id_ciudad)
);

CREATE TABLE Genero (
    id_genero SERIAL PRIMARY KEY,
    tipo_genero VARCHAR(50) NOT NULL UNIQUE,

    fecha_creacion_genero TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion_genero TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Tipo_documento (
    id_tipo_documento SERIAL PRIMARY KEY,
    nombre_tipo_documento VARCHAR(100) NOT NULL UNIQUE,

    fecha_creacion_tipo_documento TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_tipo_documento TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Rol (
    id_rol SERIAL PRIMARY KEY,
    tipo_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion_rol VARCHAR(255),

    fecha_creacion_rol TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion_rol TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion_categoria TEXT,

    fecha_creacion_categoria TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_categoria TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Estado_servicio (
    id_estado_servicio SERIAL PRIMARY KEY,
    nombre_estado_servicio VARCHAR(50) NOT NULL UNIQUE,
    descripcion_estado_servicio VARCHAR(255),

    fecha_creacion_estado_servicio TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_estado_servicio TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Restriccion_edad (
    id_restriccion_edad SERIAL PRIMARY KEY,
    nombre_restriccion_edad VARCHAR(100) NOT NULL UNIQUE,
    descripcion_restriccion_edad VARCHAR(255),

    fecha_creacion_restriccion_edad TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_restriccion_edad TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Estado_reserva (
    id_estado_reserva SERIAL PRIMARY KEY,
    nombre_estado_reserva VARCHAR(50) NOT NULL UNIQUE,
    descripcion_estado_reserva VARCHAR(255),

    fecha_creacion_estado_reserva TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_estado_reserva TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Mensaje_estado (
    id_mensaje_estado SERIAL PRIMARY KEY,
    nombre_mensaje_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion_mensaje_estado VARCHAR(255),

    fecha_creacion_mensaje_estado TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_mensaje_estado TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- USUARIO
-- ============================================================

CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,

    id_rol_usuario INT NOT NULL,
    id_genero_usuario INT,
    id_tipo_documento_usuario INT,

    nombre_usuario VARCHAR(100) NOT NULL,
    apellido_usuario VARCHAR(100) NOT NULL,

    fecha_nacimiento_usuario DATE,

    numero_documento_usuario VARCHAR(30) UNIQUE,
    correo_usuario VARCHAR(150) NOT NULL UNIQUE,
    username_usuario VARCHAR(80) NOT NULL UNIQUE,

    contrasena_usuario VARCHAR(255) NOT NULL,

    fecha_creacion_usuario TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion_usuario TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol_usuario)
        REFERENCES Rol(id_rol),

    CONSTRAINT fk_usuario_genero
        FOREIGN KEY (id_genero_usuario)
        REFERENCES Genero(id_genero),

    CONSTRAINT fk_usuario_tipodoc
        FOREIGN KEY (id_tipo_documento_usuario)
        REFERENCES Tipo_documento(id_tipo_documento)
);

-- ============================================================
-- IMAGEN USUARIO
-- ============================================================

CREATE TABLE Imagen_usuario (
    id_imagen_usuario SERIAL PRIMARY KEY,

    url_imagen_usuario TEXT NOT NULL,
    descripcion_imagen_usuario VARCHAR(255),

    id_usuario INT NOT NULL,

    fecha_creacion_imagen_usuario TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_imagen_usuario TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_imagen_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE
);

-- ============================================================
-- TELÉFONOS
-- ============================================================

CREATE TABLE Telefono (
    id_telefono SERIAL PRIMARY KEY,

    numero_telefono VARCHAR(20) NOT NULL,

    fecha_creacion_telefono TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_telefono TIMESTAMP DEFAULT NOW()
);

CREATE TABLE UsuarioTelefono (
    id_usuario_telefono SERIAL PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_telefono INT NOT NULL,

    CONSTRAINT fk_usuariotelefono_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuariotelefono_telefono
        FOREIGN KEY (id_telefono)
        REFERENCES Telefono(id_telefono)
        ON DELETE CASCADE,

    CONSTRAINT uq_usuario_telefono
        UNIQUE(id_usuario, id_telefono)
);

-- ============================================================
-- NEGOCIO
-- ============================================================

CREATE TABLE Negocio (
    id_negocio SERIAL PRIMARY KEY,

    id_usuario_propietario INT NOT NULL,

    nombre_negocio VARCHAR(150) NOT NULL,
    descripcion_negocio TEXT,

    id_ubicacion INT,

    facebook_negocio VARCHAR(255),
    instagram_negocio VARCHAR(255),
    tiktok_negocio VARCHAR(255),
    pagina_web_negocio VARCHAR(255),

    fecha_creacion_negocio TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_negocio TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_negocio_ubicacion
        FOREIGN KEY (id_ubicacion)
        REFERENCES Ubicacion(id_ubicacion),

    CONSTRAINT fk_negocio_propietario
        FOREIGN KEY (id_usuario_propietario)
        REFERENCES Usuario(id_usuario)
);

CREATE TABLE NegocioTelefono (
    id_negocio_telefono SERIAL PRIMARY KEY,

    id_negocio INT NOT NULL,
    id_telefono INT NOT NULL,

    CONSTRAINT fk_negociotelefono_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES Negocio(id_negocio)
        ON DELETE CASCADE,

    CONSTRAINT fk_negociotelefono_telefono
        FOREIGN KEY (id_telefono)
        REFERENCES Telefono(id_telefono)
        ON DELETE CASCADE,

    CONSTRAINT uq_negocio_telefono
        UNIQUE(id_negocio, id_telefono)
);

-- ============================================================
-- SERVICIO
-- ============================================================

CREATE TABLE Servicio (
    id_servicio SERIAL PRIMARY KEY,

    nombre_servicio VARCHAR(200) NOT NULL,
    descripcion_servicio TEXT,

    precio_servicio NUMERIC(12,2) NOT NULL DEFAULT 0,

    id_categoria_servicio INT NOT NULL,
    id_estado_servicio INT NOT NULL,
    id_restriccion_edad_servicio INT,
    id_negocio INT NOT NULL,

    fecha_creacion_servicio TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_servicio TIMESTAMP DEFAULT NOW(),

    CONSTRAINT chk_precio_servicio
        CHECK (precio_servicio >= 0),

    CONSTRAINT fk_servicio_categoria
        FOREIGN KEY (id_categoria_servicio)
        REFERENCES Categoria(id_categoria),

    CONSTRAINT fk_servicio_estado
        FOREIGN KEY (id_estado_servicio)
        REFERENCES Estado_servicio(id_estado_servicio),

    CONSTRAINT fk_servicio_restriccion
        FOREIGN KEY (id_restriccion_edad_servicio)
        REFERENCES Restriccion_edad(id_restriccion_edad),

    CONSTRAINT fk_servicio_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES Negocio(id_negocio)
        ON DELETE CASCADE
);

CREATE TABLE Imagen_servicio (
    id_imagen_servicio SERIAL PRIMARY KEY,

    url_imagen_servicio TEXT NOT NULL,
    descripcion_imagen_servicio VARCHAR(255),

    id_servicio INT NOT NULL,

    fecha_creacion_imagen_servicio TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_imagen_servicio TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_imagen_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES Servicio(id_servicio)
        ON DELETE CASCADE
);

-- ============================================================
-- RESERVA
-- ============================================================

CREATE TABLE Reserva (
    id_reserva SERIAL PRIMARY KEY,

    id_servicio INT NOT NULL,

    fecha_creacion_reserva TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_reserva TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_reserva_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES Servicio(id_servicio)
        ON DELETE CASCADE
);

CREATE TABLE Reserva_detalle (
    id_reserva_detalle SERIAL PRIMARY KEY,

    id_reserva INT NOT NULL,
    id_usuario INT NOT NULL,
    cantidad_reserva INT NOT NULL DEFAULT 1,
    id_estado_reserva INT NOT NULL,

    CONSTRAINT chk_cantidad_reserva
        CHECK (cantidad_reserva > 0),

    CONSTRAINT fk_reservadetalle_reserva
        FOREIGN KEY (id_reserva)
        REFERENCES Reserva(id_reserva)
        ON DELETE CASCADE,

    CONSTRAINT fk_reservadetalle_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id_usuario),

    CONSTRAINT fk_reservadetalle_estadoreserva
        FOREIGN KEY (id_estado_reserva)
        REFERENCES Estado_reserva(id_estado_reserva)
);

-- ============================================================
-- MENSAJES
-- ============================================================

CREATE TABLE Mensaje (
    id_mensaje SERIAL PRIMARY KEY,

    contenido_mensaje TEXT NOT NULL,

    fecha_envio_mensaje TIMESTAMP DEFAULT NOW(),

    id_estado_mensaje INT NOT NULL,
    id_usuario_emisor INT NOT NULL,
    id_usuario_receptor INT NOT NULL,

    CONSTRAINT fk_mensaje_estado
        FOREIGN KEY (id_estado_mensaje)
        REFERENCES Mensaje_estado(id_mensaje_estado),

    CONSTRAINT fk_mensaje_emisor
        FOREIGN KEY (id_usuario_emisor)
        REFERENCES Usuario(id_usuario),

    CONSTRAINT fk_mensaje_receptor
        FOREIGN KEY (id_usuario_receptor)
        REFERENCES Usuario(id_usuario)
);

-- ============================================================
-- RESEÑAS
-- ============================================================

CREATE TABLE Resena_negocio (
    id_resena_negocio SERIAL PRIMARY KEY,

    id_negocio_resena INT NOT NULL,
    id_usuario_resena INT NOT NULL,

    contenido_resena_negocio TEXT,

    puntuacion_resena_negocio SMALLINT
        CHECK (puntuacion_resena_negocio BETWEEN 1 AND 5),

    fecha_creacion_resena_negocio TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_resena_negocio TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_resenanegocio_negocio
        FOREIGN KEY (id_negocio_resena)
        REFERENCES Negocio(id_negocio)
        ON DELETE CASCADE,

    CONSTRAINT fk_resenanegocio_usuario
        FOREIGN KEY (id_usuario_resena)
        REFERENCES Usuario(id_usuario)
);

CREATE TABLE Resena_servicio (
    id_resena_servicio SERIAL PRIMARY KEY,

    id_servicio_resena INT NOT NULL,
    id_usuario_resena INT NOT NULL,

    contenido_resena_servicio TEXT,

    puntuacion_resena_servicio SMALLINT
        CHECK (puntuacion_resena_servicio BETWEEN 1 AND 5),

    fecha_creacion_resena_servicio TIMESTAMP DEFAULT NOW(),
    fecha_modificacion_resena_servicio TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_resenaservicio_servicio
        FOREIGN KEY (id_servicio_resena)
        REFERENCES Servicio(id_servicio)
        ON DELETE CASCADE,

    CONSTRAINT fk_resenaservicio_usuario
        FOREIGN KEY (id_usuario_resena)
        REFERENCES Usuario(id_usuario)
);

-- ============================================================
-- FAVORITOS
-- ============================================================

CREATE TABLE Servicio_favoritos_usuarios (
    id_servicio_favorito SERIAL PRIMARY KEY,

    id_usuario_favorito INT NOT NULL,
    id_servicio INT NOT NULL,

    fecha_creacion_servicio_favorito TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_serviciofavorito_usuario
        FOREIGN KEY (id_usuario_favorito)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_serviciofavorito_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES Servicio(id_servicio)
        ON DELETE CASCADE,

    CONSTRAINT uq_servicio_favorito
        UNIQUE(id_usuario_favorito, id_servicio)
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_usuario_correo
    ON Usuario(correo_usuario);

CREATE INDEX idx_usuario_username
    ON Usuario(username_usuario);

CREATE INDEX idx_usuario_rol
    ON Usuario(id_rol_usuario);

CREATE INDEX idx_servicio_categoria
    ON Servicio(id_categoria_servicio);

CREATE INDEX idx_servicio_estado
    ON Servicio(id_estado_servicio);

CREATE INDEX idx_servicio_negocio
    ON Servicio(id_negocio);

CREATE INDEX idx_reservadetalle_usuario
    ON Reserva_detalle(id_usuario);

CREATE INDEX idx_reservadetalle_estado
    ON Reserva_detalle(id_estado_reserva);

CREATE INDEX idx_mensaje_emisor
    ON Mensaje(id_usuario_emisor);

CREATE INDEX idx_mensaje_receptor
    ON Mensaje(id_usuario_receptor);

CREATE INDEX idx_resena_negocio
    ON Resena_negocio(id_negocio_resena);

CREATE INDEX idx_resena_servicio
    ON Resena_servicio(id_servicio_resena); 