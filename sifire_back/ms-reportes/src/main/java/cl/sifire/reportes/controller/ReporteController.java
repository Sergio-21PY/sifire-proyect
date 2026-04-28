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

/**
 * Controlador REST de ms-reportes.
 * Expone los endpoints definidos en el informe de arquitectura SIFIRE.
 *
 * Endpoints:
 *   POST   /api/reportes                      → Crear nuevo reporte (Factory Method)
 *   GET    /api/reportes                      → Listar reportes (con filtros opcionales)
 *   GET    /api/reportes/{id}                 → Detalle de un reporte
 *   PUT    /api/reportes/{id}/estado          → Cambiar estado (genera historial + Observer)
 *   POST   /api/reportes/{id}/multimedia      → Adjuntar archivo
 *   GET    /api/reportes/{id}/historial       → Ver auditoría de cambios
 */
@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    private final ReporteService reporteService;

    @Autowired
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    /**
     * POST /api/reportes
     * Crea un reporte. Internamente usa el Factory Method para aplicar
     * las reglas de negocio según el tipo de reportante.
     */
    @PostMapping
    public ResponseEntity<ReporteIncendio> crearReporte(@RequestBody ReporteRequestDTO dto) {
        return ResponseEntity.ok(reporteService.crearReporte(dto));
    }

    /**
     * GET /api/reportes?estado=PENDIENTE&nivelRiesgo=ALTO
     * Lista reportes con filtros opcionales.
     */
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

    /**
     * GET /api/reportes/{id}
     * Retorna el detalle completo de un reporte.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReporteIncendio> obtenerReporte(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerPorId(id));
    }

    /**
     * PUT /api/reportes/{id}/estado
     * Cambia el estado del reporte. Genera registro en HistorialReporte
     * y dispara el Observer para notificar a ms-monitoreo.
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<ReporteIncendio> cambiarEstado(
        @PathVariable Long id,
        @RequestBody CambioEstadoDTO dto
    ) {
        return ResponseEntity.ok(reporteService.cambiarEstado(id, dto));
    }

    /**
     * POST /api/reportes/{id}/multimedia
     * Adjunta un archivo (foto/video/audio) a un reporte existente.
     */
    @PostMapping("/{id}/multimedia")
    public ResponseEntity<ReporteMultimedia> adjuntarMultimedia(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(
            reporteService.adjuntarMultimedia(id, body.get("urlArchivo"), body.get("tipoArchivo"))
        );
    }

    /**
     * GET /api/reportes/{id}/multimedia
     * Lista los archivos adjuntos de un reporte.
     */
    @GetMapping("/{id}/multimedia")
    public ResponseEntity<List<ReporteMultimedia>> obtenerMultimedia(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerMultimedia(id));
    }

    /**
     * GET /api/reportes/{id}/historial
     * Retorna la auditoría completa de cambios de estado del reporte.
     */
    @GetMapping("/{id}/historial")
    public ResponseEntity<List<HistorialReporte>> obtenerHistorial(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerHistorial(id));
    }
}
