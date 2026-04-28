package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * ═══════════════════════════════════════════════════════
 * PATRÓN: Observer — Subject (Sujeto / Publicador)
 * ═══════════════════════════════════════════════════════
 *
 * Es el núcleo del patrón Observer en ms-reportes.
 * Mantiene la lista de observadores y los notifica cuando
 * ocurre un evento relevante (reporte creado o estado actualizado).
 *
 * Según el informe de arquitectura:
 *   ms-reportes = Sujeto (Subject)
 *   ms-alertas  = Observador Principal
 *   ms-monitoreo = Observador Geográfico
 *
 * El ReporteService usa este publisher para disparar notificaciones
 * sin conocer los detalles de cada observador. (Desacoplamiento total)
 *
 * Eventos disponibles:
 *   - "CREADO"            → reporte nuevo guardado en BD
 *   - "ESTADO_ACTUALIZADO" → cambio de estado en un reporte existente
 */
@Component
public class ReporteEventPublisher {

    /** Lista de observadores registrados (inyectados por Spring automáticamente) */
    private final List<ReporteObserver> observers;

    @Autowired
    public ReporteEventPublisher(List<ReporteObserver> observers) {
        this.observers = observers;
    }

    /**
     * Notifica a todos los observadores registrados sobre un evento de reporte.
     *
     * @param reporte Reporte que generó el evento
     * @param evento  Nombre del evento ("CREADO" | "ESTADO_ACTUALIZADO")
     */
    public void publicar(ReporteIncendio reporte, String evento) {
        observers.forEach(observer -> observer.notificar(reporte, evento));
    }
}
