-- V5: Corrige el tipo de columna 'estado' de VARCHAR a ENUM
-- Causa: Hibernate espera ENUM pero la BD tiene VARCHAR (Types#VARCHAR vs Types#ENUM)
ALTER TABLE alerta
    MODIFY COLUMN estado ENUM('enviada','fallida','pendiente','asignada','resuelta') NOT NULL;
