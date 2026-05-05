-- sifire_alertas.sql - BD del microservicio ms-alertas
-- reporte_id referencia logica a sifire_reportes, sin FK fisica
CREATE DATABASE IF NOT EXISTS sifire_alertas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sifire_alertas;
CREATE TABLE IF NOT EXISTS alerta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id BIGINT NULL COMMENT 'Ref logica a sifire_reportes.REPORTE_INCENDIO.id',
    titulo VARCHAR(200),
    mensaje TEXT,
    canal VARCHAR(10) COMMENT 'EMAIL | SMS | PUSH',
    tipo VARCHAR(100),
    descripcion VARCHAR(500),
    latitud DOUBLE,
    longitud DOUBLE,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' COMMENT 'PENDIENTE | ENVIADA | FALLIDA | ASIGNADA',
    created_at DATETIME
);
CREATE TABLE IF NOT EXISTS alerta_asignaciones (
    alerta_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL COMMENT 'Ref logica a sifire_usuarios.usuario.id',
    PRIMARY KEY (alerta_id, usuario_id),
    CONSTRAINT fk_asig_alerta FOREIGN KEY (alerta_id) REFERENCES alerta(id)
);
INSERT INTO alerta (reporte_id, titulo, mensaje, canal, tipo, descripcion, latitud, longitud, estado, created_at) VALUES
    (1, 'Alerta: Posible incendio sector Duoc', 'Se ha reportado un posible foco. Evite el area.', 'PUSH', 'AUTOMATICA', 'Generada automaticamente por reporte ciudadano', -33.4969, -70.6168, 'ENVIADA', NOW() - INTERVAL 2 HOUR),
    (3, 'ALERTA CRITICA: Incendio sector industrial', 'Incendio de alta peligrosidad. Se ordena evacuacion preventiva.', 'SMS', 'CRITICA', 'Emitida por funcionario tras activacion de protocolo', -33.4980, -70.6155, 'ASIGNADA', NOW() - INTERVAL 7 HOUR),
    (NULL, 'Aviso preventivo: condiciones de riesgo alto', 'Altas temperaturas y viento sur. No encender fuego al aire libre.', 'EMAIL', 'PREVENTIVA', 'Alerta manual emitida por funcionario municipal', -33.4500, -70.5800, 'ENVIADA', NOW() - INTERVAL 1 HOUR);
INSERT INTO alerta_asignaciones (alerta_id, usuario_id) VALUES (2, 3), (2, 4);
