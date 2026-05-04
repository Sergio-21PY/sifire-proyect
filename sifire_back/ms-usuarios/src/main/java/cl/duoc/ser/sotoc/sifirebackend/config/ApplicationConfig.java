package cl.duoc.ser.sotoc.sifirebackend.config;

import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UsuarioRepository usuarioRepository;
}
