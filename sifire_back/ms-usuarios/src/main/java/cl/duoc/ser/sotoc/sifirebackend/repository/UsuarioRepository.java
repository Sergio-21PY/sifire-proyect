package cl.duoc.ser.sotoc.sifirebackend.repository;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByTipo(Usuario.TipoUsuario tipo);
    List<Usuario> findByActivoTrue();
}
