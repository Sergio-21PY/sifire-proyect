package cl.sifire.alertas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cl.sifire.alertas.model.Alerta;
import cl.sifire.alertas.service.AlertaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
@Tag(name = "Alertas", description = "Gestión de alertas de incendio en SIFIRE")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    // ─── TUS ENDPOINTS ──────────────────────────────────────────────

    @Operation(summary = "Emitir una nueva alerta", description = "Crea y emite una alerta de incendio. Usado internamente por ms-reportes vía Observer.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alerta emitida correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos de la alerta inválidos")
    })
    @PostMapping("/emitir")
    public ResponseEntity<Alerta> emitirAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
    }

    @Operation(summary = "Crear alerta (alias BFF)", description = "Alias del endpoint /emitir para compatibilidad con el BFF.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alerta creada correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos de la alerta inválidos")
    })
    @PostMapping("/crear")
    public ResponseEntity<Alerta> crearAlerta(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crearAlerta(alerta));
    }

    @Operation(summary = "Listar todas las alertas", description = "Retorna la lista completa de alertas registradas en el sistema.")
    @ApiResponse(responseCode = "200", description = "Lista de alertas obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<Alerta>> listarAlertas() {
        return ResponseEntity.ok(alertaService.obtenerTodas());
    }

    @Operation(summary = "Historial de alertas", description = "Retorna el historial completo de alertas emitidas.")
    @ApiResponse(responseCode = "200", description = "Historial obtenido correctamente")
    @GetMapping("/historial")
    public ResponseEntity<List<Alerta>> historial() {
        return ResponseEntity.ok(alertaService.obtenerTodas());
    }

    @Operation(summary = "Reenviar alerta", description = "Cambia el estado de una alerta a PENDIENTE para que sea reenviada.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alerta marcada como PENDIENTE para reenvío"),
        @ApiResponse(responseCode = "404", description = "Alerta no encontrada")
    })
    @GetMapping("/{id}/reenviar")
    public ResponseEntity<Alerta> reenviar(
        @Parameter(description = "ID de la alerta a reenviar") @PathVariable Long id) {
        return ResponseEntity.ok(alertaService.actualizarEstado(id, Alerta.Estado.PENDIENTE));
    }

    @Operation(summary = "Filtrar alertas por estado", description = "Retorna todas las alertas que coincidan con el estado indicado (PENDIENTE, ENVIADA, FALLIDA, ASIGNADA).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alertas filtradas correctamente"),
        @ApiResponse(responseCode = "400", description = "Estado inválido")
    })
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Alerta>> porEstado(
        @Parameter(description = "Estado de la alerta: PENDIENTE | ENVIADA | FALLIDA | ASIGNADA") @PathVariable Alerta.Estado estado) {
        return ResponseEntity.ok(alertaService.obtenerPorEstado(estado));
    }

    @Operation(summary = "Alertas por reporte", description = "Retorna todas las alertas asociadas a un reporte de incendio específico.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Alertas del reporte obtenidas correctamente"),
        @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    @GetMapping("/reporte/{reporteId}")
    public ResponseEntity<List<Alerta>> porReporte(
        @Parameter(description = "ID del reporte de incendio") @PathVariable Long reporteId) {
        return ResponseEntity.ok(alertaService.obtenerPorReporteId(reporteId));
    }

    // ─── INTEGRACIÓN SERGIO ─────────────────────────────────────────

    @Operation(summary = "Asignar brigadistas a una alerta", description = "Busca brigadistas disponibles y los asigna automáticamente a la alerta indicada.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Brigadistas asignados correctamente"),
        @ApiResponse(responseCode = "404", description = "Alerta no encontrada"),
        @ApiResponse(responseCode = "500", description = "No hay brigadistas disponibles")
    })
    @PostMapping("/{id}/asignar-brigadistas")
    public ResponseEntity<Alerta> asignarBrigadistas(
        @Parameter(description = "ID de la alerta a la que se asignarán brigadistas") @PathVariable Long id) {
        return ResponseEntity.ok(alertaService.asignarBrigadistas(id));
    }
}