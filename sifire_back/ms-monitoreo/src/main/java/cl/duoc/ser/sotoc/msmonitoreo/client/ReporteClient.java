package cl.duoc.ser.sotoc.msmonitoreo.client;

import cl.duoc.ser.sotoc.msmonitoreo.dto.ReporteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "ms-reportes", url = "${ms.reportes.url}")
public interface ReporteClient {
    @GetMapping("/api/reportes/listar")
    List<ReporteDTO> listarReportes();
}