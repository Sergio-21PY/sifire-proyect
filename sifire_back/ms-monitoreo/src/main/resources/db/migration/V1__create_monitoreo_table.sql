-- Migration V1: Tablas del microservicio de monitoreo geografico
-- MS: ms-monitoreo | DB: sifire_monitoreo
-- Entidades: Brigada, ZonaRiesgo, RutaEvacuacion, AsignacionBrigada

CREATE TABLE IF NOT EXISTS brigada (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(255) NOT NULL,
    tipo     ENUM('FORESTAL','URBANA','MIXTA') NOT NULL,
    estado   ENUM('DISPONIBLE','EN_CAMINO','INTERVINIENDO','INACTIVA') NOT NULL,
    latitud  DOUBLE,
    longitud DOUBLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS zona_riesgo (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(255) NOT NULL,
    nivel_riesgo ENUM('BAJO','MEDIO','ALTO','CRITICO') NOT NULL,
    coordenadas  TEXT,
    activo       TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ruta_evacuacion (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(255) NOT NULL,
    trazado     TEXT,
    descripcion VARCHAR(255),
    activo      TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ASIGNACION_BRIGADA (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporte_id       BIGINT NOT NULL,
    brigada_id       BIGINT NOT NULL,
    fecha_asignacion DATETIME,
    fecha_fin        DATETIME,
    FOREIGN KEY (brigada_id) REFERENCES brigada(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
