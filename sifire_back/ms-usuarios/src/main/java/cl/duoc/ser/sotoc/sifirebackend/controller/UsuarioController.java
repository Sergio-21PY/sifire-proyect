package cl.duoc.ser.sotoc.sifirebackend.controller;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
<<<<<<< HEAD
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import cl.duoc.ser.sotoc.sifirebackend.service.JwtService;
=======
import cl.duoc.ser.sotoc.sifirebackend.service.UsuarioService;

>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90
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

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

<<<<<<< HEAD
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Obtener todos los usuarios
=======
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90
    @GetMapping("/listar")
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarTodos();
    }

<<<<<<< HEAD
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
=======
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> obtenerPorEmail(@PathVariable String email) {
        return usuarioService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
<<<<<<< HEAD
}
=======

    /**
     * Endpoint diseñado por Sergio — permite consultar usuarios por tipo de rol.
     * Usado por ms-alertas para obtener brigadistas disponibles.
     * Ejemplo: GET /api/usuarios/por-tipo/BRIGADISTA
     */
    @GetMapping("/por-tipo/{tipo}")
    public ResponseEntity<List<Usuario>> listarPorTipo(@PathVariable String tipo) {
        try {
            Usuario.TipoUsuario tipoEnum = Usuario.TipoUsuario.valueOf(tipo.toUpperCase());
            List<Usuario> usuarios = usuarioService.listarPorTipo(tipoEnum);
            return ResponseEntity.ok(usuarios);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.registrar(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return usuarioService.login(body.get("email"), body.get("password"))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(
        @PathVariable Long id,
        @RequestBody Usuario datos
    ) {
        return usuarioService.actualizar(id, datos)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90
