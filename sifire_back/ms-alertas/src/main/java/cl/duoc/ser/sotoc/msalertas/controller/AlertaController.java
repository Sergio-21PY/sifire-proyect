package cl.duoc.ser.sotoc.msalertas.controller;

import cl.duoc.ser.sotoc.msalertas.model.Alerta;
import cl.duoc.ser.sotoc.msalertas.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaRepository alertaRepository;

    @PostMapping("/crear")
    public ResponseEntity<Alerta> crearAlerta(@RequestBody Alerta alerta) {
        Alerta nuevaAlerta = alertaRepository.save(alerta);
        return ResponseEntity.ok(nuevaAlerta);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Alerta>> listarAlertas() {
        List<Alerta> alertas = alertaRepository.findAll();
        return ResponseEntity.ok(alertas);
    }
}
