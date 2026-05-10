package cl.sifire.reportes.service;

import cl.sifire.reportes.factory.ReporteBrigadistaFactory;
import cl.sifire.reportes.factory.ReporteCiudadanoFactory;
import cl.sifire.reportes.factory.ReporteFactory;
import cl.sifire.reportes.factory.ReporteFactorySelector;
import cl.sifire.reportes.factory.ReporteFuncionarioFactory;
import cl.sifire.reportes.model.ReporteIncendio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ReporteFactorySelectorTest {

    @Mock private ReporteCiudadanoFactory ciudadanoFactory;
    @Mock private ReporteBrigadistaFactory brigadistaFactory;
    @Mock private ReporteFuncionarioFactory funcionarioFactory;

    @InjectMocks
    private ReporteFactorySelector selector;

    @Test
    void seleccionar_TipoCiudadano_DebeRetornarCiudadanoFactory() {
        ReporteFactory factory = selector.seleccionar(ReporteIncendio.TipoReportante.CIUDADANO);

        assertSame(ciudadanoFactory, factory);
    }

    @Test
    void seleccionar_TipoBrigadista_DebeRetornarBrigadistaFactory() {
        ReporteFactory factory = selector.seleccionar(ReporteIncendio.TipoReportante.BRIGADISTA);

        assertSame(brigadistaFactory, factory);
    }

    @Test
    void seleccionar_TipoFuncionario_DebeRetornarFuncionarioFactory() {
        ReporteFactory factory = selector.seleccionar(ReporteIncendio.TipoReportante.FUNCIONARIO);

        assertSame(funcionarioFactory, factory);
    }
}