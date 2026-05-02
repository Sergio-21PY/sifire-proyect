package cl.sifire.reportes.dto;

import cl.sifire.reportes.model.ReporteIncendio;
import lombok.Data;

// datos que llegan al crear un reporte nuevo
@Data
public class ReporteRequestDTO {

    private Long usuarioId;
    private String titulo;
    private String descripcion;

    private Double latitud;
    private Double longitud;

    // opcional, cada tipo de usuario lo maneja distinto, esto para que el service sepa como armar el reporte segun quien lo envia
    private ReporteIncendio.TipoReportante tipoReportante;

    // opcional, cada tipo de usuario lo maneja distinto, esto para que el service sepa como armar el reporte segun quien lo envia
    private ReporteIncendio.NivelRiesgo nivelRiesgo;
}