package cl.sifire.alertas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("SIFIRE - ms-alertas") // ← cambia el nombre según el MS
                .version("1.0.0")
                .description("API del microservicio de alertas de incendio")
            );
    }
}
