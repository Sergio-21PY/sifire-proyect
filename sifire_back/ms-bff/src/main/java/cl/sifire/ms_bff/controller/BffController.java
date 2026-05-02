package cl.sifire.ms_bff.controller;

import cl.sifire.ms_bff.service.BffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Este controlador es el único punto de contacto entre el frontend y el backend.
// El frontend nunca habla directamente con los microservicios — todo pasa por acá.
@RestController
@RequestMapping("/bff")
@CrossOrigin(origins = "*")
public class BffController {

    @Autowired
    private BffService bffService;

    // Devuelve los datos necesarios para pintar el mapa de incendios en tiempo real
    @GetMapping("/mapa")
    public ResponseEntity<Map<String, Object>> getMapa() {
        return ResponseEntity.ok(bffService.getDatosMapa());
    }

    // Agrega los datos del dashboard: reportes activos, brigadas, alertas recientes
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(bffService.getDashboard());
    }

    // ─── USUARIOS ───────────────────────────────────────────────────

    // Recibe email y password, delega la validación a ms-usuarios
    @PostMapping("/usuarios/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> credenciales) {
        return ResponseEntity.ok(bffService.login(credenciales));
    }

    // Crea un nuevo usuario en el sistema, delegando a ms-usuarios
    @PostMapping("/usuarios/registro")
    public ResponseEntity<Object> registro(@RequestBody Map<String, Object> usuario) {
        return ResponseEntity.ok(bffService.registrarUsuario(usuario));
    }

    // Lista todos los usuarios registrados, útil para el panel de administración
    @GetMapping("/usuarios/listar")
    public ResponseEntity<Object> listarUsuarios() {
        return ResponseEntity.ok(bffService.listarUsuarios());
    }

    // ─── REPORTES ───────────────────────────────────────────────────

    // Trae todos los reportes de incendio registrados en el sistema
    @GetMapping("/reportes")
    public ResponseEntity<Object> listarReportes() {
        return ResponseEntity.ok(bffService.listarReportes());
    }

    // Crea un nuevo reporte de incendio enviado por un ciudadano, brigadista o
    // funcionario
    @PostMapping("/reportes/crear")
    public ResponseEntity<Object> crearReporte(@RequestBody Map<String, Object> reporte) {
        return ResponseEntity.ok(bffService.crearReporte(reporte));
    }

    @PostMapping("/reportes/{id}/subir-foto")
    public ResponseEntity<Object> subirFoto(
            @PathVariable Long id,
            @RequestParam("archivo") org.springframework.web.multipart.MultipartFile archivo) throws Exception {
        return ResponseEntity.ok(bffService.subirFoto(id, archivo));
    }

    // Actualiza el estado de un reporte (ej: PENDIENTE → EN_PROCESO → CONTROLADO)
    @PutMapping("/reportes/{id}/estado")
    public ResponseEntity<Object> cambiarEstadoReporte(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bffService.cambiarEstadoReporte(id, body));
    }

    // ─── ALERTAS ────────────────────────────────────────────────────

    // Lista todas las alertas emitidas, ordenadas por fecha
    @GetMapping("/alertas")
    public ResponseEntity<Object> listarAlertas() {
        return ResponseEntity.ok(bffService.listarAlertas());
    }

    // Permite a un funcionario emitir una alerta manual hacia la comunidad
    @PostMapping("/alertas/crear")
    public ResponseEntity<Object> crearAlerta(@RequestBody Map<String, Object> alerta) {
        return ResponseEntity.ok(bffService.crearAlerta(alerta));
    }

    // ─── MONITOREO ──────────────────────────────────────────────────

    // Trae las zonas de riesgo para mostrarlas en el mapa
    @GetMapping("/monitoreo/zonas")
    public ResponseEntity<Object> listarZonas() {
        return ResponseEntity.ok(bffService.listarZonas());
    }

    // Lista las brigadas disponibles para asignación
    @GetMapping("/monitoreo/brigadas")
    public ResponseEntity<Object> listarBrigadas() {
        return ResponseEntity.ok(bffService.listarBrigadas());
    }

    // Muestra las asignaciones activas de brigadas a reportes
    @GetMapping("/monitoreo/asignaciones")
    public ResponseEntity<Object> listarAsignaciones() {
        return ResponseEntity.ok(bffService.listarAsignaciones());
    }

    // Asigna una brigada a un reporte específico
    @PostMapping("/monitoreo/asignaciones/crear")
    public ResponseEntity<Object> crearAsignacion(@RequestBody Map<String, Object> asignacion) {
        return ResponseEntity.ok(bffService.crearAsignacion(asignacion));
    }

    // Asigna brigadistas a una alerta (funcionalidad de Sergio)
    @PostMapping("/alertas/{id}/asignar-brigadistas")
    public ResponseEntity<Object> asignarBrigadistasAlerta(@PathVariable Long id) {
        return ResponseEntity.ok(bffService.asignarBrigadistasAlerta(id));
    }
}