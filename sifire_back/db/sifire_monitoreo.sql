-- sifire_monitoreo.sql - BD del microservicio ms-monitoreo
-- reporte_id referencia logica a sifire_reportes, sin FK fisica
CREATE DATABASE IF NOT EXISTS sifire_monitoreo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sifire_monitoreo;
CREATE TABLE IF NOT EXISTS zona_riesgo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nivel_riesgo VARCHAR(20) NOT NULL COMMENT 'BAJO | MEDIO | ALTO | CRITICO',
    coordenadas TEXT COMMENT 'Array JSON [[lat,lng],...]',
    activo TINYINT(1) NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS ruta_evacuacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    trazado TEXT COMMENT 'Array JSON [[lat,lng],...]',
    descripcion VARCHAR(500),
    activo TINYINT(1) NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS brigada (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(20) NOT NULL COMMENT 'FORESTAL | URBANA | MIXTA',
    estado VARCHAR(20) NOT NULL COMMENT 'DISPONIBLE | EN_CAMINO | INTERVINIENDO | INACTIVA',
    latitud DOUBLE,
    longitud DOUBLE
);
CREATE TABLE IF NOT EXISTS ASIGNACION_BRIGADA (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id BIGINT NOT NULL COMMENT 'Ref logica a sifire_reportes.REPORTE_INCENDIO.id',
    brigada_id BIGINT NOT NULL,
    fecha_asignacion DATETIME,
    fecha_fin DATETIME,
    CONSTRAINT fk_asig_brigada FOREIGN KEY (brigada_id) REFERENCES brigada(id)
);
INSERT INTO zona_riesgo (nombre, nivel_riesgo, coordenadas, activo) VALUES
    ('Sector Duoc - Zona Industrial', 'ALTO', '[[-33.4960,-70.6180],[-33.4980,-70.6180],[-33.4980,-70.6150],[-33.4960,-70.6150]]', 1),
    ('Sector Parque Felipe Camiroaga', 'MEDIO', '[[-33.5000,-70.6200],[-33.5020,-70.6200],[-33.5020,-70.6160],[-33.5000,-70.6160]]', 1),
    ('Sector Walker Martinez', 'BAJO', '[[-33.4940,-70.6140],[-33.4960,-70.6140],[-33.4960,-70.6110],[-33.4940,-70.6110]]', 1);
INSERT INTO ruta_evacuacion (nombre, trazado, descripcion, activo) VALUES
    ('Ruta Vicuna Mackenna Norte', '[[-33.4969,-70.6168],[-33.4956,-70.6147],[-33.4930,-70.6130],[-33.4900,-70.6110]]', 'Evacuacion por Av. Vicuna Mackenna hacia el norte', 1),
    ('Ruta Walker Martinez Oriente', '[[-33.4969,-70.6168],[-33.4975,-70.6140],[-33.4980,-70.6110],[-33.4990,-70.6080]]', 'Evacuacion por Walker Martinez hacia el oriente', 1);
INSERT INTO brigada (nombre, tipo, estado, latitud, longitud) VALUES
    ('Brigada San Joaquin', 'URBANA', 'DISPONIBLE', -33.4969, -70.6168),
    ('Brigada Vicuna Mac.', 'FORESTAL', 'DISPONIBLE', -33.4990, -70.6130),
    ('Brigada Sur', 'MIXTA', 'DISPONIBLE', -33.5010, -70.6180),
    ('Brigada La Granja', 'URBANA', 'INACTIVA', -33.5100, -70.6200),
    ('Brigada San Ramon', 'FORESTAL', 'DISPONIBLE', -33.4920, -70.6100);
INSERT INTO ASIGNACION_BRIGADA (reporte_id, brigada_id, fecha_asignacion, fecha_fin) VALUES
    (2, 1, NOW() - INTERVAL 4 HOUR, NULL),
    (3, 2, NOW() - INTERVAL 6 HOUR, NULL);
UPDATE brigada SET estado = 'EN_CAMINO' WHERE id IN (1, 2);
