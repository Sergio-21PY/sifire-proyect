package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ReporteBrigadistaFactoryTest {

    private ReporteBrigadistaFactory factory;
    private ReporteRequestDTO dto;

    @BeforeEach
    void setUp() {
        factory = new ReporteBrigadistaFactory();

        dto = new ReporteRequestDTO();
        dto.setUsuarioId(2L);
        dto.setTitulo("Foco activo sector norte");
        dto.setDescripcion("Llamas visibles");
        dto.setLatitud(-33.50);
        dto.setLongitud(-70.70);
        dto.setComuna("Pudahuel");
    }

    @Test
    void crear_SinNivelRiesgo_DebeAsignarNivelAlto() {
        dto.setNivelRiesgo(null);

        ReporteIncendio resultado = factory.crear(dto);

        assertEquals(ReporteIncendio.NivelRiesgo.ALTO, resultado.getNivelRiesgo());
    }

    @Test
    void crear_ConNivelCritico_DebeRespetar() {
        // Brigadista sí puede reportar CRITICO
        dto.setNivelRiesgo(ReporteIncendio.NivelRiesgo.CRITICO);

        ReporteIncendio resultado = factory.crear(dto);

        assertEquals(ReporteIncendio.NivelRiesgo.CRITICO, resultado.getNivelRiesgo());
    }

    @Test
    void crear_DebeAsignarTipoBrigadistaYEstadoEnProceso() {
        ReporteIncendio resultado = factory.crear(dto);

        assertEquals(ReporteIncendio.TipoReportante.BRIGADISTA, resultado.getTipoReportante());
        assertEquals(ReporteIncendio.EstadoReporte.EN_PROCESO, resultado.getEstado());
    }

    @Test
    void crear_SinCoordenadas_DebeLanzarExcepcion() {
        dto.setLongitud(null);

        assertThrows(IllegalArgumentException.class, () -> factory.crear(dto));
    }
}
