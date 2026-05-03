package cl.duoc.ser.sotoc.sifirebackend;

import cl.duoc.ser.sotoc.sifirebackend.factory.UsuarioFactory;
import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class SifireBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SifireBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            usuarioRepository.deleteAll();

            Usuario user1 = UsuarioFactory.createUsuario(Usuario.TipoUsuario.FUNCIONARIO, "Ana Martínez", "ana.martinez", "funcionario@demo.cl", "12345678", passwordEncoder);
            Usuario user2 = UsuarioFactory.createUsuario(Usuario.TipoUsuario.BRIGADISTA, "Carlos Rojas", "carlos.rojas", "brigadista@demo.cl", "12345678", passwordEncoder);
            Usuario user3 = UsuarioFactory.createUsuario(Usuario.TipoUsuario.CIUDADANO, "María González", "maria.gonzalez", "ciudadano@demo.cl", "12345678", passwordEncoder);

            List<Usuario> usuarios = Arrays.asList(user1, user2, user3);
            usuarioRepository.saveAll(usuarios);

            System.out.println(">>> Usuarios de prueba cargados usando el factory y contraseñas hasheadas.");
        };
    }
}
