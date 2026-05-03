package cl.duoc.ser.sotoc.sifirebackend.repository;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);
<<<<<<< HEAD

    Optional<Usuario> findByUsername(String username);

=======
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
    List<Usuario> findByTipo(Usuario.TipoUsuario tipo);

    List<Usuario> findByActivoTrue();
<<<<<<< HEAD

=======
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
}
