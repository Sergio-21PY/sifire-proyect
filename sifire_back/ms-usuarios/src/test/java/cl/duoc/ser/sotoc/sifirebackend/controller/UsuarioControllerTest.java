package cl.duoc.ser.sotoc.sifirebackend.controller;

import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;



import java.util.*;


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
        usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setNombre("Juan Perez");
        usuarioMock.setEmail("juan.perez@sifire.cl");
        usuarioMock.setPassword("securePassword123");
        usuarioMock.setTipo(Usuario.TipoUsuario.BRIGADISTA);
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
                .andExpect(jsonPath("$.email").value("juan.perez@sifire.cl")); //-- Dato que queremos que nos traiga.
                                                                                                    /*Pueden cambiar el email y ver en consola que les dice que                                                                                                    no coincide con el usuario de la ID
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

    // -- Prueba N°4: Obtener usuario por Email
    @Test
    void obtenerPorEmail() throws Exception {
        // -- Configuramos el service falso para que al recibir el email específico, nos devuelva nuestro usuarioMock.
        when(usuarioService.buscarPorEmail("juan.perez@sifire.cl")).thenReturn(Optional.of(usuarioMock));

        // -- Simulación de petición GET buscando por el parámetro de email.
        mockMvc.perform(get("/api/usuarios/email/juan.perez@sifire.cl"))
                .andExpect(status().isOk()) // -- Respuesta HTTP 200 (Encontrado)
                .andExpect(jsonPath("$.nombre").value("Juan Perez")); // -- Verificamos que el nombre coincida.
    }

    // -- Prueba N°5: Listar usuarios por su rol/tipo
    @Test
    void listarUsuarioPorRol() throws Exception {
        List<Usuario> brigadistas = Arrays.asList(usuarioMock);
        // -- Simulamos que el servicio filtra y devuelve solo los usuarios de tipo BRIGADISTA.
        when(usuarioService.listarPorTipo(Usuario.TipoUsuario.BRIGADISTA)).thenReturn(brigadistas);

        mockMvc.perform(get("/api/usuarios/por-tipo/BRIGADISTA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tipo").value("BRIGADISTA")); // -- Validamos que el dato devuelto sea del tipo correcto.
    }

    // -- Prueba N°6: Caso de error al enviar un tipo de usuario inexistente
    @Test
    void listarUsuarioInvalido() throws Exception {
        // -- Simulamos una petición con un texto que no existe en el Enum (ej: "INVALIDO").
        mockMvc.perform(get("/api/usuarios/por-tipo/INVALIDO"))
                .andExpect(status().isBadRequest()); // -- Respuesta HTTP 400 (Petición incorrecta)

        // -- Con verifyNoInteractions aseguramos que, como el parámetro fue malo, ni siquiera se llamó al servicio.
        verifyNoInteractions(usuarioService);
    }

    // -- Prueba N°7: Registro de nuevo usuario
    @Test
    void registrarUsuario() throws Exception {
        // -- Programamos el mock para que cualquier objeto Usuario que reciba, devuelva el usuarioMock con su ID ya asignada.
        when(usuarioService.registrar(any(Usuario.class))).thenReturn(usuarioMock);

        // -- Simulación de POST enviando el objeto usuarioMock convertido a JSON.
        mockMvc.perform(post("/api/usuarios/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioMock))) // -- Convierte el objeto Java a String JSON.
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    // -- Prueba N°8: Intento de Login exitoso
    @Test
    void loginCorrecto() throws Exception {
        // -- Preparamos el mapa de datos que simula lo que el usuario envía desde el Frontend.
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juan.perez@sifire.cl");
        loginRequest.put("password", "securePassword123");

        when(usuarioService.login("juan.perez@sifire.cl", "securePassword123"))
                .thenReturn(Optional.of(usuarioMock));

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("juan.perez@sifire.cl"));
    }


    // -- Prueba N°9: Intento de Login fallido
    @Test
    void loginIncorrecto() throws Exception {
        // -- Preparamos el mapa con las credenciales que no existen o están mal escritas.
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juanperez@nosifire.cl");
        loginRequest.put("password", "123456789");

        /* Se programa el service falso para que al intentar loguearse con estos datos,
         devuelva un Optional vacío simulando que las credenciales no coinciden en la BD.
        */
        when(usuarioService.login("juanperez@nosifire.cl", "123456789")).thenReturn(Optional.empty());

        // -- Simulación de petición POST al endpoint de login enviando los datos erróneos.
        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized()); // -- Respuesta HTTP 401 (No autorizado)

        /*
         Verificamos que el controlador realmente consultó al servicio para validar
         estos datos fallidos exactamente 1 vez.
        */
        verify(usuarioService, times(1)).login("juanperez@nosifire.cl", "123456789");
    }

    // -- Prueba N°10: Actualizar datos de un usuario
    @Test
    void actualizarUsuario() throws Exception {
        /* Se programa el service para que al recibir el ID 1 y cualquier objeto de tipo Usuario,
           responda con el usuarioMock envuelto en un Optional (simulando que el usuario sí existe).
        */
        when(usuarioService.actualizar(eq(1L), any(Usuario.class))).thenReturn(Optional.of(usuarioMock));

        // -- Simulación de petición PUT enviando el JSON del usuario para actualizar el ID 1.
        mockMvc.perform(put("/api/usuarios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioMock)))
                .andExpect(status().isOk()); // -- Respuesta HTTP 200 (Actualización exitosa)

        /* Confirmamos que se llamó al método actualizar del service pasando el ID correcto
           y cualquier cuerpo de usuario exactamente una vez.
        */
        verify(usuarioService, times(1)).actualizar(eq(1L), any(Usuario.class));
    }

    // -- Prueba N°11: Eliminar un usuario
    @Test
    void eliminarUsuario() throws Exception {
        /* Como el método eliminar suele ser de tipo 'void', le indicamos al Mock
           que "no haga nada" (doNothing) cuando se llame con el ID 1.
        */
        doNothing().when(usuarioService).eliminar(1L);

        // -- Simulación de petición DELETE a la URL de eliminación pasando el ID 1.
        mockMvc.perform(delete("/api/usuarios/eliminar/1"))
                .andExpect(status().isNoContent()); // -- Respuesta HTTP 204 (Éxito sin contenido)

        /* Verificamos que el controlador cumplió con llamar al método eliminar
           del service falso pasando el ID solicitado.
        */
        verify(usuarioService, times(1)).eliminar(1L);
    }
}

