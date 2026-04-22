// --- Estilos para el Formulario ---

export const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.4rem'
};

export const inputStyle = (error) => ({
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: '8px',
  border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none'
});

export const errorStyle = {
  color: '#ef4444',
  fontSize: '0.8rem',
  marginTop: '0.3rem',
  display: 'block'
};

// --- Estilos Generales del Contenedor ---

export const mainContainer = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: '2rem'
};

// --- Estilos del Header ---

export const headerContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem'
};

export const headerTitle = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#1e293b',
  margin: 0
};

export const headerSubtitle = {
  color: '#64748b',
  margin: '0.3rem 0 0',
  fontSize: '0.9rem'
};

export const headerButton = {
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  padding: '0.7rem 1.4rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer'
};

// --- Estilos de Alertas y Formularios ---

export const successAlert = {
  backgroundColor: '#dcfce7',
  color: '#166534',
  padding: '0.8rem 1.2rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontWeight: 500
};

export const formContainer = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  marginBottom: '1.5rem'
};

export const formTitle = {
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#1e293b',
  marginTop: 0
};

export const formGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

export const formActions = {
  marginTop: '1.2rem',
  display: 'flex',
  gap: '0.8rem'
};

export const submitButton = (loading) => ({
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  opacity: loading ? 0.6 : 1
});

export const cancelButton = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer'
};

// --- Estilos de la Tabla ---

export const tableWrapper = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  overflow: 'hidden'
};

export const tableHeader = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #e2e8f0'
};

export const tableHeaderText = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#64748b'
};

export const loadingText = {
  textAlign: 'center',
  padding: '2rem',
  color: '#64748b'
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
  color: '#64748b',
  fontSize: '0.9rem'
};

export const tableCellId = {
  ...tableCell,
  color: '#94a3b8'
};

export const tableCellName = {
  ...tableCell,
  fontWeight: 500,
  color: '#1e293b'
};

export const asignacionesBadge = (asignaciones) => ({
  backgroundColor: asignaciones > 0 ? '#fef9c3' : '#f1f5f9',
  color: asignaciones > 0 ? '#854d0e' : '#94a3b8',
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 600
});

export const estadoBadge = (estado) => ({
  backgroundColor: estado === 'ACTIVO' ? '#dcfce7' : '#f1f5f9',
  color: estado === 'ACTIVO' ? '#166534' : '#475569',
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 600
});

export const actionButton = {
  backgroundColor: 'transparent',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '0.3rem 0.8rem',
  fontSize: '0.8rem',
  cursor: 'pointer',
  color: '#64748b'
};
