package cl.sifire.ms_bff.service;

import cl.sifire.ms_bff.config.MicroserviciosConfig;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

// Acá está toda la lógica del BFF.
// Este servicio actúa como intermediario entre el frontend y los microservicios,
// combinando datos cuando es necesario y manejando errores con circuit breaker.
@Service
public class BffService {

        @Autowired
        private MicroserviciosConfig config;

        @Autowired
        private RestTemplate restTemplate;

        // ─── MAPA Y DASHBOARD ───────────────────────────────────────────
        public Object listarRutas() {
                return restTemplate.getForObject(
                                config.getMonitoreoUrl() + "/api/rutas-evacuacion", Object.class);
        }

        // Junta todo lo que necesita el mapa: reportes activos, zonas de riesgo,
        // rutas de evacuación y brigadas disponibles en una sola llamada
        @CircuitBreaker(name = "ms-monitoreo", fallbackMethod = "mapaFallback")
        public Map<String, Object> getDatosMapa() {
                Map<String, Object> datos = new HashMap<>();
                datos.put("reportesActivos", restTemplate.getForObject(
                                config.getReportesUrl() + "/api/reportes?activos=true", Object.class));
                datos.put("zonas", restTemplate.getForObject(
                                config.getMonitoreoUrl() + "/api/zonas-riesgo", Object.class));
                datos.put("rutas", restTemplate.getForObject(
                                config.getMonitoreoUrl() + "/api/rutas-evacuacion", Object.class));
                datos.put("brigadas", restTemplate.getForObject(
                                config.getMonitoreoUrl() + "/api/brigadas", Object.class));
                return datos;
        }

        // Si algún microservicio del mapa no responde, devolvemos esto
        // para que el frontend no explote con un error 500
        public Map<String, Object> mapaFallback(Exception e) {
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("reportesActivos", null);
                fallback.put("zonas", null);
                fallback.put("rutas", null);
                fallback.put("brigadas", null);
                fallback.put("mensaje", "Servicio no disponible, intente más tarde");
                return fallback;
        }

        // Para el dashboard combinamos reportes recientes y alertas del historial
        @CircuitBreaker(name = "ms-reportes", fallbackMethod = "dashboardFallback")
        public Map<String, Object> getDashboard() {
                Map<String, Object> datos = new HashMap<>();
                datos.put("reportes", restTemplate.getForObject(
                                config.getReportesUrl() + "/api/reportes", Object.class));
                datos.put("alertas", restTemplate.getForObject(
                                config.getAlertasUrl() + "/api/alertas/historial", Object.class));
                return datos;
        }

        public Map<String, Object> dashboardFallback(Exception e) {
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("reportes", null);
                fallback.put("alertas", null);
                fallback.put("mensaje", "Servicio no disponible, intente más tarde");
                return fallback;
        }

        // ─── USUARIOS ───────────────────────────────────────────────────

        // Delega el login a ms-usuarios y devuelve los datos del usuario autenticado
        public Object login(Map<String, String> credenciales) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, String>> request = new HttpEntity<>(credenciales, headers);
                try {
                        return restTemplate.postForObject(
                                        config.getUsuariosUrl() + "/api/usuarios/login", request, Object.class);
                } catch (org.springframework.web.client.HttpClientErrorException.Unauthorized e) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
                } catch (org.springframework.web.client.HttpStatusCodeException e) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        e.getStatusCode(), "Error en ms-usuarios: " + e.getResponseBodyAsString());
                } catch (org.springframework.web.client.ResourceAccessException e) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE,
                                        "ms-usuarios no disponible");
                }
        }

        public Object registrarUsuario(Map<String, Object> usuario) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                Map<String, Object> usuarioMapeado = new HashMap<>(usuario);

                // Generamos un username a partir del nombre: "María González" →
                // "maria.gonzalez"
                if (usuarioMapeado.containsKey("username")) {
                        String nombre = (String) usuarioMapeado.get("username");
                        usuarioMapeado.put("nombre", nombre);
                        String username = nombre.trim().toLowerCase()
                                        .replace(" ", ".")
                                        .replace("á", "a").replace("é", "e").replace("í", "i")
                                        .replace("ó", "o").replace("ú", "u").replace("ñ", "n");
                        usuarioMapeado.put("username", username);
                }

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(usuarioMapeado, headers);
                return restTemplate.postForObject(
                                config.getUsuariosUrl() + "/api/usuarios/registro", request, Object.class);
        }

        // Trae la lista completa de usuarios, útil para el panel de administración
        public Object listarUsuarios() {
                return restTemplate.getForObject(
                                config.getUsuariosUrl() + "/api/usuarios/listar", Object.class);
        }

        // ─── REPORTES ───────────────────────────────────────────────────

        // Lista todos los reportes registrados en el sistema
        public Object listarReportes() {
                return restTemplate.getForObject(
                                config.getReportesUrl() + "/api/reportes", Object.class);
        }

        // Envía un nuevo reporte a ms-reportes, que aplica el Factory Method
        // según el tipo de usuario que lo crea
        public Object crearReporte(Map<String, Object> reporte) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(reporte, headers);
                return restTemplate.postForObject(
                                config.getReportesUrl() + "/api/reportes/crear", request, Object.class);
        }

        // Cambia el estado de un reporte (PENDIENTE → EN_PROCESO → CONTROLADO →
        // CERRADO)
        // ms-reportes se encarga de registrar el historial del cambio
        public Object cambiarEstadoReporte(Long id, Map<String, ?> body) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> payload = new HashMap<>();
                String nuevoEstado = body.get("nuevoEstado") != null ? body.get("nuevoEstado").toString() : body.get("estado").toString();
                // Si no viene el ID del usuario en el body, lanzamos error o usamos el del token
                Object usuarioId = body.get("usuarioId");
                if (usuarioId == null) throw new RuntimeException("Se requiere usuarioId para el historial");

                payload.put("nuevoEstado", nuevoEstado);
                payload.put("usuarioId", usuarioId);
                payload.put("observacion", "Cambio desde dashboard");

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
                restTemplate.put(
                                config.getReportesUrl() + "/api/reportes/" + id + "/estado", request);

                // Si el reporte se resuelve o descarta, liberar las brigadas asignadas
                if ("RESUELTO".equals(nuevoEstado) || "DESCARTADO".equals(nuevoEstado)) {
                        try {
                                Object[] asignaciones = restTemplate.getForObject(
                                                config.getMonitoreoUrl() + "/api/asignaciones/" + id, Object[].class);

                                if (asignaciones != null) {
                                        for (Object a : asignaciones) {
                                                Map<String, Object> asig = (Map<String, Object>) a;
                                                Map<String, Object> brigada = (Map<String, Object>) asig.get("brigada");
                                                Long brigadaId = Long.valueOf(brigada.get("id").toString());

                                                Map<String, Object> brigadaUpdate = new HashMap<>();
                                                brigadaUpdate.put("estado", "DISPONIBLE");
                                                HttpEntity<Map<String, Object>> brigReq = new HttpEntity<>(
                                                                brigadaUpdate, headers);
                                                restTemplate.put(
                                                                config.getMonitoreoUrl() + "/api/brigadas/" + brigadaId,
                                                                brigReq);
                                        }
                                }
                        } catch (Exception e) {
                                // falla silenciosamente — el reporte igual queda resuelto
                                System.out.println("Error al liberar brigadas: " + e.getMessage());
                        }
                }

                return Map.of("mensaje", "Estado actualizado correctamente");
        }

        // ─── ALERTAS ────────────────────────────────────────────────────

        // Lista todas las alertas emitidas, tanto automáticas como manuales
        public Object listarAlertas() {
                return restTemplate.getForObject(
                                config.getAlertasUrl() + "/api/alertas", Object.class);
        }

        // Permite a un funcionario emitir una alerta manual hacia la comunidad
        public Object crearAlerta(Map<String, Object> alerta) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Las alertas manuales del funcionario se marcan como ENVIADA directamente
                Map<String, Object> alertaConEstado = new HashMap<>(alerta);
                alertaConEstado.put("estado", "ENVIADA");

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(alertaConEstado, headers);
                return restTemplate.postForObject(
                                config.getAlertasUrl() + "/api/alertas/crear", request, Object.class);
        }

        // ─── MONITOREO ──────────────────────────────────────────────────

        // Devuelve las zonas de riesgo para mostrarlas en el mapa
        public Object listarZonas() {
                return restTemplate.getForObject(
                                config.getMonitoreoUrl() + "/api/zonas-riesgo", Object.class);
        }

        // Lista las brigadas y su disponibilidad actual
        public Object listarBrigadas() {
                return restTemplate.getForObject(
                                config.getMonitoreoUrl() + "/api/brigadas", Object.class);
        }

        // Trae las asignaciones activas de brigadas a reportes
        public Object listarAsignaciones() {
                // Traemos las asignaciones
                Object[] asignaciones = restTemplate.getForObject(
                                config.getMonitoreoUrl() + "/api/asignaciones", Object[].class);

                if (asignaciones == null)
                        return new Object[] {};

                // Para cada asignación cruzamos con ms-reportes
                return java.util.Arrays.stream(asignaciones).map(a -> {
                        Map<String, Object> asig = new HashMap<>((Map<String, Object>) a);
                        try {
                                Object reporte = restTemplate.getForObject(
                                                config.getReportesUrl() + "/api/reportes/" + asig.get("reporteId"),
                                                Object.class);
                                if (reporte instanceof Map) {
                                        Map<String, Object> r = (Map<String, Object>) reporte;
                                        asig.put("titulo", r.get("titulo"));
                                        asig.put("descripcion", r.get("descripcion"));
                                        asig.put("nivel", r.get("nivelRiesgo"));
                                        asig.put("estado", r.get("estado"));
                                        asig.put("fechaCreacion", r.get("fechaCreacion"));
                                        asig.put("latitud", r.get("latitud"));
                                        asig.put("longitud", r.get("longitud"));
                                }
                        } catch (Exception e) {
                                asig.put("titulo", "Reporte #" + asig.get("reporteId"));
                        }
                        return asig;
                }).collect(java.util.stream.Collectors.toList());
        }

        // Asigna una brigada disponible a un reporte activo
        public Object crearAsignacion(Map<String, Object> asignacion) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(asignacion, headers);
                return restTemplate.postForObject(
                                config.getMonitoreoUrl() + "/api/asignaciones/crear", request, Object.class);
        }

        public Object subirFoto(Long id, org.springframework.web.multipart.MultipartFile archivo) throws Exception {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("archivo", new ByteArrayResource(archivo.getBytes()) {
                        @Override
                        public String getFilename() {
                                return archivo.getOriginalFilename();
                        }
                });

                HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
                return restTemplate.postForObject(
                                config.getReportesUrl() + "/api/reportes/" + id + "/subir-foto", request, Object.class);
        }

        // Llama al endpoint en ms-alertas
        // Integración Sergio: asigna brigadistas a una alerta en ms-alertas
        public Object asignarBrigadistasAlerta(Long id) {
                return restTemplate.postForObject(
                                config.getAlertasUrl() + "/api/alertas/" + id + "/asignar-brigadistas",
                                null, Object.class);
        }
}