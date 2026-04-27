package cl.duoc.ser.sotoc.sifirebackend;

import cl.duoc.ser.sotoc.sifirebackend.factory.UsuarioFactory;
import cl.duoc.ser.sotoc.sifirebackend.model.Usuario;
import cl.duoc.ser.sotoc.sifirebackend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class SifireBackendApplication {

    // TEMPORAL HASTA QUE TENGAMOS LA BD, ES SOLO DE PRUEBA!
    public static void main(String[] args) {
        SpringApplication.run(SifireBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(UsuarioRepository usuarioRepository) {
        return args -> {
            // Limpiar la base de datos en cada inicio de la aplicación
            usuarioRepository.deleteAll();

            // Usuarios de prueba creados con la fábrica
            Usuario user1 = UsuarioFactory.createUsuario("FUNCIONARIO", "Ana Martínez", "funcionario@demo.cl", "12345678");
            Usuario user2 = UsuarioFactory.createUsuario("BRIGADISTA", "Carlos Rojas", "brigadista@demo.cl", "12345678");
            Usuario user3 = UsuarioFactory.createUsuario("CIUDADANO", "María González", "ciudadano@demo.cl", "12345678");

            // Guarda lista de usuarios
            List<Usuario> usuarios = Arrays.asList(user1, user2, user3);
            usuarioRepository.saveAll(usuarios);

            System.out.println(">>> Usuarios de prueba cargados usando UsuarioFactory.");
        };
    }
}
