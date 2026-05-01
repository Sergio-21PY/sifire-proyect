package cl.sifire.reportes.controller;

import cl.sifire.reportes.dto.CambioEstadoDTO;
import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.HistorialReporte;
import cl.sifire.reportes.model.ReporteIncendio;
import cl.sifire.reportes.model.ReporteMultimedia;
import cl.sifire.reportes.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// controlador principal de reportes, aca van todos los endpoints
@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    private final ReporteService reporteService;

    @Autowired
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    // crea un reporte nuevo, el service decide como armarlo segun quien reporta
    @PostMapping
    public ResponseEntity<ReporteIncendio> crearReporte(@RequestBody ReporteRequestDTO dto) {
        return ResponseEntity.ok(reporteService.crearReporte(dto));
    }

    // lista todos los reportes, se puede filtrar por estado o solo activos
    @GetMapping
    public ResponseEntity<List<ReporteIncendio>> listarReportes(
        @RequestParam(required = false) ReporteIncendio.EstadoReporte estado,
        @RequestParam(required = false) String activos
    ) {
        List<ReporteIncendio> reportes;
        if ("true".equals(activos)) {
            reportes = reporteService.listarActivos();
        } else if (estado != null) {
            reportes = reporteService.listarPorEstado(estado);
        } else {
            reportes = reporteService.listarTodos();
        }
        return ResponseEntity.ok(reportes);
    }

    // retorna un reporte por su id
    @GetMapping("/{id}")
    public ResponseEntity<ReporteIncendio> obtenerReporte(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerPorId(id));
    }

    // cambia el estado del reporte y guarda el cambio en el historial
    @PutMapping("/{id}/estado")
    public ResponseEntity<ReporteIncendio> cambiarEstado(
        @PathVariable Long id,
        @RequestBody CambioEstadoDTO dto
    ) {
        return ResponseEntity.ok(reporteService.cambiarEstado(id, dto));
    }

    // adjunta foto, video o audio a un reporte
    @PostMapping("/{id}/multimedia")
    public ResponseEntity<ReporteMultimedia> adjuntarMultimedia(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(
            reporteService.adjuntarMultimedia(id, body.get("urlArchivo"), body.get("tipoArchivo"))
        );
    }

    // lista los archivos adjuntos de un reporte
    @GetMapping("/{id}/multimedia")
    public ResponseEntity<List<ReporteMultimedia>> obtenerMultimedia(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerMultimedia(id));
    }

    // historial de todos los cambios de estado que tuvo el reporte
    @GetMapping("/{id}/historial")
    public ResponseEntity<List<HistorialReporte>> obtenerHistorial(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerHistorial(id));
    }
}