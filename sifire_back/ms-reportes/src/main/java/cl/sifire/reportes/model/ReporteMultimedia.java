package cl.sifire.reportes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Archivos adjuntos a un reporte (fotos, videos, audios).
 * Mapea la tabla REPORTE_MULTIMEDIA.
 */
@Entity
@Table(name = "REPORTE_MULTIMEDIA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteMultimedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporte_id", nullable = false)
    private Long reporteId;

    /** URL o path del archivo almacenado */
    @Column(name = "url_archivo", nullable = false)
    private String urlArchivo;

    /** Tipo de archivo: FOTO, VIDEO, AUDIO */
    @Column(name = "tipo_archivo")
    private String tipoArchivo;

    @Column(name = "fecha_subida")
    private LocalDateTime fechaSubida;

    @PrePersist
    public void prePersist() {
        this.fechaSubida = LocalDateTime.now();
    }
}
