package cl.duoc.ser.sotoc.sifirebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SifireBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SifireBackendApplication.class, args);
    }

    // CommandLineRunner eliminado - la BD MySQL ya tiene datos del script SQL
    // Si necesitas datos de prueba, usa el archivo sifire-mysql.sql
}
