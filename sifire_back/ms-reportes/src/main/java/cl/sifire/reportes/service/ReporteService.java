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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
 * ═══════════════════════════════════════════════════════════════
 */
@Service
public class ReporteService {

    private final ReporteRepository reporteRepository;
    private final HistorialRepository historialRepository;
    private final MultimediaRepository multimediaRepository;
    private final ReporteFactorySelector factorySelector; // Factory Method
    private final ReporteEventPublisher eventPublisher; // Observer

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
    // ──────────────────────────────────────────────────────────────

    /**
     * Crea un reporte usando el Factory Method.
     *
     * Paso 1: ReporteFactorySelector elige la fábrica según tipoReportante
     * Paso 2: La fábrica aplica sus reglas (nivel riesgo, estado inicial,
     * validaciones)
     * Paso 3: Repository guarda el reporte
     * Paso 4: Observer notifica a ms-alertas y ms-monitoreo
     */
    @Transactional
    public ReporteIncendio crearReporte(ReporteRequestDTO dto) {
        // Paso 1 y 2: Factory Method
        ReporteFactory factory = factorySelector.seleccionar(dto.getTipoReportante());
        ReporteIncendio reporte = factory.crear(dto);

        // Paso 3: Repository Pattern
        ReporteIncendio guardado = reporteRepository.save(reporte);

        // Paso 4: Observer Pattern — notifica a ms-alertas y ms-monitoreo
        eventPublisher.publicar(guardado, "CREADO");

        return guardado;
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

        // Observer notifica el cambio
        eventPublisher.publicar(actualizado, "ESTADO_ACTUALIZADO");

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
        return reporteRepository.findByEstadoIn(
                List.of(ReporteIncendio.EstadoReporte.PENDIENTE,
                        ReporteIncendio.EstadoReporte.EN_PROCESO));
    }

    public List<HistorialReporte> obtenerHistorial(Long reporteId) {
        return historialRepository.findByReporteIdOrderByFechaCambioAsc(reporteId);
    }

    public ReporteMultimedia adjuntarMultimedia(Long reporteId, String urlArchivo, String tipoArchivo) {
        // Verifica que el reporte existe
        reporteRepository.findById(reporteId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado: " + reporteId));

        ReporteMultimedia media = new ReporteMultimedia();
        media.setReporteId(reporteId);
        media.setUrlArchivo(urlArchivo);
        media.setTipoArchivo(tipoArchivo);
        return multimediaRepository.save(media);
    }

    public ReporteMultimedia guardarFoto(Long reporteId, MultipartFile archivo) throws Exception {
        String carpeta = "uploads/";
        new java.io.File(carpeta).mkdirs();
        String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        java.nio.file.Path ruta = java.nio.file.Paths.get(carpeta + nombreArchivo);
        java.nio.file.Files.write(ruta, archivo.getBytes());

        ReporteMultimedia media = new ReporteMultimedia();
        media.setReporteId(reporteId);
        media.setUrlArchivo("/uploads/" + nombreArchivo);
        media.setTipoArchivo(archivo.getContentType());
        return multimediaRepository.save(media);
    }

    public List<ReporteMultimedia> obtenerMultimedia(Long reporteId) {
        return multimediaRepository.findByReporteId(reporteId);
    }
}
