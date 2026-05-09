package cl.sifire.monitoreo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cl.sifire.monitoreo.model.AsignacionBrigada;
import cl.sifire.monitoreo.model.Brigada;
import cl.sifire.monitoreo.model.RutaEvacuacion;
import cl.sifire.monitoreo.model.ZonaRiesgo;
import cl.sifire.monitoreo.service.MonitoreoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/monitoreo")
@CrossOrigin(origins = "*")
@Tag(name = "Monitoreo", description = "Gestión de zonas, brigadas, rutas y asignaciones en SIFIRE")
public class MonitoreoController {

    private final MonitoreoService monitoreoService;

    @Autowired
    public MonitoreoController(MonitoreoService monitoreoService) {
        this.monitoreoService = monitoreoService;
    }

    @Operation(summary = "Sincronizar foco de incendio", description = "Recibe datos de un reporte desde ms-reportes (MonitoreoObserver) y actualiza el estado del foco en el mapa.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Foco sincronizado correctamente"),
        @ApiResponse(responseCode = "400", description = "Payload inválido")
    })
    @PostMapping("/focos/sincronizar")
    public ResponseEntity<Void> sincronizarFoco(@RequestBody Map<String, Object> payload) {
        Long reporteId = Long.valueOf(payload.get("reporteId").toString());
        String estado = payload.get("estado").toString();
        String nivelRiesgo = payload.get("nivelRiesgo").toString();
        monitoreoService.sincronizarFoco(reporteId, estado, nivelRiesgo);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Obtener zonas de riesgo", description = "Retorna las zonas de riesgo registradas. Por defecto solo retorna las activas.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Zonas obtenidas correctamente")
    })
    @GetMapping("/zonas")
    public ResponseEntity<List<ZonaRiesgo>> obtenerZonasRiesgo(
            @Parameter(description = "Si es true retorna solo zonas activas. Por defecto: true")
            @RequestParam(required = false, defaultValue = "true") Boolean soloActivas) {
        List<ZonaRiesgo> zonas = soloActivas
                ? monitoreoService.obtenerZonasActivas()
                : monitoreoService.obtenerTodasLasZonas();
        return ResponseEntity.ok(zonas);
    }

    @Operation(summary = "Listar todas las asignaciones", description = "Retorna todas las asignaciones de brigadas a reportes, incluyendo las finalizadas.")
    @ApiResponse(responseCode = "200", description = "Asignaciones obtenidas correctamente")
    @GetMapping("/asignaciones")
    public ResponseEntity<List<AsignacionBrigada>> obtenerTodasLasAsignaciones() {
        return ResponseEntity.ok(monitoreoService.obtenerTodasLasAsignaciones());
    }

    @Operation(summary = "Obtener rutas de evacuación", description = "Retorna las rutas de evacuación activas disponibles en el sistema.")
    @ApiResponse(responseCode = "200", description = "Rutas obtenidas correctamente")
    @GetMapping("/rutas")
    public ResponseEntity<List<RutaEvacuacion>> obtenerRutasEvacuacion() {
        return ResponseEntity.ok(monitoreoService.obtenerRutasActivas());
    }

    @Operation(summary = "Listar brigadas", description = "Retorna todas las brigadas registradas con su estado actual.")
    @ApiResponse(responseCode = "200", description = "Brigadas obtenidas correctamente")
    @GetMapping("/brigadas")
    public ResponseEntity<List<Brigada>> obtenerBrigadas() {
        return ResponseEntity.ok(monitoreoService.obtenerTodasLasBrigadas());
    }

    @Operation(summary = "Actualizar brigada", description = "Actualiza los datos de una brigada existente (nombre, tipo, estado, ubicación).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Brigada actualizada correctamente"),
        @ApiResponse(responseCode = "404", description = "Brigada no encontrada")
    })
    @PutMapping("/brigadas/{id}")
    public ResponseEntity<Brigada> actualizarBrigada(
            @Parameter(description = "ID de la brigada a actualizar") @PathVariable Long id,
            @RequestBody Brigada datos) {
        return ResponseEntity.ok(monitoreoService.actualizarBrigada(id, datos));
    }

    @Operation(summary = "Asignar brigada a reporte", description = "Crea una asignación entre una brigada disponible y un reporte de incendio activo.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Asignación creada correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o brigada no disponible")
    })
    @PostMapping({"/asignaciones", "/asignaciones/crear"})
    public ResponseEntity<AsignacionBrigada> asignarBrigada(
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(
                monitoreoService.asignarBrigada(
                        body.get("reporteId"),
                        body.get("brigadaId")));
    }

    @Operation(summary = "Asignaciones por reporte", description = "Retorna todas las asignaciones de brigadas asociadas a un reporte específico.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Asignaciones obtenidas correctamente"),
        @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    @GetMapping("/asignaciones/{reporteId}")
    public ResponseEntity<List<AsignacionBrigada>> obtenerAsignaciones(
            @Parameter(description = "ID del reporte de incendio") @PathVariable Long reporteId) {
        return ResponseEntity.ok(
                monitoreoService.obtenerAsignacionesPorReporte(reporteId));
    }

    @Operation(summary = "Crear brigada", description = "Registra una nueva brigada en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Brigada creada correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos de la brigada inválidos")
    })
    @PostMapping("/brigadas")
    public ResponseEntity<Brigada> crearBrigada(@RequestBody Brigada brigada) {
        return ResponseEntity.ok(monitoreoService.crearBrigada(brigada));
    }

    @Operation(summary = "Liberar brigada por reporte", description = "Llamado automáticamente por ms-reportes (MonitoreoObserver) cuando un reporte pasa a RESUELTO o DESCARTADO. Libera la brigada asignada.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Brigada liberada correctamente"),
        @ApiResponse(responseCode = "404", description = "No se encontró asignación activa para ese reporte")
    })
    @PutMapping("/brigadas/liberar-por-reporte/{reporteId}")
    public ResponseEntity<Void> liberarBrigadaPorReporte(
            @Parameter(description = "ID del reporte cuya brigada debe liberarse") @PathVariable Long reporteId) {
        monitoreoService.liberarBrigadaPorReporte(reporteId);
        return ResponseEntity.ok().build();
    }
}