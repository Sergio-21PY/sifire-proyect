package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.stereotype.Component;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Factory Method — Implementación Funcionario
 * ═══════════════════════════════════════════════════════
 *
 * Reglas de negocio para reportes generados por FUNCIONARIOS municipales:
 * 1. Nivel de riesgo: ALTO o CRITICO obligatoriamente
 *    Si viene un nivel menor (BAJO o MEDIO), se eleva automáticamente a ALTO
 * 2. Estado inicial: EN_PROCESO (reporte oficial, intervención inmediata)
 * 3. Marca el reporte para disparo automático de alerta (alertaAutomatica=true)
 *    El Observer detectará esta bandera y notificará a ms-alertas
 *
 * El funcionario tiene autoridad para emitir reportes oficiales.
 */
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
