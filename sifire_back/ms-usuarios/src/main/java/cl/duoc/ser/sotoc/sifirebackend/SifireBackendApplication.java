package cl.duoc.ser.sotoc.sifirebackend;

<<<<<<< HEAD
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
=======
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90

@SpringBootApplication
public class SifireBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SifireBackendApplication.class, args);
    }

<<<<<<< HEAD
    @Bean
    public CommandLineRunner loadData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) { // Inyectado
        return args -> {
            usuarioRepository.deleteAll();

            Usuario user1 = UsuarioFactory.createUsuario("FUNCIONARIO", "Ana Martínez", "funcionario@demo.cl", passwordEncoder.encode("12345678"));
            Usuario user2 = UsuarioFactory.createUsuario("BRIGADISTA", "Carlos Rojas", "brigadista@demo.cl", passwordEncoder.encode("12345678"));
            Usuario user3 = UsuarioFactory.createUsuario("CIUDADANO", "María González", "ciudadano@demo.cl", passwordEncoder.encode("12345678"));

            List<Usuario> usuarios = Arrays.asList(user1, user2, user3);
            usuarioRepository.saveAll(usuarios);

            System.out.println(">>> Usuarios de prueba cargados con contraseñas hasheadas.");
        };
    }
=======
    // CommandLineRunner eliminado - la BD MySQL ya tiene datos del script SQL
    // Si necesitas datos de prueba, usa el archivo sifire-mysql.sql
>>>>>>> 85a9dbf486bcdf169200f6edc28efb2e605a1c90
}
