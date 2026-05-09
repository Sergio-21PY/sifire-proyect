package cl.sifire.alertas.client;

import cl.sifire.alertas.dto.UsuarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "ms-usuarios")
public interface UsuarioClient {
    @GetMapping("/api/usuarios/por-tipo/{tipo}")
    List<UsuarioDTO> listarUsuariosPorTipo(@PathVariable("tipo") String tipo);
}
