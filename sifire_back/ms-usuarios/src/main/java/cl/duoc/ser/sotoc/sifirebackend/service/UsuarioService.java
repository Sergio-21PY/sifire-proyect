package cl.duoc.ser.sotoc.sifirebackend.service;

import cl.duoc.ser.sotoc.sifirebackend.factory.UsuarioFactory;
import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder; // AÑADIDO

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder; // AÑADIDO
    }

    public Usuario registrar(Usuario usuario) {
        // Asignar un tipo por defecto si no viene uno
        Usuario.TipoUsuario tipo = (usuario.getTipo() == null) ? Usuario.TipoUsuario.CIUDADANO : usuario.getTipo();

        // Asignar un username por defecto si no viene uno
        String username = (usuario.getUsername() == null || usuario.getUsername().isEmpty())
            ? usuario.getEmail().split("@")[0]
            : usuario.getUsername();

        // Usar el factory correcto, que ahora se encarga de hashear la contraseña
        Usuario nuevo = UsuarioFactory.createUsuario(
            tipo,
            usuario.getNombre(),
            username,
            usuario.getEmail(),
            usuario.getPassword(), // Se pasa la contraseña en texto plano
            passwordEncoder      // Se pasa el encoder
        );

        return usuarioRepository.save(nuevo);
    }

    public Optional<Usuario> login(String email, String password) {
        return usuarioRepository.findByEmail(email)
                // Usar el encoder para comparar la contraseña del request con la hasheada en la BD
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .filter(user -> Boolean.TRUE.equals(user.getActivo()));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Optional<Usuario> actualizar(Long id, Usuario datos) {
        return usuarioRepository.findById(id).map(u -> {
            if (datos.getNombre() != null)   u.setNombre(datos.getNombre());
            if (datos.getTelefono() != null) u.setTelefono(datos.getTelefono());
            if (datos.getTipo() != null)     u.setTipo(datos.getTipo());
            return usuarioRepository.save(u);
        });
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> listarPorTipo(Usuario.TipoUsuario tipo) {
        return usuarioRepository.findByTipo(tipo);
    }
}
