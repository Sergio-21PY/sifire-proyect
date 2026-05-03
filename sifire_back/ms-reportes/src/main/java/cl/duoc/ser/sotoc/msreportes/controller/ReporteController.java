package cl.duoc.ser.sotoc.msreportes.controller;

import cl.duoc.ser.sotoc.msreportes.model.Reporte;
import cl.duoc.ser.sotoc.msreportes.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @PostMapping("/crear")
    public ResponseEntity<Reporte> crearReporte(@RequestBody Reporte reporte) {
        Reporte nuevoReporte = reporteRepository.save(reporte);
        return ResponseEntity.ok(nuevoReporte);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Reporte>> listarReportes() {
        List<Reporte> reportes = reporteRepository.findAll();
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/estadisticas/comuna-mas-incendios")
    public ResponseEntity<Map<String, Long>> getComunaMasIncendios() {
        // 1. Obtener todos los reportes de tipo "Incendio"
        List<Reporte> incendios = reporteRepository.findByTipo("Incendio");

        // 2. Contar las comunas
        Map<String, Long> conteoComunas = incendios.stream()
                .map(Reporte::getComuna)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        // 3. Encontrar la comuna con el mayor número de incendios
        return conteoComunas.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> ResponseEntity.ok(Map.of(entry.getKey(), entry.getValue())))
                .orElse(ResponseEntity.noContent().build());
    }
}
