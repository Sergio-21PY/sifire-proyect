package cl.duoc.ser.sotoc.sifirebackend.controller;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import cl.duoc.ser.sotoc.sifirebackend.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Gestión de Usuarios", description = "Endpoints para registrar, autenticar y gestionar usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Operation(summary = "Registrar un nuevo usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de registro inválidos")
    })
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario){
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    @Operation(summary = "Autenticar un usuario y obtener un token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login exitoso, devuelve el token"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginReq){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginReq.getEmail(), loginReq.getPassword())
        );

        UserDetails user = usuarioRepository.findByEmail(loginReq.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of("token", token));
    }

    @Operation(summary = "Listar todos los usuarios (protegido)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado, se requiere token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/listar")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @Operation(summary = "Listar usuarios por tipo (protegido)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado, se requiere token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/por-tipo/{tipo}")
    public ResponseEntity<List<Usuario>> listarUsuariosPorTipo(@PathVariable String tipo) {
        try {
            Usuario.TipoUsuario tipoEnum = Usuario.TipoUsuario.valueOf(tipo.toUpperCase());
            return ResponseEntity.ok(usuarioRepository.findByTipo(tipoEnum));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Devuelve 400 si el tipo no es válido
        }
    }

    @Operation(summary = "Obtener un usuario por su ID (protegido)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado, se requiere token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id){
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar un usuario por su ID (protegido)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Usuario eliminado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado, se requiere token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id){
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
