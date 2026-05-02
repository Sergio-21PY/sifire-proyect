package cl.duoc.ser.sotoc.msalertas.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ALERTA")
@Data
@NoArgsConstructor
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Double latitud;

    @Column(nullable = false)
    private Double longitud;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @Column(nullable = false)
    private String estado;

    @PrePersist
    protected void onCreate() {
        this.fechaHora = LocalDateTime.now();
        this.estado = "NUEVA";
    }
}
