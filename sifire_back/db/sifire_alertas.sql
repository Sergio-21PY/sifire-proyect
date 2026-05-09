-- sifire_alertas.sql - BD del microservicio ms-alertas
-- reporte_id referencia logica a sifire_reportes, sin FK fisica
-- brigadista_id referencia logica a sifire_usuarios.usuario.id, sin FK fisica
CREATE DATABASE IF NOT EXISTS sifire_alertas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sifire_alertas;

CREATE TABLE IF NOT EXISTS alerta (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id    BIGINT NULL         COMMENT 'Ref logica a sifire_reportes.REPORTE_INCENDIO.id',
    titulo        VARCHAR(200),
    mensaje       TEXT,
    canal         VARCHAR(10)         COMMENT 'EMAIL | SMS | PUSH',
    tipo          VARCHAR(100),
    descripcion   VARCHAR(500),
    latitud       DOUBLE,
    longitud      DOUBLE,
    estado        VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                              COMMENT 'PENDIENTE | ENVIADA | FALLIDA | ASIGNADA | RESUELTA',
    brigadista_id BIGINT NULL         COMMENT 'Ref logica a sifire_usuarios.usuario.id - brigadista asignado a esta alerta',
    created_at    DATETIME,
    resolved_at   DATETIME NULL       COMMENT 'Timestamp de resolucion del incidente (libera la brigada)'
);

CREATE TABLE IF NOT EXISTS alerta_asignaciones (
    alerta_id  BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL COMMENT 'Ref logica a sifire_usuarios.usuario.id',
    PRIMARY KEY (alerta_id, usuario_id),
    CONSTRAINT fk_asig_alerta FOREIGN KEY (alerta_id) REFERENCES alerta(id)
);

INSERT INTO alerta
    (reporte_id, titulo, mensaje, canal, tipo, descripcion, latitud, longitud, estado, brigadista_id, created_at, resolved_at)
VALUES
    (1,
     'Alerta: Posible incendio sector Duoc',
     'Se ha reportado un posible foco. Evite el area.',
     'PUSH', 'AUTOMATICA', 'Generada automaticamente por reporte ciudadano',
     -33.4969, -70.6168, 'ENVIADA', NULL, NOW() - INTERVAL 2 HOUR, NULL),

    (3,
     'ALERTA CRITICA: Incendio sector industrial',
     'Incendio de alta peligrosidad. Se ordena evacuacion preventiva.',
     'SMS', 'CRITICA', 'Emitida por funcionario tras activacion de protocolo',
     -33.4980, -70.6155, 'ASIGNADA', 3, NOW() - INTERVAL 7 HOUR, NULL),

    (NULL,
     'Aviso preventivo: condiciones de riesgo alto',
     'Altas temperaturas y viento sur. No encender fuego al aire libre.',
     'EMAIL', 'PREVENTIVA', 'Alerta manual emitida por funcionario municipal',
     -33.4500, -70.5800, 'ENVIADA', NULL, NOW() - INTERVAL 1 HOUR, NULL),

    (2,
     'Incendio controlado - Sector Caren',
     'El incendio ha sido controlado. Zona segura.',
     'PUSH', 'BRIGADISTA', 'Alerta resuelta por brigadista en terreno',
     -33.5010, -70.6200, 'RESUELTA', 4, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 3 HOUR);

INSERT INTO alerta_asignaciones (alerta_id, usuario_id) VALUES (2, 3), (2, 4);
