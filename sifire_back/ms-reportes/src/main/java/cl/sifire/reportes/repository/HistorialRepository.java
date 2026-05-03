package cl.sifire.reportes.repository;

import cl.sifire.reportes.model.HistorialReporte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository Pattern — acceso a la tabla HISTORIAL_REPORTE.
 * Permite consultar la auditoría de cambios de un reporte específico.
 */
public interface HistorialRepository extends JpaRepository<HistorialReporte, Long> {

    /** Retorna todos los cambios de estado ordenados por fecha para un reporte */
    List<HistorialReporte> findByReporteIdOrderByFechaCambioAsc(Long reporteId);

}
