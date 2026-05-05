package cl.sifire.monitoreo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.sifire.monitoreo.model.AsignacionBrigada;
import cl.sifire.monitoreo.model.Brigada;
import cl.sifire.monitoreo.model.RutaEvacuacion;
import cl.sifire.monitoreo.model.ZonaRiesgo;
import cl.sifire.monitoreo.service.MonitoreoService;

@RestController
@RequestMapping("/api/monitoreo")
@CrossOrigin(origins = "*")
public class MonitoreoController {

    private final MonitoreoService monitoreoService;

    @Autowired
    public MonitoreoController(MonitoreoService monitoreoService) {
        this.monitoreoService = monitoreoService;
    }

    @PostMapping("/focos/sincronizar")
    public ResponseEntity<Void> sincronizarFoco(@RequestBody Map<String, Object> payload) {
        Long reporteId = Long.valueOf(payload.get("reporteId").toString());
        String estado = payload.get("estado").toString();
        String nivelRiesgo = payload.get("nivelRiesgo").toString();
        monitoreoService.sincronizarFoco(reporteId, estado, nivelRiesgo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/zonas")
    public ResponseEntity<List<ZonaRiesgo>> obtenerZonasRiesgo(
            @RequestParam(required = false, defaultValue = "true") Boolean soloActivas) {
        List<ZonaRiesgo> zonas = soloActivas
                ? monitoreoService.obtenerZonasActivas()
                : monitoreoService.obtenerTodasLasZonas();
        return ResponseEntity.ok(zonas);
    }

    @GetMapping("/asignaciones")
    public ResponseEntity<List<AsignacionBrigada>> obtenerTodasLasAsignaciones() {
        return ResponseEntity.ok(monitoreoService.obtenerTodasLasAsignaciones());
    }

    @GetMapping("/rutas")
    public ResponseEntity<List<RutaEvacuacion>> obtenerRutasEvacuacion() {
        return ResponseEntity.ok(monitoreoService.obtenerRutasActivas());
    }

    @GetMapping("/brigadas")
    public ResponseEntity<List<Brigada>> obtenerBrigadas() {
        return ResponseEntity.ok(monitoreoService.obtenerTodasLasBrigadas());
    }

    @PutMapping("/brigadas/{id}")
    public ResponseEntity<Brigada> actualizarBrigada(
            @PathVariable Long id,
            @RequestBody Brigada datos) {
        return ResponseEntity.ok(monitoreoService.actualizarBrigada(id, datos));
    }

    @PostMapping({"/asignaciones", "/asignaciones/crear"})
    public ResponseEntity<AsignacionBrigada> asignarBrigada(
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(
                monitoreoService.asignarBrigada(
                        body.get("reporteId"),
                        body.get("brigadaId")));
    }

    @GetMapping("/asignaciones/{reporteId}")
    public ResponseEntity<List<AsignacionBrigada>> obtenerAsignaciones(
            @PathVariable Long reporteId) {
        return ResponseEntity.ok(
                monitoreoService.obtenerAsignacionesPorReporte(reporteId));
    }

    @PostMapping("/brigadas")
    public ResponseEntity<Brigada> crearBrigada(@RequestBody Brigada brigada) {
        return ResponseEntity.ok(monitoreoService.crearBrigada(brigada));
    }
}
