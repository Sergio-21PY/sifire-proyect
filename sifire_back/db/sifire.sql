-- ============================================================
-- SIFIRE -- Base de datos completa (CORREGIDA)
-- Motor: MySQL 8 | Codificación: UTF-8
-- Alineado con los modelos Java de la rama dev
-- ============================================================

DROP DATABASE IF EXISTS sifire;
CREATE DATABASE sifire
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sifire;

-- ============================================================
-- TABLAS
-- ============================================================

-- ms-usuarios: alineado con Usuario.java
-- tipo = enum TipoUsuario (CIUDADANO|BRIGADISTA|FUNCIONARIO|ADMINISTRADOR)
-- telefono = NULL (opcional, no rompe si el frontend no lo manda)
CREATE TABLE usuario (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(100),
    nombre    VARCHAR(150) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    telefono  VARCHAR(20)  NULL,           -- nullable=true para no romper registro
    tipo      VARCHAR(30)  NOT NULL
        COMMENT 'CIUDADANO | BRIGADISTA | FUNCIONARIO | ADMINISTRADOR',
    activo    TINYINT(1)   NOT NULL DEFAULT 1
);

-- ms-monitoreo: zonas de riesgo
CREATE TABLE zona_riesgo (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    nivel_riesgo VARCHAR(20)  NOT NULL
        COMMENT 'BAJO | MEDIO | ALTO | CRITICO',
    coordenadas  TEXT
        COMMENT 'GeoJSON o lista de puntos lat/lng',
    activo       TINYINT(1)   NOT NULL DEFAULT 1
);

-- ms-monitoreo: rutas de evacuación
CREATE TABLE ruta_evacuacion (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    trazado     TEXT
        COMMENT 'Coordenadas de la ruta como JSON o texto',
    descripcion VARCHAR(500),
    activo      TINYINT(1)   NOT NULL DEFAULT 1
);

-- ms-monitoreo: brigadas
CREATE TABLE brigada (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(150) NOT NULL,
    tipo     VARCHAR(20)  NOT NULL
        COMMENT 'FORESTAL | URBANA | MIXTA',
    estado   VARCHAR(20)  NOT NULL
        COMMENT 'DISPONIBLE | EN_CAMINO | INTERVINIENDO | INACTIVA',
    latitud  DOUBLE,
    longitud DOUBLE
);

-- ms-reportes: reportes de incendio
CREATE TABLE REPORTE_INCENDIO (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id          BIGINT       NOT NULL,
    titulo              VARCHAR(255) NOT NULL,
    descripcion         TEXT         NOT NULL,
    latitud             DOUBLE       NOT NULL,
    longitud            DOUBLE       NOT NULL,
    nivel_riesgo        VARCHAR(20)  NOT NULL
        COMMENT 'BAJO | MEDIO | ALTO | CRITICO',
    estado              VARCHAR(20)  NOT NULL
        COMMENT 'PENDIENTE | EN_PROCESO | RESUELTO | DESCARTADO',
    tipo_reportante     VARCHAR(20)  NOT NULL
        COMMENT 'CIUDADANO | BRIGADISTA | FUNCIONARIO',
    fecha_creacion      DATETIME,
    fecha_actualizacion DATETIME,
    CONSTRAINT fk_reporte_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- ms-reportes: historial de cambios de estado
CREATE TABLE HISTORIAL_REPORTE (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id      BIGINT      NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo    VARCHAR(20) NOT NULL,
    usuario_id      BIGINT,
    observacion     VARCHAR(500),
    fecha_cambio    DATETIME,
    CONSTRAINT fk_historial_reporte  FOREIGN KEY (reporte_id)  REFERENCES REPORTE_INCENDIO(id),
    CONSTRAINT fk_historial_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuario(id)
);

-- ms-reportes: multimedia adjunta
CREATE TABLE REPORTE_MULTIMEDIA (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id   BIGINT       NOT NULL,
    url_archivo  VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(20)
        COMMENT 'FOTO | VIDEO | AUDIO',
    fecha_subida DATETIME,
    CONSTRAINT fk_multimedia_reporte FOREIGN KEY (reporte_id) REFERENCES REPORTE_INCENDIO(id)
);

-- ms-monitoreo: asignaciones brigada-reporte
CREATE TABLE ASIGNACION_BRIGADA (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id       BIGINT NOT NULL,
    brigada_id       BIGINT NOT NULL,
    fecha_asignacion DATETIME,
    fecha_fin        DATETIME,
    CONSTRAINT fk_asig_reporte FOREIGN KEY (reporte_id) REFERENCES REPORTE_INCENDIO(id),
    CONSTRAINT fk_asig_brigada FOREIGN KEY (brigada_id) REFERENCES brigada(id)
);

-- ms-alertas: alertas a la comunidad
CREATE TABLE alerta (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id  BIGINT       NULL
        COMMENT 'NULL si la alerta es manual',
    titulo      VARCHAR(200),
    mensaje     TEXT,
    canal       VARCHAR(10)
        COMMENT 'EMAIL | SMS | PUSH',
    tipo        VARCHAR(100),
    descripcion VARCHAR(500),
    latitud     DOUBLE,
    longitud    DOUBLE,
    estado      VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
        COMMENT 'PENDIENTE | ENVIADA | FALLIDA | ASIGNADA',
    created_at  DATETIME,
    CONSTRAINT fk_alerta_reporte FOREIGN KEY (reporte_id) REFERENCES REPORTE_INCENDIO(id)
);

-- ms-alertas: brigadistas asignados a una alerta
CREATE TABLE alerta_asignaciones (
    alerta_id  BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    PRIMARY KEY (alerta_id, usuario_id),
    CONSTRAINT fk_asig_alerta   FOREIGN KEY (alerta_id)  REFERENCES alerta(id),
    CONSTRAINT fk_asig_usu_asg  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================

-- Usuarios: campo "tipo" (no "rol"), telefono NULL permitido
INSERT INTO usuario (username, nombre, email, password, telefono, tipo, activo) VALUES
    ('admin.sifire',  'Administrador SIFIRE', 'admin@sifire.cl',        '1234', '+56900000001', 'ADMINISTRADOR', 1),
    ('juan.perez',    'Juan Pérez',           'juan.perez@sifire.cl',   '1234', '+56900000002', 'FUNCIONARIO',   1),
    ('carlos.rojas',  'Carlos Rojas',         'carlos.rojas@sifire.cl', '1234', '+56900000003', 'BRIGADISTA',    1),
    ('maria.lopez',   'María López',          'maria.lopez@sifire.cl',  '1234', '+56900000004', 'BRIGADISTA',    1),
    ('pedro.silva',   'Pedro Silva',          'pedro.silva@sifire.cl',  '1234', '+56900000005', 'CIUDADANO',     1),
    ('ana.torres',    'Ana Torres',           'ana.torres@sifire.cl',   '1234', '+56900000006', 'CIUDADANO',     1);

-- Zonas de riesgo
INSERT INTO zona_riesgo (nombre, nivel_riesgo, coordenadas, activo) VALUES
    ('Sector Duoc - Zona Industrial', 'ALTO',
     '[[-33.4960,-70.6180],[-33.4980,-70.6180],[-33.4980,-70.6150],[-33.4960,-70.6150]]', 1),
    ('Sector Parque Felipe Camiroaga', 'MEDIO',
     '[[-33.5000,-70.6200],[-33.5020,-70.6200],[-33.5020,-70.6160],[-33.5000,-70.6160]]', 1),
    ('Sector Walker Martínez', 'BAJO',
     '[[-33.4940,-70.6140],[-33.4960,-70.6140],[-33.4960,-70.6110],[-33.4940,-70.6110]]', 1);

-- Rutas de evacuación (trazado en formato [[lat,lng]] requerido por Leaflet)
-- Sector San Joaquín / Duoc UC como punto de referencia
INSERT INTO ruta_evacuacion (nombre, trazado, descripcion, activo) VALUES
    ('Ruta Vicuña Mackenna Norte',
     '[[-33.4969,-70.6168],[-33.4956,-70.6147],[-33.4930,-70.6130],[-33.4900,-70.6110]]',
     'Evacuación por Av. Vicuña Mackenna hacia el norte', 1),
    ('Ruta Walker Martínez Oriente',
     '[[-33.4969,-70.6168],[-33.4975,-70.6140],[-33.4980,-70.6110],[-33.4990,-70.6080]]',
     'Evacuación por Walker Martínez hacia el oriente', 1);

-- Brigadas ubicadas en sector San Joaquín y alrededores
INSERT INTO brigada (nombre, tipo, estado, latitud, longitud) VALUES
    ('Brigada San Joaquín',  'URBANA',   'DISPONIBLE',    -33.4969, -70.6168),
    ('Brigada Vicuña Mac.',  'FORESTAL', 'DISPONIBLE',    -33.4990, -70.6130),
    ('Brigada Sur',          'MIXTA',    'DISPONIBLE',    -33.5010, -70.6180),
    ('Brigada La Granja',    'URBANA',   'INACTIVA',      -33.5100, -70.6200),
    ('Brigada San Ramón',    'FORESTAL', 'DISPONIBLE',    -33.4920, -70.6100);

-- Reportes de incendio
INSERT INTO REPORTE_INCENDIO
    (usuario_id, titulo, descripcion, latitud, longitud, nivel_riesgo, estado, tipo_reportante, fecha_creacion, fecha_actualizacion)
VALUES
    (5, 'Incendio sector Duoc San Joaquín',
        'Veo humo saliendo desde el sector industrial frente al campus. Lleva unos 10 minutos.',
        -33.4969, -70.6168, 'MEDIO', 'PENDIENTE', 'CIUDADANO',
        NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),

    (3, 'Foco activo Walker Martínez',
        'Foco confirmado en Walker Martínez, viento sur moderado, peligro de expansión.',
        -33.4975, -70.6140, 'ALTO', 'EN_PROCESO', 'BRIGADISTA',
        NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 3 HOUR),

    (2, 'Incendio crítico sector industrial San Joaquín',
        'Incendio de gran magnitud en bodega industrial, riesgo de expansión a sectores habitados.',
        -33.4980, -70.6155, 'CRITICO', 'EN_PROCESO', 'FUNCIONARIO',
        NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 6 HOUR),

    (6, 'Quema de pastizales Parque Camiroaga',
        'Pequeño foco de quema de pastizales en el parque, controlado por vecinos.',
        -33.5010, -70.6180, 'BAJO', 'RESUELTO', 'CIUDADANO',
        NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY);

-- Historial de cambios de estado
INSERT INTO HISTORIAL_REPORTE (reporte_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
    (2, 'PENDIENTE',  'EN_PROCESO', 2, 'Brigada Andes 1 asignada al sector',             NOW() - INTERVAL 4 HOUR),
    (3, 'PENDIENTE',  'EN_PROCESO', 2, 'Activación de protocolo máximo por funcionario', NOW() - INTERVAL 7 HOUR),
    (4, 'PENDIENTE',  'EN_PROCESO', 2, 'Brigada enviada al sector',                      NOW() - INTERVAL 2 DAY),
    (4, 'EN_PROCESO', 'RESUELTO',   2, 'Foco extinguido, zona despejada',                NOW() - INTERVAL 1 DAY);

-- Asignaciones brigada-reporte
INSERT INTO ASIGNACION_BRIGADA (reporte_id, brigada_id, fecha_asignacion, fecha_fin) VALUES
    (2, 1, NOW() - INTERVAL 4 HOUR, NULL),
    (3, 2, NOW() - INTERVAL 6 HOUR, NULL);

-- Brigadas asignadas pasan a EN_CAMINO automáticamente
UPDATE brigada SET estado = 'EN_CAMINO' WHERE id IN (1, 2);

-- Alertas
INSERT INTO alerta (reporte_id, titulo, mensaje, canal, tipo, descripcion, latitud, longitud, estado, created_at) VALUES
    (1, 'Alerta: Posible incendio Cerro San Cristóbal',
        'Se ha reportado un posible foco en Cerro San Cristóbal. Evite el sector.',
        'PUSH', 'AUTOMATICA', 'Generada automáticamente por reporte ciudadano',
        -33.4150, -70.6300, 'ENVIADA', NOW() - INTERVAL 2 HOUR),

    (3, 'ALERTA CRÍTICA: Incendio Las Vizcachas',
        'Incendio de alta peligrosidad. Se ordena evacuación preventiva.',
        'SMS', 'CRITICA', 'Emitida por funcionario tras activación de protocolo',
        -33.5890, -70.4720, 'ASIGNADA', NOW() - INTERVAL 7 HOUR),

    (NULL, 'Aviso preventivo: condiciones de riesgo alto',
        'Altas temperaturas y viento sur. No encender fuego al aire libre.',
        'EMAIL', 'PREVENTIVA', 'Alerta manual emitida por funcionario municipal',
        -33.4500, -70.5800, 'ENVIADA', NOW() - INTERVAL 1 HOUR);

-- Brigadistas asignados a la alerta crítica
INSERT INTO alerta_asignaciones (alerta_id, usuario_id) VALUES
    (2, 3),
    (2, 4);

-- ============================================================
-- VERIFICACIÓN RÁPIDA (descomentar para ejecutar)
-- ============================================================
-- SELECT * FROM usuario;
-- SELECT * FROM brigada;
-- SELECT * FROM zona_riesgo;
-- SELECT * FROM REPORTE_INCENDIO;
-- SELECT * FROM HISTORIAL_REPORTE;
-- SELECT * FROM ASIGNACION_BRIGADA;
-- SELECT * FROM alerta;
-- SELECT * FROM alerta_asignaciones;