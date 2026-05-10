package cl.duoc.ser.sotoc.sifirebackend.service;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan Pérez");
        usuario.setEmail("juan@correo.cl");
        usuario.setPassword("1234");
        usuario.setTelefono("912345678");
        usuario.setTipo(Usuario.TipoUsuario.CIUDADANO);
        usuario.setActivo(true);
        usuario.setUsername("juan");
    }

    // ── Registro ────────────────────────────────────────────────────────────

    @Test
    void registrar_DebeGuardarUsuarioConFactory() {
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario resultado = usuarioService.registrar(usuario);

        assertNotNull(resultado);
        assertEquals("juan@correo.cl", resultado.getEmail());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void registrar_SinUsername_DebeUsarEmailComoUsername() {
        Usuario sinUsername = new Usuario();
        sinUsername.setNombre("Ana");
        sinUsername.setEmail("ana@sifire.cl");
        sinUsername.setPassword("pass");
        sinUsername.setTelefono("900000000");
        sinUsername.setTipo(Usuario.TipoUsuario.BRIGADISTA);
        sinUsername.setUsername(null);

        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario resultado = usuarioService.registrar(sinUsername);

        assertNotNull(resultado);
        verify(usuarioRepository).save(any(Usuario.class));
    }

    // ── Login ───────────────────────────────────────────────────────────────

    @Test
    void login_CredencialesCorrectas_DebeRetornarUsuario() {
        when(usuarioRepository.findByEmail("juan@correo.cl"))
                .thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.login("juan@correo.cl", "1234");

        assertTrue(resultado.isPresent());
        assertEquals("Juan Pérez", resultado.get().getNombre());
    }

    @Test
    void login_PasswordIncorrecta_DebeRetornarVacio() {
        when(usuarioRepository.findByEmail("juan@correo.cl"))
                .thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.login("juan@correo.cl", "wrongpass");

        assertFalse(resultado.isPresent());
    }

    @Test
    void login_UsuarioInactivo_DebeRetornarVacio() {
        usuario.setActivo(false);
        when(usuarioRepository.findByEmail("juan@correo.cl"))
                .thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.login("juan@correo.cl", "1234");

        assertFalse(resultado.isPresent());
    }

    @Test
    void login_EmailNoExiste_DebeRetornarVacio() {
        when(usuarioRepository.findByEmail("noexiste@correo.cl"))
                .thenReturn(Optional.empty());

        Optional<Usuario> resultado = usuarioService.login("noexiste@correo.cl", "1234");

        assertFalse(resultado.isPresent());
    }

    // ── Listar ──────────────────────────────────────────────────────────────

    @Test
    void listarTodos_DebeRetornarListaDeUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario));

        List<Usuario> lista = usuarioService.listarTodos();

        assertEquals(1, lista.size());
        verify(usuarioRepository).findAll();
    }

    @Test
    void listarPorTipo_DebeRetornarBrigadistas() {
        Usuario brigadista = new Usuario();
        brigadista.setTipo(Usuario.TipoUsuario.BRIGADISTA);
        brigadista.setActivo(true);

        when(usuarioRepository.findByTipo(Usuario.TipoUsuario.BRIGADISTA))
                .thenReturn(Arrays.asList(brigadista));

        List<Usuario> resultado = usuarioService.listarPorTipo(Usuario.TipoUsuario.BRIGADISTA);

        assertEquals(1, resultado.size());
        assertEquals(Usuario.TipoUsuario.BRIGADISTA, resultado.get(0).getTipo());
    }

    // ── Buscar ──────────────────────────────────────────────────────────────

    @Test
    void buscarPorId_Existente_DebeRetornarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals(1L, resultado.get().getId());
    }

    @Test
    void buscarPorId_NoExistente_DebeRetornarVacio() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Usuario> resultado = usuarioService.buscarPorId(99L);

        assertFalse(resultado.isPresent());
    }

    @Test
    void buscarPorEmail_Existente_DebeRetornarUsuario() {
        when(usuarioRepository.findByEmail("juan@correo.cl")).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.buscarPorEmail("juan@correo.cl");

        assertTrue(resultado.isPresent());
    }

    // ── Actualizar ──────────────────────────────────────────────────────────

    @Test
    void actualizar_CamposValidos_DebeGuardarCambios() {
        Usuario cambios = new Usuario();
        cambios.setNombre("Juan Modificado");
        cambios.setTelefono("999999999");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Optional<Usuario> resultado = usuarioService.actualizar(1L, cambios);

        assertTrue(resultado.isPresent());
        assertEquals("Juan Modificado", resultado.get().getNombre());
        assertEquals("999999999", resultado.get().getTelefono());
    }

    @Test
    void actualizar_UsuarioNoExiste_DebeRetornarVacio() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Usuario> resultado = usuarioService.actualizar(99L, new Usuario());

        assertFalse(resultado.isPresent());
    }

    // ── Eliminar ────────────────────────────────────────────────────────────

    @Test
    void eliminar_DebeInvocarDeleteById() {
        doNothing().when(usuarioRepository).deleteById(1L);

        usuarioService.eliminar(1L);

        verify(usuarioRepository, times(1)).deleteById(1L);
    }
}