-- Migration V1: Tablas del microservicio de alertas
-- MS: ms-alertas | DB: sifire_alertas
-- Entidades: Alerta (con @ElementCollection alerta_asignaciones)

CREATE TABLE IF NOT EXISTS alerta (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id  BIGINT,
    titulo      VARCHAR(200),
    mensaje     TEXT,
    canal       ENUM('EMAIL','SMS','PUSH'),
    tipo        VARCHAR(255),
    descripcion VARCHAR(500),
    latitud     DOUBLE,
    longitud    DOUBLE,
    estado      ENUM('ENVIADA','FALLIDA','PENDIENTE','ASIGNADA') NOT NULL DEFAULT 'PENDIENTE',
    created_at  DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para el @ElementCollection de usuariosAsignadosIds
CREATE TABLE IF NOT EXISTS alerta_asignaciones (
    alerta_id   BIGINT NOT NULL,
    usuario_id  BIGINT NOT NULL,
    PRIMARY KEY (alerta_id, usuario_id),
    FOREIGN KEY (alerta_id) REFERENCES alerta(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
