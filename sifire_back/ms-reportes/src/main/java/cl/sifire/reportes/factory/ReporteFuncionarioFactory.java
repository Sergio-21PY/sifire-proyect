package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.stereotype.Component;

@Component
public class ReporteFuncionarioFactory implements ReporteFactory {

    @Override
    public ReporteIncendio crear(ReporteRequestDTO dto) {
        ReporteIncendio reporte = new ReporteIncendio();
        reporte.setUsuarioId(dto.getUsuarioId());
        reporte.setDescripcion(dto.getDescripcion());
        reporte.setLatitud(dto.getLatitud());
        reporte.setLongitud(dto.getLongitud());
        reporte.setTipoReportante(ReporteIncendio.TipoReportante.FUNCIONARIO);

        // Regla de negocio: el funcionario sólo puede reportar ALTO o CRITICO.
        // Si envía un nivel menor, el sistema lo eleva automáticamente a ALTO.
        ReporteIncendio.NivelRiesgo nivel = dto.getNivelRiesgo();
        if (nivel == null ||
            nivel == ReporteIncendio.NivelRiesgo.BAJO ||
            nivel == ReporteIncendio.NivelRiesgo.MEDIO) {
            nivel = ReporteIncendio.NivelRiesgo.ALTO;
        }
        reporte.setNivelRiesgo(nivel);
        reporte.setEstado(ReporteIncendio.EstadoReporte.EN_PROCESO);

        return reporte;
    }
}
