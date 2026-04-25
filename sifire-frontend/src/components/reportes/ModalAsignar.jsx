import { brigadistasMock } from '../../data/mockData';
import * as styles from '../../styles/Reportes.styles';

export default function ModalAsignar({ reporte, brigadistaId, onChangeBrigadista, onConfirmar, onCancelar }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Asignar Brigadista</h2>
        <p style={styles.modalSubtitle}>Reporte: <strong>{reporte.titulo}</strong></p>
        <form onSubmit={onConfirmar}>
          <label style={styles.label}>Selecciona un brigadista *</label>
          <select value={brigadistaId} onChange={e => onChangeBrigadista(e.target.value)} required style={{ ...styles.input, marginBottom: '1.2rem' }}>
            <option value="">— Seleccionar —</option>
            {brigadistasMock.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
          <div style={styles.modalFormActions}>
            <button type="submit" style={styles.modalConfirmButton}>Confirmar</button>
            <button type="button" onClick={onCancelar} style={styles.modalCancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}