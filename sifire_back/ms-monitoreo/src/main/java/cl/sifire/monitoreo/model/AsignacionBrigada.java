package cl.sifire.monitoreo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ASIGNACION_BRIGADA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsignacionBrigada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporte_id", nullable = false)
    private Long reporteId;

    @ManyToOne
    @JoinColumn(name = "brigada_id", nullable = false)
    private Brigada brigada;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @PrePersist
    public void prePersist() {
        this.fechaAsignacion = LocalDateTime.now();
    }
}