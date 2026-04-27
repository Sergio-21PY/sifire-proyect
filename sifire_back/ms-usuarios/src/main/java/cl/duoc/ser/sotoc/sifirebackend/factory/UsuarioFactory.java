package cl.duoc.ser.sotoc.sifirebackend.factory;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;

public class UsuarioFactory {

    public static Usuario createUsuario(String rol, String username, String email, String password) {
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(password);

        switch (rol.toUpperCase()) {
            case "FUNCIONARIO":
                usuario.setRol("FUNCIONARIO");
                break;
            case "BRIGADISTA":
                usuario.setRol("BRIGADISTA");
                break;
            case "CIUDADANO":
                usuario.setRol("CIUDADANO");
                break;
            default:
                throw new IllegalArgumentException("Rol de usuario desconocido: " + rol);
        }
        return usuario;
    }
}
