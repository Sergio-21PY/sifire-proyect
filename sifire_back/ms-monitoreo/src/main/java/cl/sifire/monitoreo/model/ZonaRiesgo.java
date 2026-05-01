package cl.sifire.monitoreo.model;

import org.springframework.data.annotation.Id;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "zona_riesgo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZonaRiesgo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_riesgo", nullable = false)
    private NivelRiesgo nivelRiesgo;

    @Column(columnDefinition = "TEXT")
    private String coordenadas;

    @Column(nullable = false)
    private Boolean activo = true;

    public enum NivelRiesgo { BAJO, MEDIO, ALTO, CRITICO }
}
