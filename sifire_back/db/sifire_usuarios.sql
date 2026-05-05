-- sifire_usuarios.sql - BD del microservicio ms-usuarios
CREATE DATABASE IF NOT EXISTS sifire_usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sifire_usuarios;
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NULL,
    tipo VARCHAR(30) NOT NULL COMMENT 'CIUDADANO | BRIGADISTA | FUNCIONARIO | ADMINISTRADOR',
    activo TINYINT(1) NOT NULL DEFAULT 1
);
INSERT INTO usuario (username, nombre, email, password, telefono, tipo, activo) VALUES
    ('admin.sifire',  'Administrador SIFIRE', 'admin@sifire.cl',        '1234', '+56900000001', 'ADMINISTRADOR', 1),
    ('juan.perez',    'Juan Perez',           'juan.perez@sifire.cl',   '1234', '+56900000002', 'FUNCIONARIO',   1),
    ('carlos.rojas',  'Carlos Rojas',         'carlos.rojas@sifire.cl', '1234', '+56900000003', 'BRIGADISTA',    1),
    ('maria.lopez',   'Maria Lopez',          'maria.lopez@sifire.cl',  '1234', '+56900000004', 'BRIGADISTA',    1),
    ('pedro.silva',   'Pedro Silva',          'pedro.silva@sifire.cl',  '1234', '+56900000005', 'CIUDADANO',     1),
    ('ana.torres',    'Ana Torres',           'ana.torres@sifire.cl',   '1234', '+56900000006', 'CIUDADANO',     1);
