package cl.duoc.ser.sotoc.sifirebackend.factory;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Clase de test para UsuarioFactory.
 * Escenarios de prueba para que el factory funcione.
 */
class UsuarioFactoryTest {

    @Test
    void testCreateFuncionario() {
        // model
        String rol = "FUNCIONARIO";
        String username = "ana.martinez";
        String email = "ana.martinez@demo.cl";
        String password = "password123";

        // 2. Act (Actuar): Llamamos al método que vamos a probar.
        Usuario usuario = UsuarioFactory.createUsuario(rol, username, email, password);

        // 3. Assert (Afirmar): Verificamos que el resultado es el esperado.
        assertNotNull(usuario, "El usuario no debería ser nulo");
        assertEquals(rol, usuario.getRol(), "El rol del usuario debe ser FUNCIONARIO");
        assertEquals(username, usuario.getUsername(), "El username no coincide");
        assertEquals(email, usuario.getEmail(), "El email no coincide");
        assertEquals(password, usuario.getPassword(), "La contraseña no coincide");
    }

    @Test
    void testCreateBrigadista() {
        // model
        String rol = "BRIGADISTA";
        String username = "carlos.rojas";
        String email = "carlos.rojas@demo.cl";
        String password = "password456";

        // Act
        Usuario usuario = UsuarioFactory.createUsuario(rol, username, email, password);

        // Assert
        assertNotNull(usuario);
        assertEquals(rol, usuario.getRol(), "El rol del usuario debe ser BRIGADISTA");
        assertEquals(password, usuario.getPassword(), "La contraseña no coincide");
    }

    @Test
    void testCreateCiudadanoCaseInsensitive() {
        // Probamos que la fábrica funciona incluso si el rol viene en minúsculas.
        String rol = "ciudadano"; // en minusculas
        String username = "maria.gonzalez";
        String email = "maria.gonzalez@demo.cl";
        String password = "password789";

        // Act
        Usuario usuario = UsuarioFactory.createUsuario(rol, username, email, password);

        // Assert
        assertNotNull(usuario);
        assertEquals("CIUDADANO", usuario.getRol(), "El rol debería convertirse a mayúsculas");
    }

    @Test
    void testCreateUsuarioWithInvalidRol() {
        // Probamos que la fábrica lanza una excepción si el rol es desconocido.
        String rol = "ADMINISTRADOR"; // Rol no válido
        String username = "test.user";
        String email = "test@demo.cl";
        String password = "password";

        // Act & Assert
        // Verificamos que se lanza la excepción esperada.
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            UsuarioFactory.createUsuario(rol, username, email, password);
        });

        assertEquals("Rol de usuario desconocido: " + rol, exception.getMessage());
    }
}
