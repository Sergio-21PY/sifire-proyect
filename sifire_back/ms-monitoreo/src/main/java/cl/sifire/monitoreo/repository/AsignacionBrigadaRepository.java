package cl.sifire.monitoreo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sifire.monitoreo.model.AsignacionBrigada;

public interface AsignacionBrigadaRepository extends JpaRepository<AsignacionBrigada, Long>  {
    List<AsignacionBrigada> findByReporteId(Long reporteId);
    
    List<AsignacionBrigada> findByBrigadaIdAndFechaFinIsNull(Long brigadaId);
}
