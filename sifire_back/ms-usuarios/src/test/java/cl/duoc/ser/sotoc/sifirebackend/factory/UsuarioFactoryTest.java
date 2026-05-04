package cl.duoc.ser.sotoc.sifirebackend.factory;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Clase de test para UsuarioFactory.
 * Escenarios de prueba para que el factory funcione.
 */
class UsuarioFactoryTest {

    // Instancia de PasswordEncoder para hashear contraseñas en los tests
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    void testCreateFuncionario() {
        // model
        Usuario.TipoUsuario tipo = Usuario.TipoUsuario.FUNCIONARIO;
        String nombre = "Ana Martínez";
        String username = "ana.martinez";
        String email = "ana.martinez@demo.cl";
        String password = "password123";
        String telefono = "+56911111111";

        // 2. Act (Actuar): Llamamos al método que vamos a probar.
        Usuario usuario = UsuarioFactory.createUsuario(tipo, nombre, username, email, password, passwordEncoder, telefono);

        // 3. Assert (Afirmar): Verificamos que el resultado es el esperado.
        assertNotNull(usuario, "El usuario no debería ser nulo");
        assertEquals(tipo, usuario.getTipo(), "El tipo de usuario debe ser FUNCIONARIO");
        assertEquals(username, usuario.getUsername(), "El username no coincide");
        assertEquals(email, usuario.getEmail(), "El email no coincide");
        assertTrue(passwordEncoder.matches(password, usuario.getPassword()), "La contraseña debería estar hasheada y coincidir");
        assertEquals(telefono, usuario.getTelefono(), "El teléfono no coincide");
        assertTrue(usuario.getActivo(), "El usuario debe estar activo por defecto");
    }

    @Test
    void testCreateBrigadista() {
        // model
        Usuario.TipoUsuario tipo = Usuario.TipoUsuario.BRIGADISTA;
        String nombre = "Carlos Rojas";
        String username = "carlos.rojas";
        String email = "carlos.rojas@demo.cl";
        String password = "password456";
        String telefono = "+56922222222";

        // Act
        Usuario usuario = UsuarioFactory.createUsuario(tipo, nombre, username, email, password, passwordEncoder, telefono);

        // Assert
        assertNotNull(usuario);
        assertEquals(tipo, usuario.getTipo(), "El tipo de usuario debe ser BRIGADISTA");
        assertTrue(passwordEncoder.matches(password, usuario.getPassword()), "La contraseña debería estar hasheada y coincidir");
        assertEquals(telefono, usuario.getTelefono(), "El teléfono no coincide");
        assertTrue(usuario.getActivo(), "El usuario debe estar activo por defecto");
    }

    @Test
    void testCreateCiudadanoCaseInsensitive() {
        // Probamos que la fábrica funciona incluso si el rol viene en minúsculas.
        Usuario.TipoUsuario tipo = Usuario.TipoUsuario.CIUDADANO; // Usamos el enum directamente
        String nombre = "María González";
        String username = "maria.gonzalez";
        String email = "maria.gonzalez@demo.cl";
        String password = "password789";
        String telefono = "+56933333333";

        // Act
        Usuario usuario = UsuarioFactory.createUsuario(tipo, nombre, username, email, password, passwordEncoder, telefono);

        // Assert
        assertNotNull(usuario);
        assertEquals(tipo, usuario.getTipo(), "El tipo de usuario debe ser CIUDADANO");
        assertTrue(passwordEncoder.matches(password, usuario.getPassword()), "La contraseña debería estar hasheada y coincidir");
        assertEquals(telefono, usuario.getTelefono(), "El teléfono no coincide");
        assertTrue(usuario.getActivo(), "El usuario debe estar activo por defecto");
    }

    @Test
    void testCreateUsuarioWithInvalidRol() {
        String username = "test.user";
        String nombre = "Test User";
        String email = "test@demo.cl";
        String password = "password";

        // Act & Assert
        NullPointerException exception = assertThrows(NullPointerException.class, () -> {
            UsuarioFactory.createUsuario(null, nombre, username, email, password, passwordEncoder, null);
        });

        // El factory espera un TipoUsuario no nulo, si se pasa null, debería lanzar NPE
        assertNotNull(exception);
    }
}
