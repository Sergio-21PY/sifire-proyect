package cl.sifire.alertas.service;

import cl.sifire.alertas.client.UsuarioClient;
import cl.sifire.alertas.dto.UsuarioDTO;
import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.repository.AlertaRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private UsuarioClient usuarioClient; // Inyectamos el cliente Feign

    public Alerta crearAlerta(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    public List<Alerta> obtenerTodas(){
        return alertaRepository.findAll();
    }

    public List<Alerta> obtenerPorEstado(Alerta.Estado estado) {
        return alertaRepository.findByEstado(estado);
    }

    public List<Alerta> obtenerPorReporteId(Long reporteId) {
        return alertaRepository.findByReporteId(reporteId);
    }

    public Alerta actualizarEstado(Long id, Alerta.Estado nuevoEstado) {
        Alerta alerta = alertaRepository.findById(id).orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
        alerta.setEstado(nuevoEstado);
        return alertaRepository.save(alerta);
    }

    @CircuitBreaker(name = "ms-usuarios", fallbackMethod = "fallbackAsignarBrigadistas")
    public Alerta asignarBrigadistas(Long id) {
        Alerta alerta = alertaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

        // Lógica de comunicación con ms-usuarios
        List<UsuarioDTO> brigadistas = usuarioClient.listarUsuariosPorTipo("BRIGADISTA");

        if (brigadistas != null && !brigadistas.isEmpty()) {
            alerta.getUsuariosAsignadosIds().addAll(
                brigadistas.stream().map(UsuarioDTO::getId).collect(Collectors.toSet())
            );
        } else {
            // Si no hay brigadistas, podríamos lanzar un error o manejarlo de otra forma
            throw new RuntimeException("No se encontraron brigadistas disponibles.");
        }

        alerta.setEstado(Alerta.Estado.ASIGNADA);
        return alertaRepository.save(alerta);
    }

    /**
     * Método Fallback para asignarBrigadistas.
     * Se ejecuta si el Circuit Breaker detecta que ms-usuarios no responde.
     */
    public Alerta fallbackAsignarBrigadistas(Long id, Throwable throwable) {
        // Loguear el error para saber qué pasó
        System.err.println("Fallback: No se pudo conectar con ms-usuarios para asignar brigadistas a la alerta " + id + ". Error: " + throwable.getMessage());

        // Lógica de respaldo: marcar la alerta como pendiente de asignación
        Alerta alerta = alertaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Alerta no encontrada durante el fallback"));
        
        alerta.setEstado(Alerta.Estado.ASIGNACION_PENDIENTE); // Un nuevo estado para reintentar más tarde
        return alertaRepository.save(alerta);
    }
}
