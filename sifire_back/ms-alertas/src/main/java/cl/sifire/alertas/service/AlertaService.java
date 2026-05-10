package cl.sifire.alertas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.sifire.alertas.client.UsuarioClient;
import cl.sifire.alertas.dto.UsuarioDTO;
import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.repository.AlertaRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
public class AlertaService {

    private static final Logger log = LoggerFactory.getLogger(AlertaService.class);

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private UsuarioClient usuarioClient;

    // ─── CRUD BASE ────────────────────────────────────────────────────

    public Alerta crearAlerta(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    public List<Alerta> obtenerTodas() {
        return alertaRepository.findAll();
    }

    public List<Alerta> obtenerPorEstado(Alerta.Estado estado) {
        return alertaRepository.findByEstado(estado);
    }

    public List<Alerta> obtenerPorReporteId(Long reporteId) {
        return alertaRepository.findByReporteId(reporteId);
    }

    public Alerta actualizarEstado(Long id, Alerta.Estado nuevoEstado) {
        Alerta alerta = alertaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Alerta no encontrada: " + id));
        alerta.setEstado(nuevoEstado);
        return alertaRepository.save(alerta);
    }

    // ─── CIRCUIT BREAKER → ms-usuarios ───────────────────────────────

    /**
     * Consulta brigadistas en ms-usuarios protegido por Circuit Breaker.
     * Si ms-usuarios está caído, activa el fallback automáticamente.
     */
    @CircuitBreaker(name = "ms-usuarios", fallbackMethod = "fallbackBrigadistas")
    public List<UsuarioDTO> obtenerBrigadistasDisponibles() {
        return usuarioClient.listarUsuariosPorTipo("BRIGADISTA");
    }

    public List<UsuarioDTO> fallbackBrigadistas(Exception e) {
        log.warn("[CircuitBreaker] ms-usuarios no disponible. Causa: {}", e.getMessage());
        return List.of();
    }

    // ─── LÓGICA BRIGADISTAS ───────────────────────────────────────────

    /**
     * Emite una alerta dirigida a un brigadista específico.
     * Verifica que el brigadista exista en ms-usuarios (con CircuitBreaker).
     * El brigadista queda en estado ASIGNADA hasta que resuelva el incidente.
     */
    public Alerta emitirAlertaBrigadista(Long reporteId, Long brigadistaId, String titulo,
                                          String descripcion, Double latitud, Double longitud) {

        // Verificar que el brigadista existe (si ms-usuarios está caído, el CB
        // retorna lista vacía y se omite la validación para no bloquear el flujo)
        List<UsuarioDTO> brigadistas = obtenerBrigadistasDisponibles();
        if (!brigadistas.isEmpty()) {
            boolean existe = brigadistas.stream()
                .anyMatch(u -> u.getId().equals(brigadistaId));
            if (!existe) {
                throw new RuntimeException("Brigadista no encontrado: " + brigadistaId);
            }
        }

        Alerta alerta = new Alerta();
        alerta.setReporteId(reporteId);
        alerta.setBrigadistaId(brigadistaId);
        alerta.setTitulo(titulo);
        alerta.setDescripcion(descripcion);
        alerta.setLatitud(latitud);
        alerta.setLongitud(longitud);
        alerta.setTipo("BRIGADISTA");
        alerta.setCanal(Alerta.Canal.PUSH);
        alerta.setEstado(Alerta.Estado.ASIGNADA);
        alerta.getUsuariosAsignadosIds().add(brigadistaId);
        return alertaRepository.save(alerta);
    }

    /**
     * Asigna brigadistas disponibles a una alerta existente (compatibilidad previa).
     */
    public Alerta asignarBrigadistas(Long id) {
        Alerta alerta = alertaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Alerta no encontrada: " + id));
        alerta.setEstado(Alerta.Estado.ASIGNADA);
        return alertaRepository.save(alerta);
    }

    /**
     * Marca la alerta como RESUELTA y registra la hora de resolución.
     * Esto representa la "liberación" de la brigada.
     */
    public Alerta resolverAlerta(Long id) {
        Alerta alerta = alertaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Alerta no encontrada: " + id));
        alerta.setEstado(Alerta.Estado.RESUELTA);
        alerta.setResolvedAt(LocalDateTime.now());
        return alertaRepository.save(alerta);
    }

    /**
     * Devuelve todas las alertas activas (ASIGNADA o PENDIENTE) de un brigadista.
     * Si está vacía, el brigadista está libre.
     */
    public List<Alerta> obtenerAlertasActivasBrigadista(Long brigadistaId) {
        return alertaRepository.findByBrigadistaIdAndEstadoIn(
            brigadistaId,
            List.of(Alerta.Estado.ASIGNADA, Alerta.Estado.PENDIENTE)
        );
    }

    /**
     * Devuelve todas las alertas de un brigadista (historial completo).
     */
    public List<Alerta> obtenerAlertasBrigadista(Long brigadistaId) {
        return alertaRepository.findByBrigadistaId(brigadistaId);
    }
}