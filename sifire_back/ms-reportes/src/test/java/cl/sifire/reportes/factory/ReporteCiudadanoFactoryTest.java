package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ReporteCiudadanoFactoryTest {

    private ReporteCiudadanoFactory factory;
    private ReporteRequestDTO dto;

    @BeforeEach
    void setUp() {
        factory = new ReporteCiudadanoFactory();

        dto = new ReporteRequestDTO();
        dto.setUsuarioId(1L);
        dto.setTitulo("Incendio en el parque");
        dto.setDescripcion("Humo visible");
        dto.setLatitud(-33.43);
        dto.setLongitud(-70.65);
        dto.setComuna("Santiago");
    }

    @Test
    void crear_SinNivelRiesgo_DebeAsignarNivelMedio() {
        dto.setNivelRiesgo(null);

        ReporteIncendio resultado = factory.crear(dto);

        assertEquals(ReporteIncendio.NivelRiesgo.MEDIO, resultado.getNivelRiesgo());
    }

    @Test
    void crear_ConNivelCritico_DebeRebajarseMedio() {
        // Un ciudadano no puede reportar nivel CRITICO, se rebaja a MEDIO
        dto.setNivelRiesgo(ReporteIncendio.NivelRiesgo.CRITICO);

        ReporteIncendio resultado = factory.crear(dto);

        assertEquals(ReporteIncendio.NivelRiesgo.MEDIO, resultado.getNivelRiesgo());
    }

    @Test
    void crear_ConNivelAlto_DebeRespetar() {
        dto.setNivelRiesgo(ReporteIncendio.NivelRiesgo.ALTO);

        ReporteIncendio resultado = factory.crear(dto);

        assertEquals(ReporteIncendio.NivelRiesgo.ALTO, resultado.getNivelRiesgo());
    }

    @Test
    void crear_DebeAsignarTipoCiudadanoYEstadoPendiente() {
        ReporteIncendio resultado = factory.crear(dto);

        assertEquals(ReporteIncendio.TipoReportante.CIUDADANO, resultado.getTipoReportante());
        assertEquals(ReporteIncendio.EstadoReporte.PENDIENTE, resultado.getEstado());
    }

    @Test
    void crear_SinCoordenadas_DebeLanzarExcepcion() {
        dto.setLatitud(null);

        assertThrows(IllegalArgumentException.class, () -> factory.crear(dto));
    }
}
