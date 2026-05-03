import * as styles from '../../styles/Reportes.styles';

export default function ModalAsignar({ reporte, brigadistaId, brigadas = [], onChangeBrigadista, onConfirmar, onCancelar }) {
  const brigadasDisponibles = brigadas.filter(b => b.estado === 'DISPONIBLE');

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Asignar Brigada</h2>
        <p style={styles.modalSubtitle}>Reporte: <strong>{reporte.titulo}</strong></p>
        <form onSubmit={onConfirmar}>
          <label style={styles.label}>Selecciona una brigada disponible *</label>
          <select value={brigadistaId} onChange={e => onChangeBrigadista(e.target.value)} required style={{ ...styles.input, marginBottom: '1.2rem' }}>
            <option value="">— Seleccionar —</option>
            {brigadasDisponibles.length === 0 && (
              <option disabled>Sin brigadas disponibles</option>
            )}
            {brigadasDisponibles.map(b => (
              <option key={b.id} value={b.id}>{b.nombre} — {b.tipo}</option>
            ))}
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