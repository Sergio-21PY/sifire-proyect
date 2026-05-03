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
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

<<<<<<< HEAD
    @Column(nullable = false, unique = true)
    private String username;

=======
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 50) // Se especifica el tipo de columna compatible
    private TipoUsuario tipo;

    @Column(name = "activo")
    private Boolean activo = true;

    public enum TipoUsuario {
        CIUDADANO, BRIGADISTA, FUNCIONARIO, ADMINISTRADOR
    }

<<<<<<< HEAD
    // --- MÉTODOS DE USERDETAILS ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Usamos el enum para darle el rol a Spring Security
=======
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.tipo.name()));
    }

    @Override
    public String getUsername() {
<<<<<<< HEAD
        // Para Spring Security, el "username" de login será el email.
        // El campo `username` de la clase se puede usar para un alias o nombre de usuario visible.
=======
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
        return this.email;
    }

    @Override
<<<<<<< HEAD
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.activo;
=======
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(this.activo);
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
    }
}
