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
public class Usuario implements UserDetails { // MODIFICADO

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String rol; //Roles ya definidos: Ciudadano, Brigadista, Funcionario, Admin

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
    }
}
