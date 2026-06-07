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
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
@Tag(name = "Reportes", description = "Gestión de reportes de incendio en SIFIRE")
public class ReporteController {

    private final ReporteService reporteService;

    @Autowired
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @Operation(summary = "Crear reporte de incendio", description = "Crea un nuevo reporte. El nivel de riesgo se asigna automáticamente según el tipo de reportante (Factory Method). "
            +
            "Tras guardar, notifica al Observer para disparar alertas y sincronizar monitoreo de forma desacoplada.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reporte creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos del reporte inválidos")
    })
    @PostMapping("/crear")
    public ResponseEntity<ReporteIncendio> crearReporte(@RequestBody ReporteRequestDTO dto) {
        ReporteIncendio guardado = reporteService.crearReporte(dto);
        reporteService.notificarCreacion(guardado);
        return ResponseEntity.ok(guardado);
    }

    @Operation(summary = "Subir foto a un reporte", description = "Adjunta una imagen al reporte indicado como archivo multipart.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Foto subida correctamente"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado"),
            @ApiResponse(responseCode = "400", description = "Archivo inválido")
    })
    @PostMapping("/{id}/subir-foto")
    public ResponseEntity<ReporteMultimedia> subirFoto(
            @Parameter(description = "ID del reporte") @PathVariable Long id,
            @RequestParam("archivo") MultipartFile archivo) throws Exception {
        return ResponseEntity.ok(reporteService.guardarFoto(id, archivo));
    }

    @Operation(summary = "Listar reportes", description = "Retorna todos los reportes. Se puede filtrar por estado (PENDIENTE, EN_PROCESO, RESUELTO, DESCARTADO) "
            +
            "o pasar activos=true para obtener solo los no resueltos.")
    @ApiResponse(responseCode = "200", description = "Reportes obtenidos correctamente")
    @GetMapping
    public ResponseEntity<List<ReporteIncendio>> listarReportes(
            @Parameter(description = "Filtrar por estado: PENDIENTE | EN_PROCESO | RESUELTO | DESCARTADO") @RequestParam(required = false) ReporteIncendio.EstadoReporte estado,
            @Parameter(description = "Si es 'true', retorna solo los reportes activos (no resueltos ni descartados)") @RequestParam(required = false) String activos) {
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

    @Operation(summary = "Obtener reporte por ID", description = "Retorna el detalle completo de un reporte específico.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reporte encontrado"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReporteIncendio> obtenerReporte(
            @Parameter(description = "ID del reporte") @PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerPorId(id));
    }

    @Operation(summary = "Cambiar estado de un reporte", description = "Actualiza el estado del reporte y registra el cambio en el historial automáticamente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado"),
            @ApiResponse(responseCode = "400", description = "Transición de estado inválida")
    })
    @PutMapping("/{id}/estado")
    public ResponseEntity<ReporteIncendio> cambiarEstado(
            @Parameter(description = "ID del reporte") @PathVariable Long id,
            @RequestBody CambioEstadoDTO dto) {

        ReporteIncendio actualizado = reporteService.cambiarEstado(id, dto);
        reporteService.notificarCambioEstado(actualizado);

        return ResponseEntity.ok(actualizado);
    }

    @Operation(summary = "Adjuntar multimedia a un reporte", description = "Vincula una URL de archivo (foto, video o audio) a un reporte existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Multimedia adjuntada correctamente"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado"),
            @ApiResponse(responseCode = "400", description = "Tipo de archivo inválido. Valores válidos: FOTO | VIDEO | AUDIO")
    })
    @PostMapping("/{id}/multimedia")
    public ResponseEntity<ReporteMultimedia> adjuntarMultimedia(
            @Parameter(description = "ID del reporte") @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                reporteService.adjuntarMultimedia(id, body.get("urlArchivo"), body.get("tipoArchivo")));
    }

    @Operation(summary = "Listar multimedia de un reporte", description = "Retorna todos los archivos adjuntos (fotos, videos, audios) asociados a un reporte.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Multimedia obtenida correctamente"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    @GetMapping("/{id}/multimedia")
    public ResponseEntity<List<ReporteMultimedia>> obtenerMultimedia(
            @Parameter(description = "ID del reporte") @PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerMultimedia(id));
    }

    @Operation(summary = "Historial de cambios de estado", description = "Retorna todos los cambios de estado que ha tenido el reporte, con fecha, usuario y observación.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Historial obtenido correctamente"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    @GetMapping("/{id}/historial")
    public ResponseEntity<List<HistorialReporte>> obtenerHistorial(
            @Parameter(description = "ID del reporte") @PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerHistorial(id));
    }
}