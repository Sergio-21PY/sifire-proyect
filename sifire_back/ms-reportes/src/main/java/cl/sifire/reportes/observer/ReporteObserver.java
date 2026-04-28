package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Observer — Interfaz Observer
 * ═══════════════════════════════════════════════════════
 *
 * Define el contrato que deben cumplir todos los observadores
 * del sistema de reportes.
 *
 * Observadores registrados:
 *   - AlertaObserver   → notifica a ms-alertas (puerto 8084)
 *   - MonitoreoObserver → notifica a ms-monitoreo (puerto 8083)
 *
 * Cuando ms-reportes guarda un reporte nuevo o cambia su estado,
 * el Subject (ReporteEventPublisher) notifica a todos los observers.
 */
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
