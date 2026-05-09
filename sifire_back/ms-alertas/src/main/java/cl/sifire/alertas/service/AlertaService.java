package cl.sifire.alertas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.repository.AlertaRepository;

@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

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

    // ─── LÓGICA BRIGADISTAS ───────────────────────────────────────────

    /**
     * Emite una alerta dirigida a un brigadista específico.
     * El brigadista queda en estado ASIGNADA hasta que resuelva el incidente.
     */
    public Alerta emitirAlertaBrigadista(Long reporteId, Long brigadistaId, String titulo, String descripcion, Double latitud, Double longitud) {
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
        // También registramos en el set de asignaciones para compatibilidad
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
     * Esto representa la "liberación" de la brigada: deja de tener el incidente activo.
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
