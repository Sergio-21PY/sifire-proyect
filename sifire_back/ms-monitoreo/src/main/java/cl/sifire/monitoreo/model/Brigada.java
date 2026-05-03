package cl.sifire.monitoreo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "brigada")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brigada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoBrigada tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoBrigada estado;

    private Double latitud;

    private Double longitud;

    public enum TipoBrigada {
        FORESTAL, URBANA, MIXTA
    }

    public enum EstadoBrigada {
        DISPONIBLE, EN_CAMINO, INTERVINIENDO, INACTIVA
    }
}
