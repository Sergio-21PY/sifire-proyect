package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class MonitoreoObserver implements ReporteObserver {

    private static final Logger log = LoggerFactory.getLogger(MonitoreoObserver.class);

    @Value("${ms.monitoreo.url:http://localhost:8083}")
    private String msMonitoreoUrl;

    private final RestTemplate restTemplate;

    public MonitoreoObserver(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public void notificar(ReporteIncendio reporte, String evento) {
        log.info("[MonitoreoObserver] Notificando foco ID={} | Evento={} | Estado={}",
            reporte.getId(), evento, reporte.getEstado());

        // Siempre sincroniza el foco en el mapa
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("reporteId", reporte.getId());
            payload.put("latitud", reporte.getLatitud());
            payload.put("longitud", reporte.getLongitud());
            payload.put("nivelRiesgo", reporte.getNivelRiesgo().name());
            payload.put("estado", reporte.getEstado().name());
            payload.put("evento", evento);

            restTemplate.postForEntity(
                msMonitoreoUrl + "/api/monitoreo/focos/sincronizar",
                payload,
                Object.class
            );
            log.info("[MonitoreoObserver] Foco sincronizado con ms-monitoreo.");
        } catch (Exception e) {
            log.error("[MonitoreoObserver] No se pudo sincronizar foco: {}", e.getMessage());
        }

        // Si el reporte se cerró, liberar la brigada asignada
        String estadoActual = reporte.getEstado().name();
        if ("ESTADO_ACTUALIZADO".equals(evento) &&
                ("RESUELTO".equals(estadoActual) || "DESCARTADO".equals(estadoActual))) {
            try {
                restTemplate.put(
                    msMonitoreoUrl + "/api/monitoreo/brigadas/liberar-por-reporte/" + reporte.getId(),
                    null
                );
                log.info("[MonitoreoObserver] Brigada liberada para reporte ID={}", reporte.getId());
            } catch (Exception e) {
                log.error("[MonitoreoObserver] No se pudo liberar brigada del reporte {}: {}",
                    reporte.getId(), e.getMessage());
            }
        }
    }
}
