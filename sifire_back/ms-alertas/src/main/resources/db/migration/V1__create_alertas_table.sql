-- Migration V1: Tablas del microservicio de alertas
-- MS: ms-alertas | DB: sifire_alertas

CREATE TABLE IF NOT EXISTS alerta (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo            VARCHAR(100) NOT NULL,
    descripcion     TEXT,
    nivel           ENUM('BAJO','MEDIO','ALTO','CRITICO') NOT NULL DEFAULT 'MEDIO',
    usuario_id      BIGINT NOT NULL,
    fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resuelta        TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS brigadista_alerta (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    alerta_id       BIGINT NOT NULL,
    brigadista_id   BIGINT NOT NULL,
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alerta_id) REFERENCES alerta(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
