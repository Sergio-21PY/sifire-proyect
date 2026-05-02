package cl.sifire.reportes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad principal del microservicio de reportes.
 * Mapea la tabla REPORTE_INCENDIO de la base de datos SIFIRE.
 *
 * Campos clave:
 * - tipoReportante: define qué factory se usará al crear el reporte (CIUDADANO,
 * BRIGADISTA, FUNCIONARIO)
 * - nivelRiesgo: asignado automáticamente por el Factory Method según el tipo
 * de reportante
 * - estado: ciclo de vida del reporte (PENDIENTE → EN_PROCESO → RESUELTO /
 * DESCARTADO)
 */
@Entity
@Table(name = "REPORTE_INCENDIO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteIncendio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID del usuario que crea el reporte (referencia a ms-usuarios) */
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String descripcion;

    /** Latitud GPS del foco reportado */
    @Column(nullable = false)
    private Double latitud;

    /** Longitud GPS del foco reportado */
    @Column(nullable = false)
    private Double longitud;

    /**
     * Nivel de riesgo asignado por el Factory Method.
     * CIUDADANO → MEDIO | BRIGADISTA → evaluado | FUNCIONARIO → ALTO o CRITICO
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_riesgo", nullable = false)
    private NivelRiesgo nivelRiesgo;

    /** Estado actual del reporte dentro de su ciclo de vida */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReporte estado;

    /**
     * Tipo de actor que generó el reporte.
     * El ReporteFactorySelector usa este campo para elegir la fábrica correcta.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_reportante", nullable = false)
    private TipoReportante tipoReportante;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "reporte_id")
    private List<ReporteMultimedia> multimedia;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.estado == null)
            this.estado = EstadoReporte.PENDIENTE;
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // ── ENUMs internos ──────────────────────────────────────────────────────────

    public enum NivelRiesgo {
        BAJO, MEDIO, ALTO, CRITICO
    }

    public enum EstadoReporte {
        PENDIENTE, EN_PROCESO, RESUELTO, DESCARTADO
    }

    public enum TipoReportante {
        CIUDADANO, BRIGADISTA, FUNCIONARIO
    }

}
