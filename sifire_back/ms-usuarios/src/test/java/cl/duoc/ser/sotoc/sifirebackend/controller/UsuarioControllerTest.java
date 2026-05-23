package cl.duoc.ser.sotoc.sifirebackend.controller;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;


import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService; //Copia del service para realizar pruebas

    @Autowired
    private ObjectMapper objectMapper;

    private Usuario usuarioMock; //Molde de prueba de Usuario.

    @BeforeEach
    void setUp() {
        /*Usuario de prueba en memoria utilizando el patron "Builder" de lombok
         * Se agrega @Builder en la carpeta de "Model" dentro de la clase usuario agregamos.
         * */
        usuarioMock = Usuario.builder()
                .id(1L)
                .nombre("Juan Perez")
                .email("juan.perez@sifire.cl")
                .password("securePassword123")
                .tipo(Usuario.TipoUsuario.BRIGADISTA)
                .build();
    }


    // -- Prueba N°1: Listar usuarios
    @Test
    void listarUsuarios() throws Exception {
        List<Usuario> lista = Arrays.asList(usuarioMock); //Se prepara el usuario de prueba en una lista.
        when(usuarioService.listarTodos()).thenReturn(lista); // Retorna la lista de usuarios "En nuestro caso el ficticio."

        // -- Simulacion de peticion GET a la URL de listar.
        mockMvc.perform(get("/api/usuarios/listar"))
                .andExpect(status().isOk()) // -- Respuesta HTTP 200
                .andExpect(jsonPath("$.size()").value(1)) //-- Cantidad de usuarios que queremos que vengan en la lista.
                .andExpect(jsonPath("$[0].nombre").value("Juan Perez")); //-- Usuario que queremos que nos traiga en la lista.

        /*
        Con verify nos aseguramos que se confirme que el controlador realmente llamo al service falso,
        el cual se encuentra instanciado en la parte superior con la anotación de @MockBean
        para la solicitud de datos. Time se encarga de la cantidad de veces que va a realizar la solicitud del dato y el método que se ta solicitando.
        */
        verify(usuarioService, times(1)).listarTodos();
    }

    // -- Prueba N°2: Obtener usuario por ID
    @Test
    void obtenerUsuarioPorId() throws Exception {
        // -- Se programa el servicio falso para que al buscar el ID 1 devuelva el usuario de prueba.
        when(usuarioService.buscarPorId(1L)).thenReturn(Optional.of(usuarioMock));

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk()) //-- Respuesta HTTP 200
                .andExpect(jsonPath("$.email").value("juan.perz@sifire.cl")); //-- Dato que queremos que nos traiga.
                                                                                                    /*Pueden cambiar el email y ver en consola que les dice que
                                                                                                        no coincide con el usuario de la ID
                                                                                                     */
    }

    // -- Prueba N°3: Obtener usuario por ID que no existe
    @Test
    void obtenerPorId_CuandoNoExiste() throws Exception {
        // -- Se prepara el service falso para que al buscar el ID 99, devuelva un Optional vacío simulando que no existe en la base de datos.
        when(usuarioService.buscarPorId(99L)).thenReturn(Optional.empty());

        // -- Simulacion de peticion GET a la URL buscando un ID que no está registrado (el 99).
        mockMvc.perform(get("/api/usuarios/99"))
                .andExpect(status().isNotFound()); // -- Respuesta HTTP 404

    /*
    Verificamos que el controlador, a pesar de que el usuario no existía, de todas formas cumplió con ir
    a solicitar el dato al service falso exactamente 1 vez pasando el ID 99L.
    */
        verify(usuarioService, times(1)).buscarPorId(99L);
    }
}

