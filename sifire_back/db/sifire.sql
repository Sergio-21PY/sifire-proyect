-- ============================================================
-- SIFIRE -- Base de datos completa
-- Motor: MySQL 8
-- Codificación: UTF-8
-- Ejecutar en XAMPP / phpMyAdmin antes de levantar el proyecto
-- ============================================================

-- 1. Crear y seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS sifire
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sifire;

-- ============================================================
-- 2. TABLAS
-- ============================================================

-- ms-usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    nombre     VARCHAR(150),
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    rol        VARCHAR(30)  NOT NULL
        COMMENT 'CIUDADANO | BRIGADISTA | FUNCIONARIO | ADMINISTRADOR'
);

-- ms-monitoreo: zonas de riesgo
CREATE TABLE IF NOT EXISTS zona_riesgo (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    nivel_riesgo VARCHAR(20)  NOT NULL
        COMMENT 'BAJO | MEDIO | ALTO | CRITICO',
    coordenadas  TEXT
        COMMENT 'GeoJSON o lista de puntos lat/lng',
    activo       TINYINT(1)   NOT NULL DEFAULT 1
);

-- ms-monitoreo: rutas de evacuación
CREATE TABLE IF NOT EXISTS ruta_evacuacion (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    trazado     TEXT
        COMMENT 'Coordenadas de la ruta como JSON o texto',
    descripcion VARCHAR(500),
    activo      TINYINT(1)   NOT NULL DEFAULT 1
);

-- ms-monitoreo: brigadas
CREATE TABLE IF NOT EXISTS brigada (
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
CREATE TABLE IF NOT EXISTS REPORTE_INCENDIO (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id          BIGINT       NOT NULL,
    titulo              VARCHAR(255) NOT NULL,
    descripcion         TEXT         NOT NULL,
    latitud             DOUBLE       NOT NULL,
    longitud            DOUBLE       NOT NULL,
    nivel_riesgo        VARCHAR(20)  NOT NULL
        COMMENT 'Asignado por Factory Method: BAJO | MEDIO | ALTO | CRITICO',
    estado              VARCHAR(20)  NOT NULL
        COMMENT 'PENDIENTE | EN_PROCESO | RESUELTO | DESCARTADO',
    tipo_reportante     VARCHAR(20)  NOT NULL
        COMMENT 'CIUDADANO | BRIGADISTA | FUNCIONARIO',
    fecha_creacion      DATETIME,
    fecha_actualizacion DATETIME
);

-- ms-reportes: historial de cambios de estado
CREATE TABLE IF NOT EXISTS HISTORIAL_REPORTE (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id      BIGINT      NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo    VARCHAR(20) NOT NULL,
    usuario_id      BIGINT,
    observacion     VARCHAR(500),
    fecha_cambio    DATETIME
);

-- ms-reportes: multimedia adjunta
CREATE TABLE IF NOT EXISTS REPORTE_MULTIMEDIA (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id   BIGINT       NOT NULL,
    url_archivo  VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(20)
        COMMENT 'FOTO | VIDEO | AUDIO',
    fecha_subida DATETIME
);

-- ms-monitoreo: asignaciones brigada-reporte
CREATE TABLE IF NOT EXISTS ASIGNACION_BRIGADA (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id       BIGINT NOT NULL,
    brigada_id       BIGINT NOT NULL,
    fecha_asignacion DATETIME,
    fecha_fin        DATETIME,
    CONSTRAINT fk_asig_brigada FOREIGN KEY (brigada_id) REFERENCES brigada(id)
);

-- ms-alertas: alertas a la comunidad
CREATE TABLE IF NOT EXISTS alerta (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id  BIGINT
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
    created_at  DATETIME
);

-- ms-alertas: brigadistas asignados a una alerta
CREATE TABLE IF NOT EXISTS alerta_asignaciones (
    alerta_id  BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    PRIMARY KEY (alerta_id, usuario_id),
    CONSTRAINT fk_asig_alerta FOREIGN KEY (alerta_id) REFERENCES alerta(id)
);

-- ============================================================
-- 3. DATOS DE PRUEBA
-- Contraseña de todos los usuarios: 1234
-- ============================================================

-- Usuarios (uno por rol)
INSERT INTO usuario (username, nombre, email, password, rol) VALUES
    ('admin.sifire',  'Administrador SIFIRE', 'admin@sifire.cl',        '1234', 'ADMINISTRADOR'),
    ('juan.perez',    'Juan Pérez',           'juan.perez@sifire.cl',   '1234', 'FUNCIONARIO'),
    ('carlos.rojas',  'Carlos Rojas',         'carlos.rojas@sifire.cl', '1234', 'BRIGADISTA'),
    ('maria.lopez',   'María López',          'maria.lopez@sifire.cl',  '1234', 'BRIGADISTA'),
    ('pedro.silva',   'Pedro Silva',          'pedro.silva@sifire.cl',  '1234', 'CIUDADANO'),
    ('ana.torres',    'Ana Torres',           'ana.torres@sifire.cl',   '1234', 'CIUDADANO');

-- Zonas de riesgo (Santiago Oriente)
INSERT INTO zona_riesgo (nombre, nivel_riesgo, coordenadas, activo) VALUES
    ('Cerro San Cristóbal Norte', 'ALTO',    '{"lat":-33.415,"lng":-70.630}', 1),
    ('Sector Las Vizcachas',      'CRITICO', '{"lat":-33.589,"lng":-70.472}', 1),
    ('Cerro Chena',               'MEDIO',   '{"lat":-33.584,"lng":-70.672}', 1),
    ('Quebrada de Macul',         'ALTO',    '{"lat":-33.490,"lng":-70.558}', 1),
    ('Sector Peñalolén Alto',     'MEDIO',   '{"lat":-33.476,"lng":-70.537}', 0);

-- Rutas de evacuación
INSERT INTO ruta_evacuacion (nombre, trazado, descripcion, activo) VALUES
    ('Ruta Evacuación Norte',
     '[{"lat":-33.415,"lng":-70.630},{"lat":-33.400,"lng":-70.620}]',
     'Evacuar hacia Av. Bellavista hacia el norte', 1),
    ('Ruta Evacuación Sur',
     '[{"lat":-33.490,"lng":-70.558},{"lat":-33.510,"lng":-70.560}]',
     'Evacuar por Av. Tobalaba hacia el sur', 1),
    ('Ruta Emergencia Centro',
     '[{"lat":-33.450,"lng":-70.600},{"lat":-33.445,"lng":-70.580}]',
     'Ruta alternativa por Av. Irarrázaval', 0);

-- Brigadas
INSERT INTO brigada (nombre, tipo, estado, latitud, longitud) VALUES
    ('Brigada Andes 1',    'FORESTAL', 'DISPONIBLE',    -33.4150, -70.6300),
    ('Brigada Andes 2',    'FORESTAL', 'DISPONIBLE',    -33.4200, -70.6250),
    ('Brigada Urbana Sur', 'URBANA',   'DISPONIBLE',    -33.5100, -70.6500),
    ('Brigada Mixta Este', 'MIXTA',    'INACTIVA',      -33.4800, -70.5400),
    ('Brigada Peñalolén',  'FORESTAL', 'DISPONIBLE',    -33.4760, -70.5370);

-- Reportes de incendio (4 reportes para mostrar el flujo completo)
INSERT INTO REPORTE_INCENDIO
    (usuario_id, titulo, descripcion, latitud, longitud, nivel_riesgo, estado, tipo_reportante, fecha_creacion, fecha_actualizacion)
VALUES
    -- Ciudadano → PENDIENTE, nivel MEDIO (Factory CIUDADANO)
    (5, 'Incendio en Cerro San Cristóbal',
        'Veo humo negro saliendo de la ladera norte del cerro, lleva unos 10 minutos.',
        -33.4150, -70.6300, 'MEDIO', 'PENDIENTE', 'CIUDADANO',
        NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),

    -- Brigadista → EN_PROCESO, nivel ALTO (Factory BRIGADISTA)
    (3, 'Foco activo Quebrada de Macul',
        'Foco confirmado en la quebrada, viento sur moderado, peligro de expansión.',
        -33.4900, -70.5580, 'ALTO', 'EN_PROCESO', 'BRIGADISTA',
        NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 3 HOUR),

    -- Funcionario → EN_PROCESO, nivel CRITICO (Factory FUNCIONARIO)
    (2, 'Incendio crítico Sector Las Vizcachas',
        'Incendio de gran magnitud con riesgo de expansión a sectores habitados. Se activa protocolo máximo.',
        -33.5890, -70.4720, 'CRITICO', 'EN_PROCESO', 'FUNCIONARIO',
        NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 6 HOUR),

    -- Ya resuelto (para mostrar historial y ciclo completo)
    (6, 'Quema de pastizales Cerro Chena',
        'Pequeño foco de quema de pastizales, controlado por vecinos.',
        -33.5840, -70.6720, 'BAJO', 'RESUELTO', 'CIUDADANO',
        NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY);

-- Historial de cambios de estado
INSERT INTO HISTORIAL_REPORTE (reporte_id, estado_anterior, estado_nuevo, usuario_id, observacion, fecha_cambio) VALUES
    (2, 'PENDIENTE',  'EN_PROCESO', 2, 'Brigada Andes 1 asignada al sector',             NOW() - INTERVAL 4 HOUR),
    (3, 'PENDIENTE',  'EN_PROCESO', 2, 'Activación de protocolo máximo por funcionario', NOW() - INTERVAL 7 HOUR),
    (4, 'PENDIENTE',  'EN_PROCESO', 2, 'Brigada enviada al sector',                      NOW() - INTERVAL 2 DAY),
    (4, 'EN_PROCESO', 'RESUELTO',   2, 'Foco extinguido, zona despejada',                NOW() - INTERVAL 1 DAY);

-- Asignaciones de brigadas a reportes activos
INSERT INTO ASIGNACION_BRIGADA (reporte_id, brigada_id, fecha_asignacion, fecha_fin) VALUES
    (2, 1, NOW() - INTERVAL 4 HOUR, NULL),
    (3, 2, NOW() - INTERVAL 6 HOUR, NULL);

-- Actualizar estado de brigadas que están interviniendo
UPDATE brigada SET estado = 'INTERVINIENDO' WHERE id IN (1, 2);

-- Alertas
INSERT INTO alerta (reporte_id, titulo, mensaje, canal, tipo, descripcion, latitud, longitud, estado, created_at) VALUES
    -- Automática (Observer al crear reporte 1)
    (1, 'Alerta: Posible incendio Cerro San Cristóbal',
        'Se ha reportado un posible foco en Cerro San Cristóbal. Evite el sector y siga instrucciones de Carabineros.',
        'PUSH', 'AUTOMATICA', 'Generada automáticamente por reporte ciudadano',
        -33.4150, -70.6300, 'ENVIADA', NOW() - INTERVAL 2 HOUR),

    -- Crítica con brigadistas asignados (reporte 3)
    (3, 'ALERTA CRÍTICA: Incendio Las Vizcachas',
        'Incendio de alta peligrosidad en sector Las Vizcachas. Se ordena evacuación preventiva. Diríjase a los puntos de encuentro habilitados.',
        'SMS', 'CRITICA', 'Emitida por funcionario tras activación de protocolo',
        -33.5890, -70.4720, 'ASIGNADA', NOW() - INTERVAL 7 HOUR),

    -- Manual preventiva (sin reporte asociado)
    (NULL, 'Aviso preventivo: condiciones de riesgo alto',
        'Altas temperaturas y viento sur. Se declara alerta preventiva en zona oriente. No encender fuego al aire libre.',
        'EMAIL', 'PREVENTIVA', 'Alerta manual emitida por funcionario municipal',
        -33.4500, -70.5800, 'ENVIADA', NOW() - INTERVAL 1 HOUR);

-- Asignar brigadistas a la alerta crítica
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