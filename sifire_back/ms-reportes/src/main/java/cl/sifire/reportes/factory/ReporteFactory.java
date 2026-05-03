package cl.sifire.reportes.factory;

import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.model.ReporteIncendio;


public interface ReporteFactory {
    // aqui se define el contrato para crear un reporte, cada tipo de usuario (ciudadano, bombero, etc) va a tener su propia implementacion de esta interfaz, con sus propias reglas de negocio para armar el reporte segun quien lo envia
    ReporteIncendio crear(ReporteRequestDTO dto);
}
