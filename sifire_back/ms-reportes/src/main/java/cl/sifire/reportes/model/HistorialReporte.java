package cl.sifire.reportes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Auditoría de cambios de estado de un reporte.
 * Mapea la tabla HISTORIAL_REPORTE.
 *
 * Cada vez que un reporte cambia de estado (ej: PENDIENTE → EN_PROCESO)
 * se genera un registro aquí con quién hizo el cambio y cuándo.
 */
@Entity
@Table(name = "HISTORIAL_REPORTE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialReporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Reporte al que pertenece este registro de auditoría */
    @Column(name = "reporte_id", nullable = false)
    private Long reporteId;

    /** Estado anterior del reporte */
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior")
    private ReporteIncendio.EstadoReporte estadoAnterior;

    /** Estado nuevo al que se cambió */
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false)
    private ReporteIncendio.EstadoReporte estadoNuevo;

    /** Usuario que realizó el cambio */
    @Column(name = "usuario_id")
    private Long usuarioId;

    /** Observación o motivo del cambio de estado */
    private String observacion;

    @Column(name = "fecha_cambio")
    private LocalDateTime fechaCambio;

    @PrePersist
    public void prePersist() {
        this.fechaCambio = LocalDateTime.now();
    }
}
