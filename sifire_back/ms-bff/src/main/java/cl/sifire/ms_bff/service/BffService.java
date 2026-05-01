package cl.sifire.ms_bff.service;

import cl.sifire.ms_bff.config.MicroserviciosConfig;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

// service del bff, aca van las llamadas a los otros microservicios
// y la logica de negocio para combinar los datos y devolverlos al frontend
// deberia funcionar XD
@Service
public class BffService {

    @Autowired
    private MicroserviciosConfig config;

    @Autowired
    private RestTemplate restTemplate;

    // datos para el mapa: reportes activos + zonas + rutas + brigadas
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

    // si monitoreo no responde, devuelve esto en vez de explotar
    public Map<String, Object> mapaFallback(Exception e) {
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("reportesActivos", null);
        fallback.put("zonas", null);
        fallback.put("rutas", null);
        fallback.put("brigadas", null);
        fallback.put("mensaje", "servicio no disponible, intente mas tarde");
        return fallback;
    }

    // datos para el dashboard: reportes + alertas
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
        fallback.put("mensaje", "servicio no disponible, intente mas tarde");
        return fallback;
    }
}