package cl.sifire.alertas.service;

import cl.sifire.alertas.client.UsuarioClient;
import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.repository.AlertaRepository;
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
class AlertaServiceTest {

    @Mock
    private AlertaRepository alertaRepository;

    @Mock
    private UsuarioClient usuarioClient;

    @InjectMocks
    private AlertaService alertaService;

    private Alerta alerta;

    @BeforeEach
    void setUp() {
        alerta = new Alerta();
        alerta.setId(1L);
        alerta.setReporteId(10L);
        alerta.setBrigadistaId(5L);
        alerta.setTitulo("Incendio detectado");
        alerta.setDescripcion("Foco de incendio en sector norte");
        alerta.setLatitud(-33.45);
        alerta.setLongitud(-70.65);
        alerta.setTipo("BRIGADISTA");
        alerta.setCanal(Alerta.Canal.PUSH);
        alerta.setEstado(Alerta.Estado.PENDIENTE);
    }

    // ── Crear ───────────────────────────────────────────────────────────────

    @Test
    void crearAlerta_DebeGuardarYRetornarAlerta() {
        when(alertaRepository.save(any(Alerta.class))).thenReturn(alerta);

        Alerta resultado = alertaService.crearAlerta(alerta);

        assertNotNull(resultado);
        assertEquals("Incendio detectado", resultado.getTitulo());
        verify(alertaRepository).save(alerta);
    }

    // ── Obtener todas ────────────────────────────────────────────────────────

    @Test
    void obtenerTodas_DebeRetornarListaCompleta() {
        when(alertaRepository.findAll()).thenReturn(Arrays.asList(alerta));

        List<Alerta> resultado = alertaService.obtenerTodas();

        assertEquals(1, resultado.size());
        verify(alertaRepository).findAll();
    }

    // ── Obtener por estado ───────────────────────────────────────────────────

    @Test
    void obtenerPorEstado_Pendiente_DebeRetornarAlertas() {
        when(alertaRepository.findByEstado(Alerta.Estado.PENDIENTE))
                .thenReturn(Arrays.asList(alerta));

        List<Alerta> resultado = alertaService.obtenerPorEstado(Alerta.Estado.PENDIENTE);

        assertEquals(1, resultado.size());
        assertEquals(Alerta.Estado.PENDIENTE, resultado.get(0).getEstado());
    }

    // ── Obtener por reporte ──────────────────────────────────────────────────

    @Test
    void obtenerPorReporteId_DebeRetornarAlertasAsociadas() {
        when(alertaRepository.findByReporteId(10L)).thenReturn(Arrays.asList(alerta));

        List<Alerta> resultado = alertaService.obtenerPorReporteId(10L);

        assertEquals(1, resultado.size());
        assertEquals(10L, resultado.get(0).getReporteId());
    }

    // ── Actualizar estado ────────────────────────────────────────────────────

    @Test
    void actualizarEstado_AlertaExistente_DebeActualizarEstado() {
        when(alertaRepository.findById(1L)).thenReturn(Optional.of(alerta));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        Alerta resultado = alertaService.actualizarEstado(1L, Alerta.Estado.ENVIADA);

        assertEquals(Alerta.Estado.ENVIADA, resultado.getEstado());
        verify(alertaRepository).save(alerta);
    }

    @Test
    void actualizarEstado_AlertaNoExiste_DebeLanzarExcepcion() {
        when(alertaRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> alertaService.actualizarEstado(99L, Alerta.Estado.RESUELTA));

        assertTrue(ex.getMessage().contains("99"));
    }

    // ── Emitir alerta brigadista ─────────────────────────────────────────────

    @Test
    void emitirAlertaBrigadista_DebeCrearAlertaConDatosBrigadista() {
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> {
            Alerta a = inv.getArgument(0);
            a.setId(2L);
            return a;
        });

        Alerta resultado = alertaService.emitirAlertaBrigadista(
                10L, 5L, "Alerta brigadista", "Descripción de prueba", -33.45, -70.65);

        assertNotNull(resultado);
        assertEquals(Alerta.Estado.ASIGNADA, resultado.getEstado());
        assertEquals("BRIGADISTA", resultado.getTipo());
        assertEquals(Alerta.Canal.PUSH, resultado.getCanal());
        assertEquals(5L, resultado.getBrigadistaId());
        assertTrue(resultado.getUsuariosAsignadosIds().contains(5L));
        verify(alertaRepository).save(any(Alerta.class));
    }

    // ── Asignar brigadistas ──────────────────────────────────────────────────

    @Test
    void asignarBrigadistas_AlertaExistente_DebePonerEstadoAsignada() {
        when(alertaRepository.findById(1L)).thenReturn(Optional.of(alerta));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        Alerta resultado = alertaService.asignarBrigadistas(1L);

        assertEquals(Alerta.Estado.ASIGNADA, resultado.getEstado());
    }

    @Test
    void asignarBrigadistas_AlertaNoExiste_DebeLanzarExcepcion() {
        when(alertaRepository.findById(88L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> alertaService.asignarBrigadistas(88L));
    }

    // ── Resolver alerta ──────────────────────────────────────────────────────

    @Test
    void resolverAlerta_AlertaExistente_DebePonerEstadoResueltaYFecha() {
        when(alertaRepository.findById(1L)).thenReturn(Optional.of(alerta));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        Alerta resultado = alertaService.resolverAlerta(1L);

        assertEquals(Alerta.Estado.RESUELTA, resultado.getEstado());
        assertNotNull(resultado.getResolvedAt());
    }

    @Test
    void resolverAlerta_AlertaNoExiste_DebeLanzarExcepcion() {
        when(alertaRepository.findById(77L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> alertaService.resolverAlerta(77L));
    }

    // ── Alertas activas brigadista ───────────────────────────────────────────

    @Test
    void obtenerAlertasActivasBrigadista_DebeRetornarAlertasPendientesYAsignadas() {
        alerta.setEstado(Alerta.Estado.ASIGNADA);
        when(alertaRepository.findByBrigadistaIdAndEstadoIn(
                eq(5L), eq(List.of(Alerta.Estado.ASIGNADA, Alerta.Estado.PENDIENTE))))
                .thenReturn(Arrays.asList(alerta));

        List<Alerta> resultado = alertaService.obtenerAlertasActivasBrigadista(5L);

        assertEquals(1, resultado.size());
        verify(alertaRepository).findByBrigadistaIdAndEstadoIn(any(), any());
    }

    @Test
    void obtenerAlertasBrigadista_DebeRetornarHistorialCompleto() {
        when(alertaRepository.findByBrigadistaId(5L)).thenReturn(Arrays.asList(alerta));

        List<Alerta> resultado = alertaService.obtenerAlertasBrigadista(5L);

        assertEquals(1, resultado.size());
        assertEquals(5L, resultado.get(0).getBrigadistaId());
    }
}