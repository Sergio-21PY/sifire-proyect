package cl.duoc.ser.sotoc.msreportes.repository;

import cl.duoc.ser.sotoc.msreportes.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    // Método para encontrar todos los reportes de un tipo específico (ej. "Incendio")
    List<Reporte> findByTipo(String tipo);
}
