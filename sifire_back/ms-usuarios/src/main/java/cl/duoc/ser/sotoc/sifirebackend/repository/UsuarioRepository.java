package cl.duoc.ser.sotoc.sifirebackend.repository;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByUsername(String username);
}
