package cl.sifire.monitoreo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sifire.monitoreo.model.ZonaRiesgo;

public interface ZonaRiesgoRepository extends JpaRepository<ZonaRiesgo, Long> {
    List<ZonaRiesgo> findByActivoTrue();
    List<ZonaRiesgo> findByNivelRiesgo(ZonaRiesgo.NivelRiesgo nivelRiesgo);
}
