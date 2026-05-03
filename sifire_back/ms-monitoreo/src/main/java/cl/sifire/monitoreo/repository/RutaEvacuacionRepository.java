package cl.sifire.monitoreo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import cl.sifire.monitoreo.model.RutaEvacuacion;

public interface RutaEvacuacionRepository  extends JpaRepository<RutaEvacuacion, Long> {
    List<RutaEvacuacion> findByActivoTrue();
}
