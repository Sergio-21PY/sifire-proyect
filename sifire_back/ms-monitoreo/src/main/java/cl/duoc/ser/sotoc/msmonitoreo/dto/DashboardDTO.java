package cl.duoc.ser.sotoc.msmonitoreo.dto;
import lombok.Data;
import java.util.Map;
@Data
public class DashboardDTO {
    private long totalUsuarios;
    private Map<String, Long> alertasPorEstado;
    private long reportesGeneradosHoy;
}
