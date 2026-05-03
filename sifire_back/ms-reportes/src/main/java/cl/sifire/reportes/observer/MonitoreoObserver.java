package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

// este observer se encarga de notificar a ms-monitoreo cada vez que un reporte cambia de estado o se crea, para que el equipo de monitoreo tenga siempre la info actualizada en su dashboard
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

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("reporteId", reporte.getId());
            payload.put("latitud", reporte.getLatitud());
            payload.put("longitud", reporte.getLongitud());
            payload.put("nivelRiesgo", reporte.getNivelRiesgo().name());
            payload.put("estado", reporte.getEstado().name());
            payload.put("evento", evento);

            restTemplate.postForEntity(
                msMonitoreoUrl + "/api/focos/sincronizar",
                payload,
                Object.class
            );
            log.info("[MonitoreoObserver] Foco sincronizado con ms-monitoreo.");
        } catch (Exception e) {
            log.error("[MonitoreoObserver] No se pudo notificar a ms-monitoreo: {}", e.getMessage());
        }
    }
}
