package cl.sifire.reportes.dto;

import cl.sifire.reportes.model.ReporteIncendio;
import lombok.Data;

// datos que llegan cuando se quiere cambiar el estado de un reporte
@Data
public class CambioEstadoDTO {

    private ReporteIncendio.EstadoReporte nuevoEstado;

    private Long usuarioId;

    // opcional, se guarda en el historial
    private String observacion;
}