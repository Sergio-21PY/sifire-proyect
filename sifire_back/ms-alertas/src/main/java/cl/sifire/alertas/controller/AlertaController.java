package cl.sifire.alertas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.service.AlertaService;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    // ─── CRUD BASE ──────────────────────────────────────────────────

    @PostMapping("/emitir")
    public ResponseEntity<Alerta> emitirAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
    }

    @PostMapping("/crear")
    public ResponseEntity<Alerta> crearAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
    }

    @GetMapping
    public ResponseEntity<List<Alerta>> listarAlertas() {
        return ResponseEntity.ok(alertaService.obtenerTodas());
    }

    @GetMapping("/historial")
    public ResponseEntity<List<Alerta>> historial() {
        return ResponseEntity.ok(alertaService.obtenerTodas());
    }

    @GetMapping("/{id}/reenviar")
    public ResponseEntity<Alerta> reenviar(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.actualizarEstado(id, Alerta.Estado.PENDIENTE));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Alerta>> porEstado(@PathVariable Alerta.Estado estado) {
        return ResponseEntity.ok(alertaService.obtenerPorEstado(estado));
    }

    @GetMapping("/reporte/{reporteId}")
    public ResponseEntity<List<Alerta>> porReporte(@PathVariable Long reporteId) {
        return ResponseEntity.ok(alertaService.obtenerPorReporteId(reporteId));
    }

    // ─── BRIGADISTAS ────────────────────────────────────────────────

    /**
     * Emite una alerta dirigida a un brigadista específico.
     * Body: { reporteId, brigadistaId, titulo, descripcion, latitud, longitud }
     */
    @PostMapping("/brigadista/emitir")
    public ResponseEntity<Alerta> emitirAlertaBrigadista(@RequestBody AlertaBrigadistaRequest req) {
        Alerta nueva = alertaService.emitirAlertaBrigadista(
            req.reporteId(),
            req.brigadistaId(),
            req.titulo(),
            req.descripcion(),
            req.latitud(),
            req.longitud()
        );
        return ResponseEntity.ok(nueva);
    }

    /**
     * Devuelve las alertas ACTIVAS del brigadista (estado ASIGNADA o PENDIENTE).
     * Si la lista está vacía, el brigadista está libre.
     */
    @GetMapping("/brigadista/{brigadistaId}/activas")
    public ResponseEntity<List<Alerta>> alertasActivasBrigadista(@PathVariable Long brigadistaId) {
        return ResponseEntity.ok(alertaService.obtenerAlertasActivasBrigadista(brigadistaId));
    }

    /**
     * Devuelve el historial completo de alertas de un brigadista.
     */
    @GetMapping("/brigadista/{brigadistaId}")
    public ResponseEntity<List<Alerta>> alertasBrigadista(@PathVariable Long brigadistaId) {
        return ResponseEntity.ok(alertaService.obtenerAlertasBrigadista(brigadistaId));
    }

    /**
     * Marca la alerta como RESUELTA → libera la brigada.
     * Llamar cuando el brigadista confirma que el incidente está controlado.
     */
    @PostMapping("/{id}/resolver")
    public ResponseEntity<Alerta> resolverAlerta(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.resolverAlerta(id));
    }

    /**
     * Asigna brigadistas disponibles (compatibilidad con flujo anterior).
     */
    @PostMapping("/{id}/asignar-brigadistas")
    public ResponseEntity<Alerta> asignarBrigadistas(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.asignarBrigadistas(id));
    }

    // ─── RECORD para el body de emitir brigadista ────────────────────
    record AlertaBrigadistaRequest(
        Long reporteId,
        Long brigadistaId,
        String titulo,
        String descripcion,
        Double latitud,
        Double longitud
    ) {}
}
