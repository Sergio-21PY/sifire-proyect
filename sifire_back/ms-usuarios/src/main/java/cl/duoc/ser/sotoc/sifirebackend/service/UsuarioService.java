package cl.duoc.ser.sotoc.sifirebackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.duoc.ser.sotoc.sifirebackend.factory.UsuarioFactory;
import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Registra un nuevo usuario usando el Factory Method (UsuarioFactory).
     * La fábrica se encarga de asignar el tipo correcto y las reglas de negocio.
     * Integración del patrón Factory Method desarrollado por Sergio.
     */
    public Usuario registrar(Usuario usuario) {
        String tipo = usuario.getTipo() != null
            ? usuario.getTipo().name()
            : "CIUDADANO";

        String username = (usuario.getUsername() == null || usuario.getUsername().isEmpty())
            ? usuario.getEmail().split("@")[0]
            : usuario.getUsername();

        // Factory Method — delega la creación al factory según el tipo
        Usuario nuevo = UsuarioFactory.crear(
            tipo,
            usuario.getNombre(),
            username,
            usuario.getEmail(),
            usuario.getPassword(),
            usuario.getTelefono()
        );

        return usuarioRepository.save(nuevo);
    }

    // Autenticar usuario por email y password, solo si está activo
    public Optional<Usuario> login(String email, String password) {
        return usuarioRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .filter(u -> Boolean.TRUE.equals(u.getActivo()));
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

    /**
     * Endpoint diseñado por Sergio — lista usuarios por tipo de rol.
     * Permite a otros microservicios (como ms-alertas) consultar brigadistas disponibles.
     */
    public List<Usuario> listarPorTipo(Usuario.TipoUsuario tipo) {
        return usuarioRepository.findByTipo(tipo);
    }
}