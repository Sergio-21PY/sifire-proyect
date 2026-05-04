package cl.duoc.ser.sotoc.msalertas.controller;

import cl.duoc.ser.sotoc.msalertas.client.UsuarioClient;
import cl.duoc.ser.sotoc.msalertas.dto.UsuarioDTO;
import cl.duoc.ser.sotoc.msalertas.model.Alerta;
import cl.duoc.ser.sotoc.msalertas.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("v1/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private UsuarioClient usuarioClient;

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

    @PostMapping("/{id}/asignar-brigadistas")
    public ResponseEntity<Alerta> asignarBrigadistas(@PathVariable Long id) {
        // 1. Buscar la alerta
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

        // 2. Llamar a ms-usuarios para obtener los brigadistas
        List<UsuarioDTO> brigadistas = usuarioClient.listarUsuariosPorTipo("BRIGADISTA");

        // 3. Extraer los IDs
        if (brigadistas != null && !brigadistas.isEmpty()) {
            alerta.getUsuariosAsignadosIds().addAll(
                brigadistas.stream().map(UsuarioDTO::getId).collect(Collectors.toSet())
            );
        }

        // 4. Cambiar estado y guardar
        alerta.setEstado("ASIGNADA");
        Alerta alertaActualizada = alertaRepository.save(alerta);

        return ResponseEntity.ok(alertaActualizada);
    }
}
