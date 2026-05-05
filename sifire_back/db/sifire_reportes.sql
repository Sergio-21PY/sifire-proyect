-- sifire_reportes.sql - BD del microservicio ms-reportes
-- usuario_id referencia logica a sifire_usuarios, sin FK fisica
CREATE DATABASE IF NOT EXISTS sifire_reportes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sifire_reportes;
CREATE TABLE IF NOT EXISTS REPORTE_INCENDIO (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL COMMENT 'Ref logica a sifire_usuarios.usuario.id',
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    latitud DOUBLE NOT NULL,
    longitud DOUBLE NOT NULL,
    comuna VARCHAR(100) NULL,
    nivel_riesgo VARCHAR(20) NOT NULL COMMENT 'BAJO | MEDIO | ALTO | CRITICO',
    estado VARCHAR(20) NOT NULL COMMENT 'PENDIENTE | EN_PROCESO | RESUELTO | DESCARTADO',
    tipo_reportante VARCHAR(20) NOT NULL COMMENT 'CIUDADANO | BRIGADISTA | FUNCIONARIO',
    fecha_creacion DATETIME,
    fecha_actualizacion DATETIME
);
CREATE TABLE IF NOT EXISTS HISTORIAL_REPORTE (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id BIGINT NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    usuario_id BIGINT,
    observacion VARCHAR(500),
    fecha_cambio DATETIME,
    CONSTRAINT fk_historial_reporte FOREIGN KEY (reporte_id) REFERENCES REPORTE_INCENDIO(id)
);
CREATE TABLE IF NOT EXISTS REPORTE_MULTIMEDIA (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id BIGINT NOT NULL,
    url_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(20) COMMENT 'FOTO | VIDEO | AUDIO',
    fecha_subida DATETIME,
    CONSTRAINT fk_multimedia_reporte FOREIGN KEY (reporte_id) REFERENCES REPORTE_INCENDIO(id)
);
INSERT INTO REPORTE_INCENDIO (usuario_id, titulo, descripcion, latitud, longitud, comuna, nivel_riesgo, estado, tipo_reportante, fecha_creacion, fecha_actualizacion) VALUES
    (5, 'Incendio sector Duoc San Joaquin', 'Veo humo saliendo desde el sector industrial.', -33.4969, -70.6168, 'San Joaquin', 'MEDIO', 'PENDIENTE', 'CIUDADANO', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),
    (3, 'Foco activo Walker Martinez', 'Foco confirmado, viento sur moderado.', -33.4975, -70.6140, 'San Joaquin', 'ALTO', 'EN_PROCESO', 'BRIGADISTA', NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 3 HOUR),
    (2, 'Incendio critico sector industrial', 'Incendio de gran magnitud en bodega industrial.', -33.4980, -70.6155, 'San Joaquin', 'CRITICO', 'EN_PROCESO', 'FUNCIONARIO', NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 6 HOUR),
    (6, 'Quema de pastizales Parque Camiroaga', 'Pequeno foco controlado por vecinos.', -33.5010, -70.6180, 'Pedro Aguirre Cerda', 'BAJO', 'RESUELTO', 'CIUDADANO', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY);
