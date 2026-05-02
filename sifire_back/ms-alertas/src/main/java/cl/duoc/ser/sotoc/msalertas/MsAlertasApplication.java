package cl.duoc.ser.sotoc.msalertas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsAlertasApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsAlertasApplication.class, args);
	}

}
