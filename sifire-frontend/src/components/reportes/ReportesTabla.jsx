import * as styles from '../../styles/Reportes.styles';

const syncBadgeStyle = (sincronizado) => ({
  fontSize: '0.75rem', padding: '2px 8px', borderRadius: '999px', fontWeight: '600',
  background: sincronizado === false ? '#fef3c7' : '#dcfce7',
  color:      sincronizado === false ? '#92400e' : '#166534',
});

export default function ReportesTabla({ reportes, esFuncionario, onAsignar, onVerDetalle }) {
  const headers = ['#', 'Título', 'Nivel', 'Estado', 'Origen', 'Descripción', 'Fecha', 'Sync', ...(esFuncionario ? ['Acción'] : [])];

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeadRow}>
            {headers.map(h => <th key={h} style={styles.tableHeadCell}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {reportes.map((r) => (
            <tr key={r.id} style={{ ...styles.tableBodyRow, cursor: 'pointer' }} onClick={() => onVerDetalle(r)}>
              <td style={styles.tableCellId}>#{r.id}</td>
              <td style={styles.tableCellTitle}>{r.titulo}</td>
              <td style={styles.tableCell}><span style={styles.levelBadge(r.nivel)}>● {r.nivel}</span></td>
              <td style={styles.tableCell}><span style={styles.statusBadge(r.estado)}>{r.estado.replace('_', ' ')}</span></td>
              <td style={styles.tableCell}>{r.origen}</td>
              <td style={styles.tableCellDescription}>{r.descripcion}</td>
              <td style={styles.tableCell}>{r.fecha}</td>
              <td style={styles.tableCell}>
                <span style={syncBadgeStyle(r.sincronizado)}>
                  {r.sincronizado === false ? ' Pendiente' : ' Sync'}
                </span>
              </td>
              {esFuncionario && (
                <td style={styles.tableCell}>
                  {r.estado === 'EN_CURSO' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onAsignar(r); }}
                      style={styles.assignButton}>
                      Asignar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}