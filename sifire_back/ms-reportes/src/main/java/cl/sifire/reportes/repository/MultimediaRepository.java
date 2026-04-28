package cl.sifire.reportes.repository;

import cl.sifire.reportes.model.ReporteMultimedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository Pattern — acceso a la tabla REPORTE_MULTIMEDIA.
 */
public interface MultimediaRepository extends JpaRepository<ReporteMultimedia, Long> {

    List<ReporteMultimedia> findByReporteId(Long reporteId);
}
