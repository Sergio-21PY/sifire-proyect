package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Factory Method — Interfaz (Fábrica Abstracta)
 * ═══════════════════════════════════════════════════════
 *
 * Define el contrato que deben cumplir todas las fábricas de reportes.
 * Cada implementación concreta aplica las reglas de negocio específicas
 * del tipo de reportante (Ciudadano, Brigadista, Funcionario).
 *
 * Principio Open/Closed: si en el futuro se agrega un nuevo tipo
 * (ej: SensorIoT), se crea una nueva clase que implemente esta interfaz
 * sin tocar el código existente.
 */
public interface ReporteFactory {

    /**
     * Crea una instancia de ReporteIncendio con las reglas de negocio
     * aplicadas según el tipo de reportante.
     *
     * @param dto Datos enviados por el frontend/cliente
     * @return ReporteIncendio listo para ser persistido
     */
    ReporteIncendio crear(ReporteRequestDTO dto);
}
