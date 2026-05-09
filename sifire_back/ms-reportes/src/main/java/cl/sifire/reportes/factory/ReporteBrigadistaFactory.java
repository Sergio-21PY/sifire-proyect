package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.stereotype.Component;

@Component
public class ReporteBrigadistaFactory implements ReporteFactory {

    @Override
    public ReporteIncendio crear(ReporteRequestDTO dto) {
        validarCoordenadas(dto);

        ReporteIncendio reporte = new ReporteIncendio();
        reporte.setUsuarioId(dto.getUsuarioId());
        reporte.setDescripcion(dto.getDescripcion());
        reporte.setTitulo(dto.getTitulo());
        reporte.setLatitud(dto.getLatitud());
        reporte.setLongitud(dto.getLongitud());
        reporte.setComuna(dto.getComuna());                          // ← agregar
        reporte.setTipoReportante(ReporteIncendio.TipoReportante.BRIGADISTA);

        // Respeta el nivel evaluado por el brigadista en terreno
        ReporteIncendio.NivelRiesgo nivel = dto.getNivelRiesgo() != null
            ? dto.getNivelRiesgo()
            : ReporteIncendio.NivelRiesgo.ALTO;
        reporte.setNivelRiesgo(nivel);

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