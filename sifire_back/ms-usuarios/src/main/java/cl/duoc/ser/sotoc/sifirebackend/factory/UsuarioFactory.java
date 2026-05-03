package cl.duoc.ser.sotoc.sifirebackend.factory;


import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;

/**
 * Factory Method para creación de usuarios según su tipo.
 * Integración del trabajo de Sergio (rama master) adaptado al modelo de dev.
 *
 * Cada tipo de usuario tiene sus propias reglas de creación.
 * Si se necesita un nuevo tipo en el futuro, solo se agrega un caso aquí
 * sin tocar el resto del sistema.
 */
public class UsuarioFactory {

    public static Usuario crear(String tipo, String nombre, String username,
                                String email, String password, String telefono) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(password);
        usuario.setTelefono(telefono);
        usuario.setActivo(true);

        switch (tipo.toUpperCase()) {
            case "FUNCIONARIO"   -> usuario.setTipo(Usuario.TipoUsuario.FUNCIONARIO);
            case "BRIGADISTA"    -> usuario.setTipo(Usuario.TipoUsuario.BRIGADISTA);
            case "CIUDADANO"     -> usuario.setTipo(Usuario.TipoUsuario.CIUDADANO);
            case "ADMINISTRADOR" -> usuario.setTipo(Usuario.TipoUsuario.ADMINISTRADOR);
            default -> throw new IllegalArgumentException(
                "Tipo de usuario desconocido: " + tipo +
                ". Valores válidos: CIUDADANO, BRIGADISTA, FUNCIONARIO, ADMINISTRADOR"
            );
        }
        return usuario;
    }
}