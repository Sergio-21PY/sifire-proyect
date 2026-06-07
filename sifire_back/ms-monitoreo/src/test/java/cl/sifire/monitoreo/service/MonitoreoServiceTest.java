package cl.sifire.monitoreo.service;

import cl.sifire.monitoreo.model.AsignacionBrigada;
import cl.sifire.monitoreo.model.Brigada;
import cl.sifire.monitoreo.model.RutaEvacuacion;
import cl.sifire.monitoreo.model.ZonaRiesgo;
import cl.sifire.monitoreo.repository.AsignacionBrigadaRepository;
import cl.sifire.monitoreo.repository.BrigadaRepository;
import cl.sifire.monitoreo.repository.RutaEvacuacionRepository;
import cl.sifire.monitoreo.repository.ZonaRiesgoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MonitoreoServiceTest {

    @Mock private ZonaRiesgoRepository zonaRiesgoRepository;
    @Mock private RutaEvacuacionRepository rutaEvacuacionRepository;
    @Mock private BrigadaRepository brigadaRepository;
    @Mock private AsignacionBrigadaRepository asignacionRepository;

    @InjectMocks
    private MonitoreoService monitoreoService;

    private Brigada brigada;
    private ZonaRiesgo zona;

    @BeforeEach
    void setUp() {
        brigada = new Brigada();
        brigada.setId(1L);
        brigada.setNombre("Brigada Norte");
        brigada.setTipo(Brigada.TipoBrigada.FORESTAL);
        brigada.setEstado(Brigada.EstadoBrigada.DISPONIBLE);
        brigada.setLatitud(-33.45);
        brigada.setLongitud(-70.65);

        zona = new ZonaRiesgo();
        zona.setId(1L);
        zona.setNombre("Sector Mapocho");
        zona.setNivelRiesgo(ZonaRiesgo.NivelRiesgo.ALTO);
        zona.setActivo(true);
    }

    // ── Zonas ────────────────────────────────────────────────────────────────

    @Test
    void obtenerZonasActivas_DebeRetornarSoloActivas() {
        when(zonaRiesgoRepository.findByActivoTrue()).thenReturn(Arrays.asList(zona));

        List<ZonaRiesgo> resultado = monitoreoService.obtenerZonasActivas();

        assertEquals(1, resultado.size());
        assertTrue(resultado.get(0).getActivo());
        verify(zonaRiesgoRepository).findByActivoTrue();
    }

    @Test
    void obtenerTodasLasZonas_DebeRetornarListaCompleta() {
        when(zonaRiesgoRepository.findAll()).thenReturn(Arrays.asList(zona));

        List<ZonaRiesgo> resultado = monitoreoService.obtenerTodasLasZonas();

        assertEquals(1, resultado.size());
        verify(zonaRiesgoRepository).findAll();
    }

    // ── Rutas ────────────────────────────────────────────────────────────────

    @Test
    void obtenerRutasActivas_DebeRetornarRutasActivas() {
        RutaEvacuacion ruta = new RutaEvacuacion();
        ruta.setId(1L);
        ruta.setActivo(true);

        when(rutaEvacuacionRepository.findByActivoTrue()).thenReturn(Arrays.asList(ruta));

        List<RutaEvacuacion> resultado = monitoreoService.obtenerRutasActivas();

        assertEquals(1, resultado.size());
        verify(rutaEvacuacionRepository).findByActivoTrue();
    }

    // ── Brigadas ─────────────────────────────────────────────────────────────

    @Test
    void obtenerTodasLasBrigadas_DebeRetornarLista() {
        when(brigadaRepository.findAll()).thenReturn(Arrays.asList(brigada));

        List<Brigada> resultado = monitoreoService.obtenerTodasLasBrigadas();

        assertEquals(1, resultado.size());
        assertEquals("Brigada Norte", resultado.get(0).getNombre());
    }

    @Test
    void crearBrigada_DebeGuardarYRetornar() {
        when(brigadaRepository.save(any(Brigada.class))).thenReturn(brigada);

        Brigada resultado = monitoreoService.crearBrigada(brigada);

        assertNotNull(resultado);
        assertEquals("Brigada Norte", resultado.getNombre());
        verify(brigadaRepository).save(brigada);
    }

    // ── Actualizar brigada ────────────────────────────────────────────────────

    @Test
    void actualizarBrigada_DatosValidos_DebeActualizarCampos() {
        Brigada datos = new Brigada();
        datos.setLatitud(-34.0);
        datos.setLongitud(-71.0);
        datos.setEstado(Brigada.EstadoBrigada.INTERVINIENDO);

        when(brigadaRepository.findById(1L)).thenReturn(Optional.of(brigada));
        when(brigadaRepository.save(any(Brigada.class))).thenAnswer(inv -> inv.getArgument(0));

        Brigada resultado = monitoreoService.actualizarBrigada(1L, datos);

        assertEquals(-34.0, resultado.getLatitud());
        assertEquals(-71.0, resultado.getLongitud());
        assertEquals(Brigada.EstadoBrigada.INTERVINIENDO, resultado.getEstado());
    }

    @Test
    void actualizarBrigada_NoExiste_DebeLanzarExcepcion() {
        when(brigadaRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> monitoreoService.actualizarBrigada(99L, new Brigada()));

        assertTrue(ex.getMessage().contains("99"));
    }

    // ── Asignar brigada ───────────────────────────────────────────────────────

    @Test
    void asignarBrigada_BrigadaExistente_DebeCrearAsignacionYPonerEnCamino() {
        AsignacionBrigada asignacion = new AsignacionBrigada();
        asignacion.setId(1L);
        asignacion.setReporteId(10L);
        asignacion.setBrigada(brigada);

        when(brigadaRepository.findById(1L)).thenReturn(Optional.of(brigada));
        when(brigadaRepository.save(any(Brigada.class))).thenReturn(brigada);
        when(asignacionRepository.save(any(AsignacionBrigada.class))).thenReturn(asignacion);

        AsignacionBrigada resultado = monitoreoService.asignarBrigada(10L, 1L);

        assertNotNull(resultado);
        assertEquals(10L, resultado.getReporteId());
        assertEquals(Brigada.EstadoBrigada.EN_CAMINO, brigada.getEstado());
        verify(brigadaRepository).save(brigada);
        verify(asignacionRepository).save(any(AsignacionBrigada.class));
    }

    @Test
    void asignarBrigada_BrigadaNoExiste_DebeLanzarExcepcion() {
        when(brigadaRepository.findById(55L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> monitoreoService.asignarBrigada(10L, 55L));
    }

    // ── Liberar brigada ───────────────────────────────────────────────────────

@Test
void liberarBrigadaPorReporte_ConAsignaciones_DebePonerDisponible() {
    AsignacionBrigada asignacion = new AsignacionBrigada();
    asignacion.setBrigada(brigada);
    brigada.setEstado(Brigada.EstadoBrigada.EN_CAMINO);

    // ✅ método exacto que usa el service
    when(asignacionRepository.findByReporteIdAndFechaFinIsNull(10L))
        .thenReturn(List.of(asignacion));
    when(asignacionRepository.save(any(AsignacionBrigada.class)))
        .thenReturn(asignacion);
    when(brigadaRepository.save(any(Brigada.class)))
        .thenReturn(brigada);

    monitoreoService.liberarBrigadaPorReporte(10L);

    assertEquals(Brigada.EstadoBrigada.DISPONIBLE, brigada.getEstado());
    assertNotNull(asignacion.getFechaFin()); 
    verify(asignacionRepository).save(asignacion);
    verify(brigadaRepository).save(brigada);
}

@Test
void liberarBrigadaPorReporte_SinAsignaciones_NoDebeGuardar() {
    when(asignacionRepository.findByReporteIdAndFechaFinIsNull(99L))
        .thenReturn(Collections.emptyList());

    monitoreoService.liberarBrigadaPorReporte(99L);

    verify(brigadaRepository, never()).save(any());
    verify(asignacionRepository, never()).save(any());
}

    // ── Asignaciones por reporte ──────────────────────────────────────────────

    @Test
    void obtenerAsignacionesPorReporte_DebeRetornarLista() {
        AsignacionBrigada asig = new AsignacionBrigada();
        asig.setReporteId(10L);

        when(asignacionRepository.findByReporteId(10L)).thenReturn(Arrays.asList(asig));

        List<AsignacionBrigada> resultado = monitoreoService.obtenerAsignacionesPorReporte(10L);

        assertEquals(1, resultado.size());
        assertEquals(10L, resultado.get(0).getReporteId());
    }
}