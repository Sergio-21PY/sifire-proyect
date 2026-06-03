package cl.sifire.monitoreo.controller;

import cl.sifire.monitoreo.model.AsignacionBrigada;
import cl.sifire.monitoreo.model.Brigada;
import cl.sifire.monitoreo.model.RutaEvacuacion;
import cl.sifire.monitoreo.model.ZonaRiesgo;
import cl.sifire.monitoreo.service.MonitoreoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MonitoreoController.class)
public class MonitoreoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MonitoreoService monitoreoService; // Copia falsa del servicio para simular su comportamiento.

    @Autowired
    private ObjectMapper objectMapper; // Para convertir objetos a JSON.

    // --- Datos de prueba ---
    private Brigada brigada;
    private ZonaRiesgo zonaRiesgo;
    private RutaEvacuacion rutaEvacuacion;
    private AsignacionBrigada asignacionBrigada;

    @BeforeEach
    void setUp() {
        // Se inicializan los objetos de prueba antes de cada test.
        brigada = new Brigada(1L, "Brigada Alpha", Brigada.TipoBrigada.FORESTAL, Brigada.EstadoBrigada.DISPONIBLE, -33.45694, -70.64827);
        zonaRiesgo = new ZonaRiesgo(1L, "Zona 1", ZonaRiesgo.NivelRiesgo.ALTO, "[-33.45,-70.65]", true);
        rutaEvacuacion = new RutaEvacuacion(1L, "Ruta 1", "[-33.45,-70.65]", "Ruta de evacuacion principal", true);
        asignacionBrigada = new AsignacionBrigada(1L, 1L, brigada, LocalDateTime.now(), null);
    }

    // --- Pruebas ---

    @Test
    void testSincronizarFoco() throws Exception {
        // Preparamos el payload que simula la llegada de datos de un foco de incendio.
        Map<String, Object> payload = new HashMap<>();
        payload.put("reporteId", 1L);
        payload.put("estado", "Activo");
        payload.put("nivelRiesgo", "Alto");

        // Le decimos al servicio falso que no haga nada cuando se llame a sincronizarFoco.
        doNothing().when(monitoreoService).sincronizarFoco(1L, "Activo", "Alto");

        // Simulamos una petición POST al endpoint y esperamos que la respuesta sea un 200 OK.
        mockMvc.perform(post("/api/monitoreo/focos/sincronizar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());

        // Verificamos que el método del servicio falso fue llamado exactamente una vez.
        verify(monitoreoService, times(1)).sincronizarFoco(1L, "Activo", "Alto");
    }

    @Test
    void testObtenerZonasRiesgo() throws Exception {
        // Cuando se pida la lista de zonas activas, el servicio falso devolverá nuestra zona de prueba.
        when(monitoreoService.obtenerZonasActivas()).thenReturn(Collections.singletonList(zonaRiesgo));

        // Realizamos la petición GET y verificamos que la respuesta sea 200 OK y contenga el nombre de la zona.
        mockMvc.perform(get("/api/monitoreo/zonas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Zona 1"));
    }

    @Test
    void testObtenerTodasLasAsignaciones() throws Exception {
        // Configuramos el servicio falso para que devuelva una lista con nuestra asignación de prueba.
        when(monitoreoService.obtenerTodasLasAsignaciones()).thenReturn(Collections.singletonList(asignacionBrigada));

        // Hacemos la llamada al endpoint y comprobamos que el resultado sea el esperado.
        mockMvc.perform(get("/api/monitoreo/asignaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reporteId").value(1L));
    }

    @Test
    void testObtenerRutasEvacuacion() throws Exception {
        // El servicio falso devolverá la ruta de evacuación de prueba cuando se le pida.
        when(monitoreoService.obtenerRutasActivas()).thenReturn(Collections.singletonList(rutaEvacuacion));

        // Verificamos que la petición GET a /rutas nos dé un 200 OK y el nombre de la ruta correcta.
        mockMvc.perform(get("/api/monitoreo/rutas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Ruta 1"));
    }

    @Test
    void testObtenerBrigadas() throws Exception {
        // Le decimos al servicio que, cuando le pidan todas las brigadas, devuelva nuestra brigada de prueba.
        when(monitoreoService.obtenerTodasLasBrigadas()).thenReturn(Collections.singletonList(brigada));

        // Probamos el endpoint y esperamos que nos devuelva la brigada "Brigada Alpha".
        mockMvc.perform(get("/api/monitoreo/brigadas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Brigada Alpha"));
    }

    @Test
    void testActualizarBrigada() throws Exception {
        // Cuando se intente actualizar cualquier brigada con cualquier ID, el servicio devolverá nuestra brigada de prueba.
        when(monitoreoService.actualizarBrigada(anyLong(), any(Brigada.class))).thenReturn(brigada);

        // Simulamos una petición PUT para actualizar la brigada con ID 1.
        mockMvc.perform(put("/api/monitoreo/brigadas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brigada)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Brigada Alpha"));
    }

    @Test
    void testAsignarBrigada() throws Exception {
        // Preparamos el cuerpo de la petición para asignar una brigada a un reporte.
        Map<String, Long> body = new HashMap<>();
        body.put("reporteId", 1L);
        body.put("brigadaId", 1L);

        // El servicio falso devolverá la asignación de prueba cuando se le pida asignar.
        when(monitoreoService.asignarBrigada(1L, 1L)).thenReturn(asignacionBrigada);

        // Realizamos la petición POST y verificamos que la asignación se haya creado correctamente.
        mockMvc.perform(post("/api/monitoreo/asignaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reporteId").value(1L));
    }

    @Test
    void testObtenerAsignaciones() throws Exception {
        // Cuando se busquen asignaciones por el reporte con ID 1, el servicio devolverá nuestra asignación de prueba.
        when(monitoreoService.obtenerAsignacionesPorReporte(1L)).thenReturn(Collections.singletonList(asignacionBrigada));

        // Verificamos que la petición GET nos devuelva la asignación correcta.
        mockMvc.perform(get("/api/monitoreo/asignaciones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reporteId").value(1L));
    }

    @Test
    void testCrearBrigada() throws Exception {
        // Cuando se intente crear cualquier brigada, el servicio devolverá nuestra brigada de prueba.
        when(monitoreoService.crearBrigada(any(Brigada.class))).thenReturn(brigada);

        // Simulamos la creación de una nueva brigada y esperamos que la respuesta sea la brigada creada.
        mockMvc.perform(post("/api/monitoreo/brigadas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brigada)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Brigada Alpha"));
    }

    @Test
    void testLiberarBrigadaPorReporte() throws Exception {
        // Le decimos al servicio falso que no haga nada cuando se llame a liberar la brigada.
        doNothing().when(monitoreoService).liberarBrigadaPorReporte(1L);

        // Realizamos una petición PUT para liberar la brigada y esperamos un 200 OK.
        mockMvc.perform(put("/api/monitoreo/brigadas/liberar-por-reporte/1"))
                .andExpect(status().isOk());

        // Verificamos que el método del servicio para liberar la brigada haya sido llamado.
        verify(monitoreoService, times(1)).liberarBrigadaPorReporte(1L);
    }
}
