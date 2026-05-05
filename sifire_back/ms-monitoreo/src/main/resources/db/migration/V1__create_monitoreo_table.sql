-- Migration V1: Tablas del microservicio de monitoreo geografico
-- MS: ms-monitoreo | DB: sifire_monitoreo

CREATE TABLE IF NOT EXISTS foco_incendio (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitud         DECIMAL(10,7) NOT NULL,
    longitud        DECIMAL(10,7) NOT NULL,
    descripcion     TEXT,
    estado          ENUM('ACTIVO','CONTROLADO','EXTINGUIDO') NOT NULL DEFAULT 'ACTIVO',
    usuario_id      BIGINT NOT NULL,
    fecha_reporte   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nivel_riesgo    ENUM('BAJO','MEDIO','ALTO','CRITICO') NOT NULL DEFAULT 'MEDIO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS zona_riesgo (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(200) NOT NULL,
    descripcion TEXT,
    latitud     DECIMAL(10,7) NOT NULL,
    longitud    DECIMAL(10,7) NOT NULL,
    radio_km    DECIMAL(6,2),
    nivel_riesgo ENUM('BAJO','MEDIO','ALTO','CRITICO') NOT NULL DEFAULT 'MEDIO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
