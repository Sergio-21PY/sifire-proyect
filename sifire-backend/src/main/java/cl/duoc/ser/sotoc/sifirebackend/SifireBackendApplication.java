package cl.duoc.ser.sotoc.sifirebackend;

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

    public static void main(String[] args) {
        SpringApplication.run(SifireBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(UsuarioRepository usuarioRepository) {
        return args -> {
            // Limpiar la base de datos en cada inicio de la aplicación
            usuarioRepository.deleteAll();

            // Usuarios de prueba
            Usuario user1 = new Usuario();
            user1.setUsername("Ana Martínez");
            user1.setEmail("funcionario@demo.cl");
            user1.setPassword("12345678");
            user1.setRol("FUNCIONARIO");

            Usuario user2 = new Usuario();
            user2.setUsername("Carlos Rojas");
            user2.setEmail("brigadista@demo.cl");
            user2.setPassword("12345678");
            user2.setRol("BRIGADISTA");

            Usuario user3 = new Usuario();
            user3.setUsername("María González");
            user3.setEmail("ciudadano@demo.cl");
            user3.setPassword("12345678");
            user3.setRol("CIUDADANO");

            // Guarda lista de usuarios
            List<Usuario> usuarios = Arrays.asList(user1, user2, user3);
            usuarioRepository.saveAll(usuarios);

            System.out.println(">>> Usuarios de prueba cargados en la base de datos H2.");
        };
    }
}
