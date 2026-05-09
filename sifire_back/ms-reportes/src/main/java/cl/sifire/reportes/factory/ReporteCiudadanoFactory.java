package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.stereotype.Component;

@Component
public class ReporteCiudadanoFactory implements ReporteFactory {

    @Override
    public ReporteIncendio crear(ReporteRequestDTO dto) {
        validarCoordenadas(dto);

        ReporteIncendio reporte = new ReporteIncendio();
        reporte.setUsuarioId(dto.getUsuarioId());
        reporte.setDescripcion(dto.getDescripcion());
        reporte.setTitulo(dto.getTitulo());
        reporte.setLatitud(dto.getLatitud());
        reporte.setLongitud(dto.getLongitud());
        reporte.setComuna(dto.getComuna());
        reporte.setTipoReportante(ReporteIncendio.TipoReportante.CIUDADANO);
        reporte.setEstado(ReporteIncendio.EstadoReporte.PENDIENTE);

        // Ciudadanos pueden elegir BAJO, MEDIO o ALTO — nunca CRITICO
        // CRITICO está reservado para FUNCIONARIO/BRIGADISTA
        ReporteIncendio.NivelRiesgo solicitado = dto.getNivelRiesgo();
        reporte.setNivelRiesgo(
            solicitado != null && solicitado != ReporteIncendio.NivelRiesgo.CRITICO
                ? solicitado
                : ReporteIncendio.NivelRiesgo.MEDIO
        );

        return reporte;
    }

    private void validarCoordenadas(ReporteRequestDTO dto) {
        if (dto.getLatitud() == null || dto.getLongitud() == null) {
            throw new IllegalArgumentException(
                "[CiudadanoFactory] Las coordenadas GPS son obligatorias para reportes ciudadanos."
            );
        }
        if (dto.getLatitud() < -90  || dto.getLatitud() > 90 ||
            dto.getLongitud() < -180 || dto.getLongitud() > 180) {
            throw new IllegalArgumentException(
                "[CiudadanoFactory] Coordenadas GPS fuera de rango válido."
            );
        }
    }
}