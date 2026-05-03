package cl.sifire.alertas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.repository.AlertaRepository;

@Service
public class AlertaService {
    @Autowired
    private AlertaRepository alertaRepository;

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

    public Alerta asignarBrigadistas(Long id) {
        Alerta alerta = alertaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
        alerta.setEstado(Alerta.Estado.ASIGNADA);
        return alertaRepository.save(alerta);
    }
}
