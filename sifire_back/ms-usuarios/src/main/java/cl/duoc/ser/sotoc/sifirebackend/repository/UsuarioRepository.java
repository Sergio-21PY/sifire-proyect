package cl.duoc.ser.sotoc.sifirebackend.repository;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Métodos de consulta personalizados
    Optional<Usuario> findByEmail(String email);
<<<<<<< HEAD
    Optional<Usuario> findByUsername(String username);
    List<Usuario> findByRol(String rol); // AÑADIDO
=======
    List<Usuario> findByTipo(Usuario.TipoUsuario tipo);
    List<Usuario> findByActivoTrue();
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90
}
