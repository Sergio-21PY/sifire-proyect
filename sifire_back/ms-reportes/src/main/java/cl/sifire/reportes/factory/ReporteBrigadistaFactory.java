package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.stereotype.Component;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Factory Method — Implementación Brigadista
 * ═══════════════════════════════════════════════════════
 *
 * Reglas de negocio para reportes generados por BRIGADISTAS:
 * 1. El nivel de riesgo lo evalúa el propio brigadista (viene en el DTO)
 *    Si no viene, se asigna ALTO por precaución (está en terreno)
 * 2. Estado inicial: EN_PROCESO (ya hay un equipo interviniendo)
 * 3. Valida coordenadas igual que el ciudadano
 *
 * El brigadista reporta con criterio técnico desde el lugar del incidente.
 */
@Component
public class ReporteBrigadistaFactory implements ReporteFactory {

    @Override
    public ReporteIncendio crear(ReporteRequestDTO dto) {
        validarCoordenadas(dto);

        ReporteIncendio reporte = new ReporteIncendio();
        reporte.setUsuarioId(dto.getUsuarioId());
        reporte.setDescripcion(dto.getDescripcion());
        reporte.setLatitud(dto.getLatitud());
        reporte.setLongitud(dto.getLongitud());
        reporte.setTipoReportante(ReporteIncendio.TipoReportante.BRIGADISTA);

        // Regla de negocio: usa el nivel que evaluó el brigadista.
        // Si no envía nivel, se asigna ALTO por defecto (está en terreno).
        ReporteIncendio.NivelRiesgo nivel = dto.getNivelRiesgo() != null
            ? dto.getNivelRiesgo()
            : ReporteIncendio.NivelRiesgo.ALTO;
        reporte.setNivelRiesgo(nivel);

        // El brigadista ya está interviniendo → estado EN_PROCESO directamente
        reporte.setEstado(ReporteIncendio.EstadoReporte.EN_PROCESO);

        return reporte;
    }

    private void validarCoordenadas(ReporteRequestDTO dto) {
        if (dto.getLatitud() == null || dto.getLongitud() == null) {
            throw new IllegalArgumentException(
                "[BrigadistaFactory] Las coordenadas GPS son obligatorias."
            );
        }
    }
}
