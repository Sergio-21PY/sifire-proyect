package cl.duoc.ser.sotoc.sifirebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "USUARIO")
@Data
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< HEAD
public class Usuario implements UserDetails { // MODIFICADO
=======
public class Usuario {
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

<<<<<<< HEAD
    @Column(nullable = false)
    private String username;
=======
    @Column(unique = true, nullable = false)
    private String email;
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String telefono;

<<<<<<< HEAD
    // --- MÉTODOS DE USERDETAILS AÑADIDOS ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Le decimos a Spring Security que el rol de este usuario es, por ejemplo, "ROLE_BRIGADISTA"
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.rol));
    }

    @Override
    public String getUsername() {
        // Spring Security usará el email como el "username" único para la autenticación
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // La cuenta nunca expira
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // La cuenta nunca se bloquea
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Las credenciales nunca expiran
    }

    @Override
    public boolean isEnabled() {
        return true; // La cuenta siempre está habilitada
=======
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoUsuario tipo;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "username")
    private String username;

    public enum TipoUsuario {
        CIUDADANO, BRIGADISTA, FUNCIONARIO, ADMINISTRADOR
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90
    }
}
