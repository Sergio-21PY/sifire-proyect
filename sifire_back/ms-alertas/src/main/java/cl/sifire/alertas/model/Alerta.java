package cl.sifire.alertas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alerta")
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporte_id")
    private Long reporteId;

    // Campos originales tuyos
    @Column(length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    @Enumerated(EnumType.STRING)
    private Canal canal;

    // Campos de Sergio
    private String tipo;

    @Column(length = 500)
    private String descripcion;

    private Double latitud;
    private Double longitud;

    // Estado unificado
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    // Asignaciones de Sergio
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "alerta_asignaciones",
        joinColumns = @JoinColumn(name = "alerta_id"))
    @Column(name = "usuario_id")
    private Set<Long> usuariosAsignadosIds = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Canal { EMAIL, SMS, PUSH }
    public enum Estado { ENVIADA, FALLIDA, PENDIENTE, ASIGNADA }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.estado == null) this.estado = Estado.PENDIENTE;
    }
}