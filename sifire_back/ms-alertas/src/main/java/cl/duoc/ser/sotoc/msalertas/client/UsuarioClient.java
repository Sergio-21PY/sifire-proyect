package cl.duoc.ser.sotoc.msalertas.client;

import cl.duoc.ser.sotoc.msalertas.dto.UsuarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-usuarios", url = "${ms-usuarios.url}")
public interface UsuarioClient {

    @GetMapping("/api/usuarios/por-tipo/{tipo}")
    List<UsuarioDTO> listarUsuariosPorTipo(@PathVariable("tipo") String tipo);
}
