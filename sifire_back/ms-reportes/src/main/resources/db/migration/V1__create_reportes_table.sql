-- Migration V1: Tablas del microservicio de reportes
-- MS: ms-reportes | DB: sifire_reportes
-- Entidades: ReporteIncendio, HistorialReporte, ReporteMultimedia

CREATE TABLE IF NOT EXISTS REPORTE_INCENDIO (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id          BIGINT NOT NULL,
    titulo              VARCHAR(255) NOT NULL,
    descripcion         TEXT NOT NULL,
    latitud             DOUBLE NOT NULL,
    longitud            DOUBLE NOT NULL,
    nivel_riesgo        ENUM('BAJO','MEDIO','ALTO','CRITICO') NOT NULL,
    estado              ENUM('PENDIENTE','EN_PROCESO','RESUELTO','DESCARTADO') NOT NULL DEFAULT 'PENDIENTE',
    tipo_reportante     ENUM('CIUDADANO','BRIGADISTA','FUNCIONARIO') NOT NULL,
    fecha_creacion      DATETIME,
    fecha_actualizacion DATETIME,
    comuna              VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS REPORTE_MULTIMEDIA (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id    BIGINT NOT NULL,
    url_archivo   VARCHAR(255) NOT NULL,
    tipo_archivo  VARCHAR(255),
    fecha_subida  DATETIME,
    FOREIGN KEY (reporte_id) REFERENCES REPORTE_INCENDIO(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS HISTORIAL_REPORTE (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id      BIGINT NOT NULL,
    estado_anterior ENUM('PENDIENTE','EN_PROCESO','RESUELTO','DESCARTADO'),
    estado_nuevo    ENUM('PENDIENTE','EN_PROCESO','RESUELTO','DESCARTADO') NOT NULL,
    usuario_id      BIGINT,
    observacion     VARCHAR(255),
    fecha_cambio    DATETIME,
    FOREIGN KEY (reporte_id) REFERENCES REPORTE_INCENDIO(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
