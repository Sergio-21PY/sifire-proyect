package cl.sifire.reportes.service;

import cl.sifire.reportes.dto.CambioEstadoDTO;
import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.factory.ReporteFactory;
import cl.sifire.reportes.factory.ReporteFactorySelector;
import cl.sifire.reportes.model.ReporteIncendio;
import cl.sifire.reportes.observer.ReporteEventPublisher;
import cl.sifire.reportes.repository.HistorialRepository;
import cl.sifire.reportes.repository.MultimediaRepository;
import cl.sifire.reportes.repository.ReporteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReporteServiceTest {

    @Mock private ReporteRepository      reporteRepository;
    @Mock private HistorialRepository    historialRepository;
    @Mock private MultimediaRepository   multimediaRepository;
    @Mock private ReporteFactorySelector factorySelector;
    @Mock private ReporteEventPublisher  eventPublisher;
    @Mock private ReporteFactory         mockFactory;

    @InjectMocks
    private ReporteService service;

    private ReporteIncendio reporte;
    private ReporteRequestDTO dto;

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

        dto = new ReporteRequestDTO();
        dto.setTipoReportante(ReporteIncendio.TipoReportante.CIUDADANO);
    }

    @Test
    void crearReporte_DebeGuardarElReporteEnLaBD() {
        when(factorySelector.seleccionar(ReporteIncendio.TipoReportante.CIUDADANO)).thenReturn(mockFactory);
        when(mockFactory.crear(dto)).thenReturn(reporte);
        when(reporteRepository.save(reporte)).thenReturn(reporte);

        ReporteIncendio resultado = service.crearReporte(dto);

        assertNotNull(resultado);
        assertEquals("Incendio en el cerro", resultado.getTitulo());
        verify(reporteRepository).save(reporte);
    }

    @Test
    void cambiarEstado_DebeActualizarElEstadoDelReporte() {
        CambioEstadoDTO cambio = new CambioEstadoDTO();
        cambio.setNuevoEstado(ReporteIncendio.EstadoReporte.EN_PROCESO);
        cambio.setUsuarioId(1L);

        when(reporteRepository.findById(1L)).thenReturn(Optional.of(reporte));
        when(historialRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(reporteRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ReporteIncendio resultado = service.cambiarEstado(1L, cambio);

        assertEquals(ReporteIncendio.EstadoReporte.EN_PROCESO, resultado.getEstado());
    }

    @Test
    void cambiarEstado_CuandoNoExisteElReporte_DebeLanzarExcepcion() {
        when(reporteRepository.findById(99L)).thenReturn(Optional.empty());

        CambioEstadoDTO cambio = new CambioEstadoDTO();
        cambio.setNuevoEstado(ReporteIncendio.EstadoReporte.RESUELTO);

        assertThrows(RuntimeException.class, () -> service.cambiarEstado(99L, cambio));
    }

    @Test
    void listarTodos_DebeRetornarTodosLosReportes() {
        when(reporteRepository.findAll()).thenReturn(List.of(reporte));

        List<ReporteIncendio> resultado = service.listarTodos();

        assertEquals(1, resultado.size());
        assertEquals("Incendio en el cerro", resultado.get(0).getTitulo());
    }

    @Test
    void obtenerPorId_CuandoNoExiste_DebeLanzarExcepcion() {
        when(reporteRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.obtenerPorId(404L));
    }
}
