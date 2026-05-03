package cl.duoc.ser.sotoc.sifirebackend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@OpenAPIDefinition(
    info = @Info(
        title = "API de Microservicio de Usuarios",
        description = "Documentación de los endpoints para la gestión de usuarios.",
        version = "v1.0"
    )
)
@SecurityScheme(
    name = "bearerAuth",
    description = "Token JWT para autenticación",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
