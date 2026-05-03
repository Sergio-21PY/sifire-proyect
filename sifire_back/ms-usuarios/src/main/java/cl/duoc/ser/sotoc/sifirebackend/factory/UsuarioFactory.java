package cl.duoc.ser.sotoc.sifirebackend.factory;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UsuarioFactory {

    public static Usuario createUsuario(Usuario.TipoUsuario tipo, String nombre, String username, String email, String rawPassword, PasswordEncoder passwordEncoder) {
        Usuario usuario = new Usuario();
        usuario.setTipo(tipo);
        usuario.setNombre(nombre);
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(rawPassword));
        usuario.setActivo(true);

        return usuario;
    }
}
