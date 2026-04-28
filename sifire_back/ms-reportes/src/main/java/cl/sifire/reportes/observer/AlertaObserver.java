package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Observer — Observador de Alertas
 * ═══════════════════════════════════════════════════════
 *
 * Observador que reacciona cuando ms-reportes crea un reporte nuevo.
 * Su responsabilidad: notificar a ms-alertas para que emita una alerta
 * automática si el nivel de riesgo es ALTO o CRITICO.
 *
 * Solo actúa si:
 *   - El evento es "CREADO"
 *   - El tipo de reportante es FUNCIONARIO (disparo automático)
 *     O el nivel de riesgo es CRITICO (independiente del tipo)
 *
 * Si ms-alertas no está disponible, registra el error pero NO lanza
 * excepción (el reporte ya fue guardado, la alerta puede reintentarse).
 */
@Component
public class AlertaObserver implements ReporteObserver {

    private static final Logger log = LoggerFactory.getLogger(AlertaObserver.class);

    @Value("${ms.alertas.url:http://localhost:8084}")
    private String msAlertasUrl;

    private final RestTemplate restTemplate;

    public AlertaObserver(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public void notificar(ReporteIncendio reporte, String evento) {
        // Solo actúa ante creación de reportes críticos o de funcionarios
        boolean esCreacion = "CREADO".equals(evento);
        boolean requiereAlerta =
            reporte.getTipoReportante() == ReporteIncendio.TipoReportante.FUNCIONARIO ||
            reporte.getNivelRiesgo() == ReporteIncendio.NivelRiesgo.CRITICO;

        if (!esCreacion || !requiereAlerta) return;

        log.info("[AlertaObserver] Disparando alerta automática para reporte ID={} | Nivel={} | Tipo={}",
            reporte.getId(), reporte.getNivelRiesgo(), reporte.getTipoReportante());

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("reporteId", reporte.getId());
            payload.put("nivelRiesgo", reporte.getNivelRiesgo().name());
            payload.put("latitud", reporte.getLatitud());
            payload.put("longitud", reporte.getLongitud());
            payload.put("descripcion", reporte.getDescripcion());
            payload.put("origen", "AUTOMATICO");

            restTemplate.postForEntity(
                msAlertasUrl + "/api/alertas/emitir",
                payload,
                Object.class
            );
            log.info("[AlertaObserver] Alerta enviada exitosamente a ms-alertas.");
        } catch (Exception e) {
            // El reporte ya está guardado. La alerta puede reintentarse desde ms-alertas.
            log.error("[AlertaObserver] No se pudo notificar a ms-alertas: {}", e.getMessage());
        }
    }
}
