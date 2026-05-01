package cl.sifire.alertas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.service.AlertaService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/alertas")
public class AlertaController {
   @Autowired
    private AlertaService alertaService;

    @PostMapping("/emitir")
    public ResponseEntity<Alerta> emitirAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
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
}
