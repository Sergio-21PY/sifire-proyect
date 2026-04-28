package cl.sifire.reportes.factory;

import cl.sifire.reportes.model.ReporteIncendio.TipoReportante;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Factory Method — Selector (Director de Fábrica)
 * ═══════════════════════════════════════════════════════
 *
 * Centraliza la decisión de qué fábrica concreta utilizar.
 * El ReporteService solo llama a este selector con el tipo de reportante;
 * nunca instancia fábricas directamente.
 *
 * Flujo:
 *   ReporteService → ReporteFactorySelector.seleccionar(tipo) → Factory concreta
 *
 * Si se agrega un nuevo tipo (ej: SENSOR_IOT), solo se crea una nueva
 * fábrica y se agrega un case aquí. Nada más cambia. (Open/Closed)
 */
@Component
public class ReporteFactorySelector {

    private final ReporteCiudadanoFactory ciudadanoFactory;
    private final ReporteBrigadistaFactory brigadistaFactory;
    private final ReporteFuncionarioFactory funcionarioFactory;

    @Autowired
    public ReporteFactorySelector(
        ReporteCiudadanoFactory ciudadanoFactory,
        ReporteBrigadistaFactory brigadistaFactory,
        ReporteFuncionarioFactory funcionarioFactory
    ) {
        this.ciudadanoFactory = ciudadanoFactory;
        this.brigadistaFactory = brigadistaFactory;
        this.funcionarioFactory = funcionarioFactory;
    }

    /**
     * Retorna la fábrica correspondiente al tipo de reportante.
     *
     * @param tipo TipoReportante del usuario que crea el reporte
     * @return Implementación concreta de ReporteFactory
     */
    public ReporteFactory seleccionar(TipoReportante tipo) {
        return switch (tipo) {
            case CIUDADANO   -> ciudadanoFactory;
            case BRIGADISTA  -> brigadistaFactory;
            case FUNCIONARIO -> funcionarioFactory;
        };
    }
}
