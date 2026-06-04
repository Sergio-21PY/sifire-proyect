package cl.sifire.alertas.controller;

import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.service.AlertaService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AlertaController.class)
public class AlertaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AlertaService alertaService; // Copia falsa del servicio para simular su comportamiento.

    @Autowired
    private ObjectMapper objectMapper; // Para convertir objetos a JSON.

    // --- Datos de prueba ---
    private Alerta alerta;

    @BeforeEach
    void setUp() {
        // Se inicializa el objeto de prueba antes de cada test.
        alerta = new Alerta();
        alerta.setId(1L);
        alerta.setReporteId(100L);
        alerta.setBrigadistaId(50L);
        alerta.setTitulo("Incendio Forestal en Valparaíso");
        alerta.setMensaje("Se requiere atención inmediata.");
        alerta.setEstado(Alerta.Estado.PENDIENTE);
        alerta.setCreatedAt(LocalDateTime.now());
    }

    // --- Pruebas ---

    @Test
    void testEmitirAlerta() throws Exception {
        // Cuando se intente crear cualquier alerta, el servicio devolverá nuestra alerta de prueba.
        when(alertaService.crearAlerta(any(Alerta.class))).thenReturn(alerta);

        // Simulamos una petición POST para emitir una nueva alerta.
        mockMvc.perform(post("/api/alertas/emitir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alerta)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Incendio Forestal en Valparaíso"));
    }

    @Test
    void testListarAlertas() throws Exception {
        // El servicio falso devolverá una lista con nuestra alerta de prueba.
        when(alertaService.obtenerTodas()).thenReturn(Collections.singletonList(alerta));

        // Realizamos la petición GET y verificamos que la respuesta sea 200 OK y contenga el título de la alerta.
        mockMvc.perform(get("/api/alertas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Incendio Forestal en Valparaíso"));
    }

    @Test
    void testReenviarAlerta() throws Exception {
        // Cuando se intente reenviar una alerta, el servicio devolverá la alerta con el estado actualizado.
        alerta.setEstado(Alerta.Estado.PENDIENTE);
        when(alertaService.actualizarEstado(1L, Alerta.Estado.PENDIENTE)).thenReturn(alerta);

        // Simulamos la petición GET para reenviar la alerta y verificamos que el estado sea PENDIENTE.
        mockMvc.perform(get("/api/alertas/1/reenviar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));
    }

    @Test
    void testObtenerAlertasPorEstado() throws Exception {
        // El servicio devolverá una lista de alertas que coincidan con el estado PENDIENTE.
        when(alertaService.obtenerPorEstado(Alerta.Estado.PENDIENTE)).thenReturn(Collections.singletonList(alerta));

        // Hacemos la petición GET y comprobamos que nos devuelva las alertas en estado PENDIENTE.
        mockMvc.perform(get("/api/alertas/estado/PENDIENTE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].estado").value("PENDIENTE"));
    }

    @Test
    void testObtenerAlertasPorReporte() throws Exception {
        // El servicio devolverá las alertas asociadas a un ID de reporte específico.
        when(alertaService.obtenerPorReporteId(100L)).thenReturn(Collections.singletonList(alerta));

        // Verificamos que la petición GET nos devuelva las alertas del reporte 100.
        mockMvc.perform(get("/api/alertas/reporte/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reporteId").value(100L));
    }

    @Test
    void testEmitirAlertaBrigadista() throws Exception {
        // Preparamos el cuerpo de la petición para emitir una alerta a un brigadista.
        Map<String, Object> request = new HashMap<>();
        request.put("reporteId", 100L);
        request.put("brigadistaId", 50L);
        request.put("titulo", "Alerta para brigadista");
        request.put("descripcion", "Incendio cercano a su ubicación.");
        request.put("latitud", -33.45);
        request.put("longitud", -70.65);

        // El servicio falso devolverá la alerta creada para el brigadista.
        when(alertaService.emitirAlertaBrigadista(anyLong(), anyLong(), any(), any(), any(), any())).thenReturn(alerta);

        // Realizamos la petición POST y verificamos que la alerta se haya creado correctamente.
        mockMvc.perform(post("/api/alertas/brigadista/emitir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brigadistaId").value(50L));
    }

    @Test
    void testObtenerAlertasActivasBrigadista() throws Exception {
        // El servicio devolverá las alertas activas (asignadas o pendientes) de un brigadista.
        when(alertaService.obtenerAlertasActivasBrigadista(50L)).thenReturn(Collections.singletonList(alerta));

        // Verificamos que la petición GET nos devuelva las alertas activas del brigadista 50.
        mockMvc.perform(get("/api/alertas/brigadista/50/activas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].brigadistaId").value(50L));
    }

    @Test
    void testResolverAlerta() throws Exception {
        // Cuando se intente resolver una alerta, el servicio devolverá la alerta con el estado RESUELTA.
        alerta.setEstado(Alerta.Estado.RESUELTA);
        when(alertaService.resolverAlerta(1L)).thenReturn(alerta);

        // Simulamos la petición POST para resolver la alerta y verificamos que el estado cambie a RESUELTA.
        mockMvc.perform(post("/api/alertas/1/resolver"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("RESUELTA"));
    }
}
