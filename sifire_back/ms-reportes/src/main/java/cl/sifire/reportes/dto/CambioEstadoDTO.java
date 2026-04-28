package cl.sifire.reportes.dto;

import cl.sifire.reportes.model.ReporteIncendio;
import lombok.Data;

/**
 * DTO para cambiar el estado de un reporte existente.
 * Usado en PUT /api/reportes/{id}/estado
 */
@Data
public class CambioEstadoDTO {

    /** Nuevo estado al que se quiere mover el reporte */
    private ReporteIncendio.EstadoReporte nuevoEstado;

    /** ID del usuario que realiza el cambio (para auditoría en HistorialReporte) */
    private Long usuarioId;

    /** Motivo u observación del cambio (opcional, queda registrado en historial) */
    private String observacion;
}
