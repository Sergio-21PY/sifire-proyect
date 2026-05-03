package cl.duoc.ser.sotoc.msmonitoreo.controller;

import cl.duoc.ser.sotoc.msmonitoreo.client.AlertaClient;
import cl.duoc.ser.sotoc.msmonitoreo.client.ReporteClient;
import cl.duoc.ser.sotoc.msmonitoreo.client.UsuarioClient;
import cl.duoc.ser.sotoc.msmonitoreo.dto.AlertaDTO;
import cl.duoc.ser.sotoc.msmonitoreo.dto.DashboardDTO;
import cl.duoc.ser.sotoc.msmonitoreo.dto.ReporteDTO;
import cl.duoc.ser.sotoc.msmonitoreo.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/monitoreo")
@CrossOrigin(origins = "*")
public class MonitoreoController {

    @Autowired
    private UsuarioClient usuarioClient;

    @Autowired
    private AlertaClient alertaClient;

    @Autowired
    private ReporteClient reporteClient;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        // 1. Obtener total de usuarios
        List<UsuarioDTO> usuarios = usuarioClient.listarUsuarios();
        long totalUsuarios = (usuarios != null) ? usuarios.size() : 0;

        // 2. Obtener y contar alertas por estado
        List<AlertaDTO> alertas = alertaClient.listarAlertas();
        Map<String, Long> alertasPorEstado = (alertas != null) ?
                alertas.stream().collect(Collectors.groupingBy(AlertaDTO::getEstado, Collectors.counting())) :
                Map.of();

        // 3. Obtener y contar reportes de hoy
        List<ReporteDTO> reportes = reporteClient.listarReportes();
        long reportesDeHoy = (reportes != null) ?
                reportes.stream().filter(r -> r.getFechaCreacion().toLocalDate().isEqual(LocalDate.now())).count() :
                0;

        // 4. Construir el DTO de respuesta
        DashboardDTO dashboard = new DashboardDTO();
        dashboard.setTotalUsuarios(totalUsuarios);
        dashboard.setAlertasPorEstado(alertasPorEstado);
        dashboard.setReportesGeneradosHoy(reportesDeHoy);

        return ResponseEntity.ok(dashboard);
    }
}
