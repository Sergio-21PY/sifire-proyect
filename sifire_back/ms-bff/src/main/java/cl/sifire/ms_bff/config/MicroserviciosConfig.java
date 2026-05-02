package cl.sifire.ms_bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

// Acá configuramos las URLs de cada microservicio.
// Si no se define una variable de entorno, usa localhost con el puerto por defecto.
// Esto nos permite cambiar las URLs fácilmente cuando despleguemos en producción.
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

    public String getUsuariosUrl()  { return usuariosUrl; }
    public String getReportesUrl()  { return reportesUrl; }
    public String getMonitoreoUrl() { return monitoreoUrl; }
    public String getAlertasUrl()   { return alertasUrl; }

    // RestTemplate es el cliente HTTP que usamos para llamar a los otros micros.
    // Lo declaramos como Bean para poder inyectarlo en cualquier parte del BFF.
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}