-- Migration V1: Tablas del microservicio de reportes
-- MS: ms-reportes | DB: sifire_reportes

CREATE TABLE IF NOT EXISTS reporte (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo              VARCHAR(200) NOT NULL,
    descripcion         TEXT,
    latitud             DECIMAL(10,7),
    longitud            DECIMAL(10,7),
    tipo                ENUM('INCENDIO_FORESTAL','INCENDIO_URBANO','EMERGENCIA','OTRO') NOT NULL DEFAULT 'INCENDIO_FORESTAL',
    estado              ENUM('PENDIENTE','EN_PROCESO','RESUELTO','RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    usuario_id          BIGINT NOT NULL,
    fecha_reporte       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    foto_url            VARCHAR(500),
    video_url           VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
