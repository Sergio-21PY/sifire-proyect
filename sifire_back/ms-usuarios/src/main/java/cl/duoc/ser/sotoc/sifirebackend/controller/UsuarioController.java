package cl.duoc.ser.sotoc.sifirebackend.controller;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import cl.duoc.ser.sotoc.sifirebackend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Obtener todos los usuarios
    @GetMapping("/listar")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Obtener usuarios por rol
    @GetMapping("/por-rol/{rol}")
    public ResponseEntity<List<Usuario>> listarUsuariosPorRol(@PathVariable String rol) {
        return ResponseEntity.ok(usuarioRepository.findByRol(rol));
    }

    // Registrar un nuevo usuario
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario){
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    // Login que devuelve un JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginReq){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginReq.getEmail(), loginReq.getPassword())
        );

        UserDetails user = usuarioRepository.findByEmail(loginReq.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of("token", token));
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
