package cl.duoc.ser.sotoc.msalertas.repository;

import cl.duoc.ser.sotoc.msalertas.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
}
