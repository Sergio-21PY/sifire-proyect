package cl.sifire.reportes.dto;

import cl.sifire.reportes.model.ReporteIncendio;
import lombok.Data;

/**
 * DTO (Data Transfer Object) para la creación de un reporte.
 * Es el objeto que llega desde el frontend o desde el BFF.
 *
 * El campo 'tipoReportante' es obligatorio porque el Factory Method
 * lo usa para decidir qué fábrica concreta instanciar.
 *
 * El campo 'nivelRiesgo' es opcional:
 *   - Ciudadano: se ignora (siempre MEDIO)
 *   - Brigadista: si viene, se usa; si no, se asigna ALTO
 *   - Funcionario: si es BAJO o MEDIO, se eleva automáticamente a ALTO
 */
@Data
public class ReporteRequestDTO {

    /** ID del usuario autenticado que crea el reporte */
    private Long usuarioId;

    /** Descripción textual del foco de incendio */
    private String descripcion;

    /** Coordenadas GPS del foco */
    private Double latitud;
    private Double longitud;

    /**
     * Tipo de actor que reporta.
     * OBLIGATORIO — el Factory Method lo necesita para crear el reporte correcto.
     */
    private ReporteIncendio.TipoReportante tipoReportante;

    /**
     * Nivel de riesgo sugerido por el reportante.
     * OPCIONAL — cada fábrica decide si lo usa o lo sobreescribe.
     */
    private ReporteIncendio.NivelRiesgo nivelRiesgo;
}
