package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;

// este se encarga de recibir notificaciones del service cuando se crea un nuevo reporte o se actualiza el estado de un reporte, y cada observer decide qué hacer con esa notificación (ej: emitir una alerta, enviar un email, etc)
public interface ReporteObserver {

    /**
     * Método invocado por el Subject cuando ocurre un evento de reporte.
     * Cada observer decide qué hacer con la notificación.
     *
     * @param reporte El reporte que generó el evento
     * @param evento  Tipo de evento (CREADO, ESTADO_ACTUALIZADO)
     */
    void notificar(ReporteIncendio reporte, String evento);
}
