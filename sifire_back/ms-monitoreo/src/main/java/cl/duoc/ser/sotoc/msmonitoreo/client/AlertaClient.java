package cl.duoc.ser.sotoc.msmonitoreo.client;
import cl.duoc.ser.sotoc.msmonitoreo.dto.AlertaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
@FeignClient(name = "ms-alertas", url = "${ms-alertas.url}")
public interface AlertaClient {
    @GetMapping("/v1/api/alertas/listar")
    List<AlertaDTO> listarAlertas();
}
