-- Migration V1: Tabla principal de usuarios
-- MS: ms-usuarios | DB: sifire_usuarios
-- Entidad: Usuario

CREATE TABLE IF NOT EXISTS USUARIO (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(255) NOT NULL,
    email     VARCHAR(255) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    telefono  VARCHAR(255) NOT NULL,
    tipo      ENUM('CIUDADANO','BRIGADISTA','FUNCIONARIO','ADMINISTRADOR') NOT NULL DEFAULT 'CIUDADANO',
    activo    TINYINT(1) NOT NULL DEFAULT 1,
    username  VARCHAR(255) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
