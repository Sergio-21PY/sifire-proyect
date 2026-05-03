package cl.duoc.ser.sotoc.sifirebackend.factory;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
<<<<<<< HEAD
import org.springframework.security.crypto.password.PasswordEncoder;

public class UsuarioFactory {

    public static Usuario createUsuario(Usuario.TipoUsuario tipo, String nombre, String username, String email, String rawPassword, PasswordEncoder passwordEncoder) {
=======

/**
 * Factory Method para creacion de usuarios segun su tipo.
 * Cada tipo de usuario tiene sus propias reglas de creacion.
 * Si se necesita un nuevo tipo en el futuro, solo se agrega un caso aqui
 * sin tocar el resto del sistema.
 */
public class UsuarioFactory {

    public static Usuario crear(String tipo, String nombre, String username,
                                String email, String password, String telefono) {
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
        Usuario usuario = new Usuario();
        usuario.setTipo(tipo);
        usuario.setNombre(nombre);
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(rawPassword));
        usuario.setActivo(true);

<<<<<<< HEAD
=======
        switch (tipo.toUpperCase()) {
            case "FUNCIONARIO"   -> usuario.setTipo(Usuario.TipoUsuario.FUNCIONARIO);
            case "BRIGADISTA"    -> usuario.setTipo(Usuario.TipoUsuario.BRIGADISTA);
            case "CIUDADANO"     -> usuario.setTipo(Usuario.TipoUsuario.CIUDADANO);
            case "ADMINISTRADOR" -> usuario.setTipo(Usuario.TipoUsuario.ADMINISTRADOR);
            default -> throw new IllegalArgumentException(
                "Tipo de usuario desconocido: " + tipo +
                ". Valores validos: CIUDADANO, BRIGADISTA, FUNCIONARIO, ADMINISTRADOR"
            );
        }
>>>>>>> 0b24b7cbe439910071b62b1306c0d243655ca1b8
        return usuario;
    }
}
