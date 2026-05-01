package cl.sifire.reportes.factory;

import cl.sifire.reportes.model.ReporteIncendio.TipoReportante;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
 @Component
public class ReporteFactorySelector {
    // Este selector se encarga de devolver la factory correcta según el tipo de reportante, es una forma de centralizar la lógica de selección y evitar que el controlador tenga que conocer las implementaciones específicas
    // aqui se inyectan las diferentes implementaciones de ReporteFactory, cada una con sus propias reglas de negocio para crear el reporte según el tipo de usuario que lo envía (ciudadano, bombero, funcionario)
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

    public ReporteFactory seleccionar(TipoReportante tipo) {
        return switch (tipo) {
            case CIUDADANO   -> ciudadanoFactory;
            case BRIGADISTA  -> brigadistaFactory;
            case FUNCIONARIO -> funcionarioFactory;
        };
    }
}
