package cl.sifire.alertas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.service.AlertaService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/alertas")
public class AlertaController {
    @Autowired
    private AlertaService alertaService;

    @PostMapping
    public ResponseEntity<Alerta> crearAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
    }

 
    @GetMapping
    public ResponseEntity<List<Alerta>> obtenerTodas() {
        return ResponseEntity.ok(alertaService.obtenerTodas());
    }

  
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Alerta>> obtenerPorEstado(@PathVariable Alerta.Estado estado) {
        return ResponseEntity.ok(alertaService.obtenerPorEstado(estado));
    }

   
    @GetMapping("/reporte/{reporteId}")
    public ResponseEntity<List<Alerta>> obtenerPorReporte(@PathVariable Long reporteId) {
        return ResponseEntity.ok(alertaService.obtenerPorReporteId(reporteId));
    }

    //para el equipo, usé patch porque solo se actualiza un campo, el estado. Si se quisiera actualizar más campos, se podría usar put.
    @PatchMapping("/{id}/estado/{estado}")
    public ResponseEntity<Alerta> cambiarEstado(
            @PathVariable Long id,
            @PathVariable Alerta.Estado estado) {
        return ResponseEntity.ok(alertaService.actualizarEstado(id, estado));
    }
    
}
