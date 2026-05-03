package cl.sifire.monitoreo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ruta_evacuacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RutaEvacuacion {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String trazado;

    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;
}
