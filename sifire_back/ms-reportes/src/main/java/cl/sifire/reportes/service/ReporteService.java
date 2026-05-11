package cl.sifire.reportes.service;

import cl.sifire.reportes.dto.CambioEstadoDTO;
import cl.sifire.reportes.dto.ReporteRequestDTO;
import cl.sifire.reportes.factory.ReporteFactory;
import cl.sifire.reportes.factory.ReporteFactorySelector;
import cl.sifire.reportes.model.HistorialReporte;
import cl.sifire.reportes.model.ReporteIncendio;
import cl.sifire.reportes.model.ReporteMultimedia;
import cl.sifire.reportes.observer.ReporteEventPublisher;
import cl.sifire.reportes.repository.HistorialRepository;
import cl.sifire.reportes.repository.MultimediaRepository;
import cl.sifire.reportes.repository.ReporteRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * ═══════════════════════════════════════════════════════════════
 * Servicio principal de ms-reportes.
 * Orquesta los CUATRO patrones de diseño del microservicio:
 *
 * 1. FACTORY METHOD:
 *    Al crear un reporte, delega en ReporteFactorySelector la
 *    elección de la fábrica correcta según el tipoReportante.
 *    Cada fábrica aplica sus propias reglas de negocio.
 *
 * 2. REPOSITORY PATTERN:
 *    Todas las operaciones de persistencia van a través de los
 *    repositorios JPA. El servicio nunca escribe SQL directo.
 *
 * 3. OBSERVER PATTERN:
 *    Tras guardar un reporte o cambiar su estado, el servicio
 *    notifica al ReporteEventPublisher, quien propaga el evento
 *    a todos los observers (AlertaObserver, MonitoreoObserver).
 *    La notificación va FUERA de la transacción para que un
 *    fallo del observer no haga rollback del reporte guardado.
 *
 * 4. CIRCUIT BREAKER (Resilience4j):
 *    Protege las llamadas al eventPublisher (Observer) que
 *    dependen de ms-alertas y ms-monitoreo (servicios externos).
 *    Si esos servicios fallan repetidamente, el circuito se ABRE
 *    y ejecuta el fallback directamente, evitando que el hilo
 *    quede bloqueado esperando respuesta de un servicio caído.
 * ═══════════════════════════════════════════════════════════════
 */
@Service
public class ReporteService {

    private static final Logger log = LoggerFactory.getLogger(ReporteService.class);

    // Nombre del circuit breaker — debe coincidir con application.yml
    private static final String CB_OBSERVER = "observerService";

    private final ReporteRepository reporteRepository;
    private final HistorialRepository historialRepository;
    private final MultimediaRepository multimediaRepository;
    private final ReporteFactorySelector factorySelector; // Factory Method
    private final ReporteEventPublisher eventPublisher;   // Observer

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Autowired
    public ReporteService(
            ReporteRepository reporteRepository,
            HistorialRepository historialRepository,
            MultimediaRepository multimediaRepository,
            ReporteFactorySelector factorySelector,
            ReporteEventPublisher eventPublisher) {
        this.reporteRepository = reporteRepository;
        this.historialRepository = historialRepository;
        this.multimediaRepository = multimediaRepository;
        this.factorySelector = factorySelector;
        this.eventPublisher = eventPublisher;
    }

    // ──────────────────────────────────────────────────────────────
    // CREAR REPORTE — usa Factory Method + Repository
    // La transacción solo cubre el INSERT en BD.
    // La notificación al Observer va separada (ver notificarCreacion)
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ReporteIncendio crearReporte(ReporteRequestDTO dto) {
        // Paso 1: Factory Method elige la fábrica según tipoReportante
        ReporteFactory factory = factorySelector.seleccionar(dto.getTipoReportante());

        // Paso 2: La fábrica aplica las reglas de negocio y construye el objeto
        ReporteIncendio reporte = factory.crear(dto);

        // Paso 3: Repository Pattern — persiste en BD dentro de la transacción
        ReporteIncendio guardado = reporteRepository.save(reporte);
        log.info("[ReporteService] Reporte ID={} guardado correctamente.", guardado.getId());
        return guardado;
    }

    // ──────────────────────────────────────────────────────────────
    // NOTIFICAR CREACIÓN — Observer + Circuit Breaker
    //
    // Va FUERA de @Transactional a propósito:
    // si ms-alertas o ms-monitoreo fallan, el reporte ya está
    // guardado en BD y NO se hace rollback.
    //
    // @CircuitBreaker protege esta llamada:
    // - Si el publisher falla más del 50% de las veces → circuito ABRE
    // - Mientras está abierto → se ejecuta fallbackNotificacionCreacion()
    // - Después de 5s → pasa a SEMI-ABIERTO para probar recuperación
    // ──────────────────────────────────────────────────────────────

    @CircuitBreaker(name = CB_OBSERVER, fallbackMethod = "fallbackNotificacionCreacion")
    public void notificarCreacion(ReporteIncendio reporte) {
        eventPublisher.publicar(reporte, "CREADO");
        log.info("[ReporteService] Observers notificados para creación ID={}", reporte.getId());
    }

    /**
     * Fallback de notificarCreacion().
     * Se ejecuta cuando el Circuit Breaker está ABIERTO o lanza excepción.
     * El reporte YA está guardado en BD — solo se pierde la notificación.
     */
    public void fallbackNotificacionCreacion(ReporteIncendio reporte, Exception e) {
        log.warn("[CircuitBreaker] Notificación de creación no enviada para ID={}. " +
                 "Circuito abierto o error: {}", reporte.getId(), e.getMessage());
        // Aquí se podría guardar en una tabla de eventos pendientes para reintentar
    }

    // ──────────────────────────────────────────────────────────────
    // CAMBIAR ESTADO — Repository (historial + update) + Observer + Circuit Breaker
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ReporteIncendio cambiarEstado(Long reporteId, CambioEstadoDTO dto) {
        ReporteIncendio reporte = reporteRepository.findById(reporteId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado: " + reporteId));

        // Repository Pattern — guarda auditoría en HistorialReporte
        HistorialReporte historial = new HistorialReporte();
        historial.setReporteId(reporteId);
        historial.setEstadoAnterior(reporte.getEstado());
        historial.setEstadoNuevo(dto.getNuevoEstado());
        historial.setUsuarioId(dto.getUsuarioId());
        historial.setObservacion(dto.getObservacion());
        historialRepository.save(historial);

        // Repository Pattern — actualiza el estado del reporte
        reporte.setEstado(dto.getNuevoEstado());
        ReporteIncendio actualizado = reporteRepository.save(reporte);

        log.info("[ReporteService] Reporte ID={} cambió a estado={}",
                reporteId, dto.getNuevoEstado());
        return actualizado;
    }

    /**
     * Notifica el cambio de estado FUERA de la transacción.
     * Protegida con Circuit Breaker por la misma razón que notificarCreacion().
     */
    @CircuitBreaker(name = CB_OBSERVER, fallbackMethod = "fallbackNotificacionEstado")
    public void notificarCambioEstado(ReporteIncendio reporte) {
        eventPublisher.publicar(reporte, "ESTADO_ACTUALIZADO");
        log.info("[ReporteService] Observers notificados para cambio de estado ID={}", reporte.getId());
    }

    /**
     * Fallback de notificarCambioEstado().
     */
    public void fallbackNotificacionEstado(ReporteIncendio reporte, Exception e) {
        log.warn("[CircuitBreaker] Notificación de cambio de estado no enviada para ID={}. " +
                 "Circuito abierto o error: {}", reporte.getId(), e.getMessage());
    }

    // ──────────────────────────────────────────────────────────────
    // CONSULTAS — Repository Pattern
    // ──────────────────────────────────────────────────────────────

    public List<ReporteIncendio> listarTodos() {
        return reporteRepository.findAll();
    }

    public ReporteIncendio obtenerPorId(Long id) {
        return reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado: " + id));
    }

    public List<ReporteIncendio> listarPorEstado(ReporteIncendio.EstadoReporte estado) {
        return reporteRepository.findByEstado(estado);
    }

    public List<ReporteIncendio> listarActivos() {
        return reporteRepository.findByEstadoIn(List.of(
                ReporteIncendio.EstadoReporte.PENDIENTE,
                ReporteIncendio.EstadoReporte.EN_PROCESO));
    }

    // ──────────────────────────────────────────────────────────────
    // MULTIMEDIA — Repository Pattern
    // ──────────────────────────────────────────────────────────────

    public ReporteMultimedia adjuntarMultimedia(Long reporteId, String urlArchivo, String tipoArchivo) {
        ReporteIncendio reporte = obtenerPorId(reporteId);
        ReporteMultimedia multimedia = new ReporteMultimedia();
        multimedia.setReporteId(reporte.getId());
        multimedia.setUrlArchivo(urlArchivo);
        multimedia.setTipoArchivo(tipoArchivo);
        return multimediaRepository.save(multimedia);
    }

    public List<ReporteMultimedia> obtenerMultimedia(Long reporteId) {
        return multimediaRepository.findByReporteId(reporteId);
    }

    public List<HistorialReporte> obtenerHistorial(Long reporteId) {
        return historialRepository.findByReporteIdOrderByFechaCambioAsc(reporteId);
    }

    public ReporteMultimedia guardarFoto(Long reporteId, MultipartFile archivo) throws IOException {
        ReporteIncendio reporte = obtenerPorId(reporteId);

        // Ruta absoluta desde donde corre el proceso
        // Evita el problema con el directorio temporal de Tomcat
        String rutaBase = System.getProperty("user.dir") + File.separator + uploadDir;
        File dir = new File(rutaBase);
        if (!dir.exists()) dir.mkdirs();

        // Timestamp en el nombre para evitar colisiones de archivos
        String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        File destino = new File(dir, nombreArchivo);
        archivo.transferTo(destino.getAbsoluteFile());

        log.info("[ReporteService] Foto guardada en: {}", destino.getAbsolutePath());

        // Repository Pattern — registra la multimedia en BD
        ReporteMultimedia multimedia = new ReporteMultimedia();
        multimedia.setReporteId(reporte.getId());
        multimedia.setUrlArchivo(uploadDir + "/" + nombreArchivo);
        multimedia.setTipoArchivo(archivo.getContentType());
        return multimediaRepository.save(multimedia);
    }
}