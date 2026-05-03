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
 * Orquesta los tres patrones de diseño del microservicio:
 *
 * 1. FACTORY METHOD:
 * Al crear un reporte, delega en ReporteFactorySelector la
 * elección de la fábrica correcta según el tipoReportante.
 * Cada fábrica aplica sus propias reglas de negocio.
 *
 * 2. REPOSITORY PATTERN:
 * Todas las operaciones de persistencia van a través de los
 * repositorios JPA. El servicio nunca escribe SQL directo.
 *
 * 3. OBSERVER PATTERN:
 * Tras guardar un reporte o cambiar su estado, el servicio
 * notifica al ReporteEventPublisher, quien propaga el evento
 * a todos los observers (AlertaObserver, MonitoreoObserver).
 * La notificación va FUERA de la transacción para que un
 * fallo del observer no haga rollback del reporte guardado.
 * ═══════════════════════════════════════════════════════════════
 */
@Service
public class ReporteService {

    private static final Logger log = LoggerFactory.getLogger(ReporteService.class);

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
    // CREAR REPORTE — usa Factory Method
    // La transacción solo cubre el INSERT en BD.
    // La notificación al Observer va separada para que si ms-alertas
    // o ms-monitoreo fallan, el reporte ya quedó guardado igual.
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ReporteIncendio crearReporte(ReporteRequestDTO dto) {
        // Paso 1 y 2: Factory Method elige la fábrica y aplica reglas de negocio
        ReporteFactory factory = factorySelector.seleccionar(dto.getTipoReportante());
        ReporteIncendio reporte = factory.crear(dto);

        // Paso 3: Repository Pattern — guarda en BD
        ReporteIncendio guardado = reporteRepository.save(reporte);
        log.info("[ReporteService] Reporte ID={} guardado correctamente.", guardado.getId());
        return guardado;
    }

    /**
     * Notifica a los observers FUERA de la transacción.
     * Si ms-alertas o ms-monitoreo no están disponibles,
     * el reporte ya está en BD y no se hace rollback.
     */
    public void notificarCreacion(ReporteIncendio reporte) {
        try {
            eventPublisher.publicar(reporte, "CREADO");
        } catch (Exception e) {
            log.warn("[ReporteService] Observer falló al notificar creación ID={}: {}",
                reporte.getId(), e.getMessage());
        }
    }

    // ──────────────────────────────────────────────────────────────
    // CAMBIAR ESTADO — genera historial + notifica observers
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public ReporteIncendio cambiarEstado(Long reporteId, CambioEstadoDTO dto) {
        ReporteIncendio reporte = reporteRepository.findById(reporteId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado: " + reporteId));

        // Guardar auditoría en HistorialReporte
        HistorialReporte historial = new HistorialReporte();
        historial.setReporteId(reporteId);
        historial.setEstadoAnterior(reporte.getEstado());
        historial.setEstadoNuevo(dto.getNuevoEstado());
        historial.setUsuarioId(dto.getUsuarioId());
        historial.setObservacion(dto.getObservacion());
        historialRepository.save(historial);

        // Actualizar estado
        reporte.setEstado(dto.getNuevoEstado());
        ReporteIncendio actualizado = reporteRepository.save(reporte);

        // Observer notifica el cambio (fuera de transacción implícita)
        try {
            eventPublisher.publicar(actualizado, "ESTADO_ACTUALIZADO");
        } catch (Exception e) {
            log.warn("[ReporteService] Observer falló al notificar cambio estado ID={}: {}",
                reporteId, e.getMessage());
        }

        return actualizado;
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

        // Ruta absoluta desde donde corre el proceso — evita el problema con el directorio temporal de Tomcat
        String rutaBase = System.getProperty("user.dir") + File.separator + uploadDir;
        File dir = new File(rutaBase);
        if (!dir.exists()) dir.mkdirs();

        String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        File destino = new File(dir, nombreArchivo);
        archivo.transferTo(destino.getAbsoluteFile());

        log.info("[ReporteService] Foto guardada en: {}", destino.getAbsolutePath());

        ReporteMultimedia multimedia = new ReporteMultimedia();
        multimedia.setReporteId(reporte.getId());
        multimedia.setUrlArchivo(uploadDir + "/" + nombreArchivo);
        multimedia.setTipoArchivo(archivo.getContentType());
        return multimediaRepository.save(multimedia);
    }
}