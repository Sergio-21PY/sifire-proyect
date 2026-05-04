package cl.duoc.ser.sotoc.sifirebackend.factory;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UsuarioFactory {

    /**
     * Crea una instancia de Usuario, asignando sus propiedades y hasheando la contraseña.
     * @param tipo El tipo de usuario (enum).
     * @param nombre El nombre completo del usuario.
     * @param username El alias o nombre de usuario.
     * @param email El correo electrónico.
     * @param rawPassword La contraseña en texto plano.
     * @param passwordEncoder El encoder para hashear la contraseña.
     * @return Una nueva instancia de Usuario.
     */
    public static Usuario createUsuario(
        Usuario.TipoUsuario tipo, 
        String nombre, 
        String username, 
        String email, 
        String rawPassword, 
        PasswordEncoder passwordEncoder,
        String telefono
    ) {
        Usuario usuario = new Usuario();
        usuario.setTipo(tipo);
        usuario.setNombre(nombre);
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(rawPassword)); // Hashea la contraseña
        usuario.setTelefono(telefono);
        usuario.setActivo(true);

        return usuario;
    }
}
