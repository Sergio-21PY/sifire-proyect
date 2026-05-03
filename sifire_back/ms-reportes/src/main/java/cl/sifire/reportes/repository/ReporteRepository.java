package cl.sifire.reportes.repository;

import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Repository Pattern
 * ═══════════════════════════════════════════════════════
 * Actúa como intermediario entre la lógica de negocio (ReporteService)
 * y la capa de persistencia (MySQL / JPA).
 *
 * Spring Data JPA genera automáticamente el SQL a partir de los
 * nombres de los métodos. El servicio nunca escribe SQL directo.
 */
public interface ReporteRepository extends JpaRepository<ReporteIncendio, Long> {

    /** Filtra reportes por estado (ej: todos los PENDIENTES) */
    List<ReporteIncendio> findByEstado(ReporteIncendio.EstadoReporte estado);

    /** Filtra reportes por nivel de riesgo (ej: todos los CRITICOS) */
    List<ReporteIncendio> findByNivelRiesgo(ReporteIncendio.NivelRiesgo nivelRiesgo);

    /** Filtra reportes por tipo de reportante */
    List<ReporteIncendio> findByTipoReportante(ReporteIncendio.TipoReportante tipo);

    /** Reportes de un usuario específico */
    List<ReporteIncendio> findByUsuarioId(Long usuarioId);

    /** Reportes activos (PENDIENTE o EN_PROCESO) para el mapa */
    List<ReporteIncendio> findByEstadoIn(List<ReporteIncendio.EstadoReporte> estados);
}
