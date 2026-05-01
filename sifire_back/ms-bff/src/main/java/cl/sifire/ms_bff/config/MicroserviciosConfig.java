package cl.sifire.ms_bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class MicroserviciosConfig {

    @Value("${ms.usuarios.url:http://localhost:8081}")
    private String usuariosUrl;

    @Value("${ms.reportes.url:http://localhost:8082}")
    private String reportesUrl;

    @Value("${ms.monitoreo.url:http://localhost:8083}")
    private String monitoreoUrl;

    @Value("${ms.alertas.url:http://localhost:8084}")
    private String alertasUrl;

    public String getUsuariosUrl() { return usuariosUrl; }
    public String getReportesUrl() { return reportesUrl; }
    public String getMonitoreoUrl() { return monitoreoUrl; }
    public String getAlertasUrl() { return alertasUrl; }

    // bean compartido para hacer llamadas http a los otros microservicios
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}