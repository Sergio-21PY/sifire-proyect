package cl.sifire.monitoreo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sifire.monitoreo.model.Brigada;

public interface BrigadaRepository extends JpaRepository<Brigada, Long> {
    List<Brigada> findByEstado(Brigada.EstadoBrigada estado);

    List<Brigada> findByTipo(Brigada.TipoBrigada tipo);
}
