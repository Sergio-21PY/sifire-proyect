import { useAuth } from '../context/AuthContext';
import { useReportes } from '../hooks/useReportes';
import ReporteForm from '../components/reportes/ReporteForm';
import ReportesTabla from '../components/reportes/ReportesTabla';
import ModalAsignar from '../components/reportes/ModalAsignar';
import * as styles from '../styles/Reportes.styles';

export default function Reportes() {
  const { usuario } = useAuth();
  const {
    reportes, form, showForm, exito, exitoAsign,
    modalReporte, setModalReporte,
    brigadistaId, setBrigadistaId,
    centroMapa,
    handleChange, handleUbicacion, handleArchivos,
    eliminarArchivo, abrirFormulario, usarMiUbicacion,
    handleSubmit, handleAsignar,
  } = useReportes();

  const esFuncionario = usuario?.rol === 'FUNCIONARIO';
  const esCiudadano   = usuario?.rol === 'CIUDADANO';

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
        {/* Solo CIUDADANO y FUNCIONARIO pueden crear reportes */}
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
          form={form}
          centroMapa={centroMapa}
          onChange={handleChange}
          onUbicacion={handleUbicacion}
          onArchivos={handleArchivos}
          onEliminarArchivo={eliminarArchivo}
          onUbicacionActual={usarMiUbicacion}
          onSubmit={handleSubmit}
          onCancelar={() => abrirFormulario()}
        />
      )}

      <ReportesTabla
        reportes={reportes}
        esFuncionario={esFuncionario}
        onAsignar={(r) => { setModalReporte(r); setBrigadistaId(''); }}
      />

      {modalReporte && (
        <ModalAsignar
          reporte={modalReporte}
          brigadistaId={brigadistaId}
          onChangeBrigadista={setBrigadistaId}
          onConfirmar={handleAsignar}
          onCancelar={() => setModalReporte(null)}
        />
      )}

    </div>
  );
}
