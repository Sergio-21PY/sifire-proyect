// --- Colores y Constantes ---
export const coloresNivel = { ALTO: '#ef4444', MEDIO: '#f97316', BAJO: '#eab308' };
export const coloresEstado = {
  PENDIENTE:   { bg: '#fef9c3', text: '#854d0e' },
  EN_CURSO:  { bg: '#fee2e2', text: '#991b1b' },
  CONTROLADO:  { bg: '#dcfce7', text: '#166534' },
  CERRADO:     { bg: '#f1f5f9', text: '#475569' },
};

// --- Estilos Generales ---
export const mainContainer = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: '2rem'
};

// --- Header ---
export const headerContainer = {
  marginBottom: '2rem'
};
export const headerTitle = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#1e293b',
  margin: 0
};
export const headerSubtitle = {
  color: '#64748b',
  marginTop: '0.3rem'
};

// --- KPIs ---
export const kpiGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem',
  marginBottom: '2rem'
};
export const kpiCard = (color) => ({
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  borderLeft: `5px solid ${color}`
});
export const kpiIcon = {
  fontSize: '2rem'
};
export const kpiValue = (color) => ({
  fontSize: '2.2rem',
  fontWeight: 700,
  color: color
});
export const kpiLabel = {
  color: '#64748b',
  fontSize: '0.9rem'
};

// --- Tabla de Reportes Recientes ---
export const tableWrapper = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  overflow: 'hidden'
};
export const tableHeader = {
  padding: '1.2rem 1.5rem',
  borderBottom: '1px solid #e2e8f0'
};
export const tableTitle = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#1e293b'
};
export const table = {
  width: '100%',
  borderCollapse: 'collapse'
};
export const tableHeadRow = {
  backgroundColor: '#f8fafc'
};
export const tableHeadCell = {
  padding: '0.8rem 1.5rem',
  textAlign: 'left',
  fontSize: '0.8rem',
  color: '#64748b',
  fontWeight: 600,
  textTransform: 'uppercase'
};
export const tableBodyRow = {
  borderTop: '1px solid #f1f5f9'
};
export const tableCell = {
  padding: '1rem 1.5rem',
  fontSize: '0.9rem',
  color: '#64748b'
};
export const tableCellId = { ...tableCell, color: '#94a3b8' };
export const tableCellTitle = { ...tableCell, fontWeight: 500, color: '#1e293b' };
export const levelBadge = (nivel) => ({
  color: coloresNivel[nivel] || '#64748b',
  fontWeight: 700,
  fontSize: '0.85rem'
});
export const statusBadge = (estado) => ({
  backgroundColor: (coloresEstado[estado] || coloresEstado.CERRADO).bg,
  color: (coloresEstado[estado] || coloresEstado.CERRADO).text,
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 600,
});
