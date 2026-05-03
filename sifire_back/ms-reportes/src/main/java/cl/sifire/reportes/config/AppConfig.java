package cl.sifire.reportes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuración de beans de infraestructura para ms-reportes.
 *
 * RestTemplate: cliente HTTP usado por los Observers (AlertaObserver y
 * MonitoreoObserver) para notificar a los demás microservicios.
 * Se declara aquí para que Spring lo gestione como singleton.
 */
@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
