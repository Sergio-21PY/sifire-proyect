import { useAuth } from '../context/AuthContext';
import { useReportes } from '../hooks/useReportes';
import ReporteForm from '../components/reportes/ReporteForm';
import ReportesTabla from '../components/reportes/ReportesTabla';
import ModalAsignar from '../components/reportes/ModalAsignar';
import ReporteDetalleModal from '../components/reportes/ReporteDetalleModal';
import * as styles from '../styles/Reportes.styles';

export default function Reportes() {
  const { usuario } = useAuth();
  const {
    reportes, form, showForm, exito, exitoAsign,
    modalReporte, setModalReporte,
    reporteDetalle, setReporteDetalle,
    brigadistaId, setBrigadistaId,
    centroMapa,
    handleChange, handleUbicacion, handleArchivos,
    eliminarArchivo, abrirFormulario, usarMiUbicacion,
    handleSubmit, handleAsignar,
  } = useReportes();

  const esFuncionario = usuario?.tipo === 'FUNCIONARIO';
  const esCiudadano   = usuario?.tipo === 'CIUDADANO';

  return (
    <div style={styles.mainContainer}>
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.headerTitle}>Reportes de Incendio</h1>
          <p style={styles.headerSubtitle}>
            {esFuncionario
              ? 'Gestión de focos activos y su historial'
              : `Bienvenido, ${usuario?.username || usuario?.nombre} — aquí puedes reportar un incendio`}
          </p>
        </div>
        {(esCiudadano || esFuncionario) && (
          <button onClick={abrirFormulario} style={styles.headerButton}>
            {showForm ? 'Cancelar' : '+ Nuevo Reporte'}
          </button>
        )}
      </div>

      {exito      && <div style={styles.successAlert}>✓ Reporte enviado correctamente</div>}
      {exitoAsign && <div style={styles.infoAlert}>✓ Brigadista asignado correctamente</div>}

      {showForm && (
        <ReporteForm
          form={form} centroMapa={centroMapa}
          onChange={handleChange} onUbicacion={handleUbicacion}
          onArchivos={handleArchivos} onEliminarArchivo={eliminarArchivo}
          onUbicacionActual={usarMiUbicacion}
          onSubmit={handleSubmit} onCancelar={() => abrirFormulario()}
        />
      )}

      <ReportesTabla
        reportes={reportes}
        esFuncionario={esFuncionario}
        onAsignar={(r) => { setModalReporte(r); setBrigadistaId(''); }}
        onVerDetalle={(r) => setReporteDetalle(r)}
      />

      {modalReporte && (
        <ModalAsignar
          reporte={modalReporte} brigadistaId={brigadistaId}
          onChangeBrigadista={setBrigadistaId}
          onConfirmar={handleAsignar}
          onCancelar={() => setModalReporte(null)}
        />
      )}

      {reporteDetalle && (
        <ReporteDetalleModal
          reporte={reporteDetalle}
          onCerrar={() => setReporteDetalle(null)}
        />
      )}
    </div>
  );
}