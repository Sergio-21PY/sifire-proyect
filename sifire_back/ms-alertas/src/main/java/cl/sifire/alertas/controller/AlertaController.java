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

    // ─── TUS ENDPOINTS ──────────────────────────────────────────────

    @PostMapping("/emitir")
    public ResponseEntity<Alerta> emitirAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
    }

    // Alias para compatibilidad con el BFF (/api/alertas/crear)
    @PostMapping("/crear")
    public ResponseEntity<Alerta> crearAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
    }

    // Alias para listar (BFF llama GET /api/alertas)
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

    // ─── INTEGRACIÓN SERGIO ─────────────────────────────────────────

    // Asigna brigadistas disponibles a una alerta (lógica de Sergio)
    @PostMapping("/{id}/asignar-brigadistas")
    public ResponseEntity<Alerta> asignarBrigadistas(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.asignarBrigadistas(id));
    }
}