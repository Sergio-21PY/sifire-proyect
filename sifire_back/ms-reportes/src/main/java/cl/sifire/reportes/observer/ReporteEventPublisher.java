package cl.sifire.reportes.observer;

import cl.sifire.reportes.model.ReporteIncendio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

// este se encarga de publicar eventos relacionados a los reportes, como cuando se crea un nuevo reporte o se actualiza su estado, y notificar a todos los observadores registrados (como el servicio de alertas) para que puedan reaccionar en consecuencia (por ejemplo, generando una alerta cuando se crea un nuevo reporte)
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
