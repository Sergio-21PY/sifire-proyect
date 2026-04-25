import * as styles from '../../styles/GestionBrigadistas.styles';

export default function BrigadistasTabla({ brigadistas, loadingData, onToggleEstado }) {
  return (
    <div style={styles.tableWrapper}>
      <div style={styles.tableHeader}>
        <p style={styles.tableHeaderText}>
          {brigadistas.length} brigadistas registrados — {brigadistas.filter(b => b.estado === 'ACTIVO').length} activos
        </p>
      </div>
      {loadingData ? (
        <p style={styles.loadingText}>Cargando datos...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              {['#', 'Nombre', 'Correo', 'Teléfono', 'Asignaciones', 'Estado', 'Acción'].map(h => (
                <th key={h} style={styles.tableHeadCell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brigadistas.map((b) => (
              <tr key={b.id} style={styles.tableBodyRow}>
                <td style={styles.tableCellId}>#{b.id}</td>
                <td style={styles.tableCellName}>{b.nombre}</td>
                <td style={styles.tableCell}>{b.email}</td>
                <td style={styles.tableCell}>{b.telefono || 'N/A'}</td>
                <td style={styles.tableCell}>
                  <span style={styles.asignacionesBadge(b.asignaciones)}>
                    {b.asignaciones > 0 ? `${b.asignaciones} activa${b.asignaciones > 1 ? 's' : ''}` : 'Sin asignar'}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.estadoBadge(b.estado)}>{b.estado}</span>
                </td>
                <td style={styles.tableCell}>
                  <button onClick={() => onToggleEstado(b.id)} style={styles.actionButton}>
                    {b.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}