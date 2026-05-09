package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class AlertaObserver implements ReporteObserver {

    private static final Logger log = LoggerFactory.getLogger(AlertaObserver.class);

    @Value("${ms.alertas.url:http://localhost:8084}")
    private String msAlertasUrl;

    private final RestTemplate restTemplate;
    private final CircuitBreakerFactory<?, ?> circuitBreakerFactory;

    public AlertaObserver(RestTemplate restTemplate, CircuitBreakerFactory<?, ?> circuitBreakerFactory) {
        this.restTemplate = restTemplate;
        this.circuitBreakerFactory = circuitBreakerFactory;
    }

    @Override
    public void notificar(ReporteIncendio reporte, String evento) {
        boolean esCreacion = "CREADO".equals(evento);
        boolean requiereAlerta =
            reporte.getTipoReportante() == ReporteIncendio.TipoReportante.FUNCIONARIO ||
            reporte.getNivelRiesgo() == ReporteIncendio.NivelRiesgo.CRITICO;

        if (!esCreacion || !requiereAlerta) return;

        log.info("[AlertaObserver] Disparando alerta automática para reporte ID={} | Nivel={} | Tipo={}",
            reporte.getId(), reporte.getNivelRiesgo(), reporte.getTipoReportante());

        circuitBreakerFactory.create("alertasService").run(() -> {
            Map<String, Object> payload = new HashMap<>();
            payload.put("reporteId", reporte.getId());
            payload.put("nivelRiesgo", reporte.getNivelRiesgo().name());
            payload.put("latitud", reporte.getLatitud());
            payload.put("longitud", reporte.getLongitud());
            payload.put("descripcion", reporte.getDescripcion());
            payload.put("origen", "AUTOMATICO");
            restTemplate.postForEntity(msAlertasUrl + "/api/alertas/emitir", payload, Object.class);
            log.info("[AlertaObserver] Alerta enviada exitosamente a ms-alertas.");
            return null;
        }, throwable -> {
            log.warn("[AlertaObserver] ms-alertas no disponible (circuit open): {}", throwable.getMessage());
            return null;
        });
    }
}