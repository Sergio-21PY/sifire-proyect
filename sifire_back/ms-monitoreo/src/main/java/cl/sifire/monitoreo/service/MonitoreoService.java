package cl.sifire.monitoreo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.sifire.monitoreo.model.AsignacionBrigada;
import cl.sifire.monitoreo.model.Brigada;
import cl.sifire.monitoreo.model.RutaEvacuacion;
import cl.sifire.monitoreo.model.ZonaRiesgo;
import cl.sifire.monitoreo.repository.AsignacionBrigadaRepository;
import cl.sifire.monitoreo.repository.BrigadaRepository;
import cl.sifire.monitoreo.repository.RutaEvacuacionRepository;
import cl.sifire.monitoreo.repository.ZonaRiesgoRepository;

@Service
public class MonitoreoService {
    private final ZonaRiesgoRepository zonaRiesgoRepository;
    private final RutaEvacuacionRepository rutaEvacuacionRepository;
    private final BrigadaRepository brigadaRepository;
    private final AsignacionBrigadaRepository asignacionRepository;

    @Autowired
    public MonitoreoService(
            ZonaRiesgoRepository zonaRiesgoRepository,
            RutaEvacuacionRepository rutaEvacuacionRepository,
            BrigadaRepository brigadaRepository,
            AsignacionBrigadaRepository asignacionRepository) {
        this.zonaRiesgoRepository = zonaRiesgoRepository;
        this.rutaEvacuacionRepository = rutaEvacuacionRepository;
        this.brigadaRepository = brigadaRepository;
        this.asignacionRepository = asignacionRepository;
    }

    public List<ZonaRiesgo> obtenerZonasActivas() {
        return zonaRiesgoRepository.findByActivoTrue();
    }

    public List<ZonaRiesgo> obtenerTodasLasZonas() {
        return zonaRiesgoRepository.findAll();
    }

    public List<RutaEvacuacion> obtenerRutasActivas() {
        return rutaEvacuacionRepository.findByActivoTrue();
    }

    public List<Brigada> obtenerTodasLasBrigadas() {
        return brigadaRepository.findAll();
    }

    public Brigada actualizarBrigada(Long id, Brigada datos) {
        Brigada brigada = brigadaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brigada no encontrada: " + id));

        if (datos.getLatitud() != null)
            brigada.setLatitud(datos.getLatitud());
        if (datos.getLongitud() != null)
            brigada.setLongitud(datos.getLongitud());
        if (datos.getEstado() != null)
            brigada.setEstado(datos.getEstado());

        return brigadaRepository.save(brigada);
    }

    public AsignacionBrigada asignarBrigada(Long reporteId, Long brigadaId) {
        Brigada brigada = brigadaRepository.findById(brigadaId)
                .orElseThrow(() -> new RuntimeException("Brigada no encontrada: " + brigadaId));

        brigada.setEstado(Brigada.EstadoBrigada.EN_CAMINO);
        brigadaRepository.save(brigada);

        AsignacionBrigada asignacion = new AsignacionBrigada();
        asignacion.setReporteId(reporteId);
        asignacion.setBrigada(brigada);

        return asignacionRepository.save(asignacion);
    }

    public List<AsignacionBrigada> obtenerAsignacionesPorReporte(Long reporteId) {
        return asignacionRepository.findByReporteId(reporteId);
    }

    public void sincronizarFoco(Long reporteId, String estado, String nivelRiesgo) {
        System.out.println("[MonitoreoService] Foco sincronizado \u2192 reporteId=" +
                reporteId + " | estado=" + estado + " | nivel=" + nivelRiesgo);
    }

    public List<AsignacionBrigada> obtenerTodasLasAsignaciones() {
        return asignacionRepository.findAll();
    }

    public Brigada crearBrigada(Brigada brigada) {
        return brigadaRepository.save(brigada);
    }

    /**
     * Libera todas las brigadas asignadas a un reporte cuando este se marca
     * RESUELTO o DESCARTADO. Llamado desde MonitoreoObserver en ms-reportes.
     */
    public void liberarBrigadaPorReporte(Long reporteId) {
        List<AsignacionBrigada> asignaciones = asignacionRepository.findByReporteId(reporteId);
        if (asignaciones.isEmpty()) {
            System.out.println("[MonitoreoService] No hay brigada asignada al reporte: " + reporteId);
            return;
        }
        for (AsignacionBrigada asignacion : asignaciones) {
            Brigada brigada = asignacion.getBrigada();
            brigada.setEstado(Brigada.EstadoBrigada.DISPONIBLE);
            brigadaRepository.save(brigada);
            System.out.println("[MonitoreoService] Brigada ID=" + brigada.getId() + " liberada (reporte " + reporteId + " cerrado).");
        }
    }
}
