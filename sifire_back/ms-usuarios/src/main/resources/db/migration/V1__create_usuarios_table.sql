-- Migration V1: Tabla principal de usuarios
-- MS: ms-usuarios | DB: sifire_usuarios

CREATE TABLE IF NOT EXISTS USUARIO (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    telefono   VARCHAR(20)  NOT NULL,
    tipo       ENUM('CIUDADANO','BRIGADISTA','FUNCIONARIO','ADMINISTRADOR') NOT NULL DEFAULT 'CIUDADANO',
    activo     TINYINT(1)   NOT NULL DEFAULT 1,
    username   VARCHAR(100) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
