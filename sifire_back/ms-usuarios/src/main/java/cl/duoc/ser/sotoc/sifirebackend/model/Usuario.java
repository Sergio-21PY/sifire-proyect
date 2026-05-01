package cl.duoc.ser.sotoc.sifirebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USUARIO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoUsuario tipo;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "username")
    private String username;

    public enum TipoUsuario {
        CIUDADANO, BRIGADISTA, FUNCIONARIO, ADMINISTRADOR
    }
}
