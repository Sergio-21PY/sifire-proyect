package cl.sifire.alertas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.sifire.alertas.model.Alerta;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByReporteId(Long reporteId);
    List<Alerta> findByEstado(Alerta.Estado estado);
}
