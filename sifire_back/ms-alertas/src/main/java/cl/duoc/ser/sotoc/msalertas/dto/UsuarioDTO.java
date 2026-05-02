package cl.duoc.ser.sotoc.msalertas.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String username;
    private String email;
    private String rol;
}
