package cl.duoc.ser.sotoc.msmonitoreo.client;
import cl.duoc.ser.sotoc.msmonitoreo.dto.UsuarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
@FeignClient(name = "ms-usuarios", url = "${ms-usuarios.url}")
public interface UsuarioClient {
    @GetMapping("/api/usuarios/listar")
    List<UsuarioDTO> listarUsuarios();
}
