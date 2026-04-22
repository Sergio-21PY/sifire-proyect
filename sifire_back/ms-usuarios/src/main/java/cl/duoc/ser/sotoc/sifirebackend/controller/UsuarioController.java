package cl.duoc.ser.sotoc.sifirebackend.controller;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los usuarios
    @GetMapping("/listar")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Registrar un nuevo usuario
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario){
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    // Login Simple (por email)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginReq){
        return usuarioRepository.findByEmail(loginReq.getEmail())
                .filter(u -> u.getPassword().equals(loginReq.getPassword()))
                .map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.status(401).build());

    }

    // Buscar perfil del usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id){
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // Eliminar usuario por ID
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id){
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


}
