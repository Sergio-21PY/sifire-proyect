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
        usuario.setNombre("Juan Perez");
        usuario.setEmail("juan@sifire.cl");
        usuario.setPassword("pass123");
        usuario.setTelefono("+56912345678");
        usuario.setTipo(Usuario.TipoUsuario.CIUDADANO);
        usuario.setActivo(true);
        usuario.setUsername("juanperez");
    }

    @Test
    void listarTodos_debeRetornarListaDeUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario));
        List<Usuario> resultado = usuarioService.listarTodos();
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Juan Perez", resultado.get(0).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void buscarPorId_cuandoExiste_debeRetornarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        Optional<Usuario> resultado = usuarioService.buscarPorId(1L);
        assertTrue(resultado.isPresent());
        assertEquals("juan@sifire.cl", resultado.get().getEmail());
    }

    @Test
    void buscarPorId_cuandoNoExiste_debeRetornarVacio() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());
        Optional<Usuario> resultado = usuarioService.buscarPorId(99L);
        assertFalse(resultado.isPresent());
    }

    @Test
    void login_credencialesCorrectas_debeAutenticar() {
        when(usuarioRepository.findByEmail("juan@sifire.cl")).thenReturn(Optional.of(usuario));
        Optional<Usuario> resultado = usuarioService.login("juan@sifire.cl", "pass123");
        assertTrue(resultado.isPresent());
    }

    @Test
    void login_passwordIncorrecta_debeRetornarVacio() {
        when(usuarioRepository.findByEmail("juan@sifire.cl")).thenReturn(Optional.of(usuario));
        Optional<Usuario> resultado = usuarioService.login("juan@sifire.cl", "wrongpass");
        assertFalse(resultado.isPresent());
    }

    @Test
    void login_usuarioInactivo_debeRetornarVacio() {
        usuario.setActivo(false);
        when(usuarioRepository.findByEmail("juan@sifire.cl")).thenReturn(Optional.of(usuario));
        Optional<Usuario> resultado = usuarioService.login("juan@sifire.cl", "pass123");
        assertFalse(resultado.isPresent());
    }

    @Test
    void eliminar_debeInvocarDeleteById() {
        doNothing().when(usuarioRepository).deleteById(1L);
        usuarioService.eliminar(1L);
        verify(usuarioRepository, times(1)).deleteById(1L);
    }

    @Test
    void listarPorTipo_debeRetornarBrigadistas() {
        Usuario brigadista = new Usuario();
        brigadista.setTipo(Usuario.TipoUsuario.BRIGADISTA);
        when(usuarioRepository.findByTipo(Usuario.TipoUsuario.BRIGADISTA))
            .thenReturn(Arrays.asList(brigadista));
        List<Usuario> resultado = usuarioService.listarPorTipo(Usuario.TipoUsuario.BRIGADISTA);
        assertEquals(1, resultado.size());
        assertEquals(Usuario.TipoUsuario.BRIGADISTA, resultado.get(0).getTipo());
    }

    @Test
    void actualizar_cuandoExiste_debeActualizarCampos() {
        Usuario datosNuevos = new Usuario();
        datosNuevos.setNombre("Juan Actualizado");
        datosNuevos.setTelefono("+56999999999");
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        Optional<Usuario> resultado = usuarioService.actualizar(1L, datosNuevos);
        assertTrue(resultado.isPresent());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}
