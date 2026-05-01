package cl.duoc.ser.sotoc.sifirebackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;


@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // metodo para registrar un nuevo usuario, asignando un tipo por defecto si no se especifica
    public Usuario registrar(Usuario usuario) {
        if (usuario.getTipo() == null) {
            usuario.setTipo(Usuario.TipoUsuario.CIUDADANO);
        }
        if (usuario.getUsername() == null || usuario.getUsername().isEmpty()) {
            usuario.setUsername(usuario.getEmail().split("@")[0]);
        }
        usuario.setActivo(true);
        return usuarioRepository.save(usuario);
    }

    // metodo para autenticar un usuario por email y password, solo si está activo
     public Optional<Usuario> login(String email, String password) {
        return usuarioRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .filter(u -> Boolean.TRUE.equals(u.getActivo()));
    }

    // otros metodos
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
} 
