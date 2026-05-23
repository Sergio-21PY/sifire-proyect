package cl.sifire.reportes.controller;

import cl.sifire.reportes.dto.CambioEstadoDTO;
import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import cl.sifire.reportes.service.ReporteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReporteController.class)
class ReporteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // MockBean reemplaza el service real por un mock dentro del contexto Spring
    @MockBean
    private ReporteService reporteService;

    @Autowired
    private ObjectMapper objectMapper;

    private ReporteIncendio reporte;

    @BeforeEach
    void setUp() {
        reporte = new ReporteIncendio();
        reporte.setId(1L);
        reporte.setTitulo("Incendio en el cerro");
        reporte.setEstado(ReporteIncendio.EstadoReporte.PENDIENTE);
        reporte.setTipoReportante(ReporteIncendio.TipoReportante.CIUDADANO);
        reporte.setNivelRiesgo(ReporteIncendio.NivelRiesgo.MEDIO);
        reporte.setLatitud(-33.43);
        reporte.setLongitud(-70.65);
        reporte.setUsuarioId(1L);
        reporte.setDescripcion("Foco visible");
    }

    @Test
    void POST_crearReporte_DebeRetornar200YElReporteCreado() throws Exception {
        ReporteRequestDTO dto = new ReporteRequestDTO();
        dto.setTipoReportante(ReporteIncendio.TipoReportante.CIUDADANO);
        dto.setTitulo("Incendio en el cerro");
        dto.setUsuarioId(1L);
        dto.setLatitud(-33.43);
        dto.setLongitud(-70.65);
        dto.setDescripcion("Foco visible");

        when(reporteService.crearReporte(any())).thenReturn(reporte);

        mockMvc.perform(post("/api/reportes/crear")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Incendio en el cerro"));
    }

    @Test
    void GET_listarReportes_DebeRetornar200YLaLista() throws Exception {
        when(reporteService.listarTodos()).thenReturn(List.of(reporte));

        mockMvc.perform(get("/api/reportes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Incendio en el cerro"));
    }

    @Test
    void GET_obtenerPorId_DebeRetornar200ConElReporte() throws Exception {
        when(reporteService.obtenerPorId(1L)).thenReturn(reporte);

        mockMvc.perform(get("/api/reportes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void PUT_cambiarEstado_DebeRetornar200ConEstadoActualizado() throws Exception {
        reporte.setEstado(ReporteIncendio.EstadoReporte.EN_PROCESO);

        CambioEstadoDTO cambio = new CambioEstadoDTO();
        cambio.setNuevoEstado(ReporteIncendio.EstadoReporte.EN_PROCESO);
        cambio.setUsuarioId(1L);

        when(reporteService.cambiarEstado(eq(1L), any())).thenReturn(reporte);

        mockMvc.perform(put("/api/reportes/1/estado")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cambio)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("EN_PROCESO"));
    }
}
