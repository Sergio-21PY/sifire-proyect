// --- Colores y Constantes ---
export const coloresEstado = {
  PENDIENTE:  { bg: '#fef9c3', text: '#854d0e' },
  EN_CURSO:   { bg: '#fee2e2', text: '#991b1b' },
  CONTROLADO: { bg: '#dcfce7', text: '#166534' },
  CERRADO:    { bg: '#f1f5f9', text: '#475569' },
};
export const coloresNivel = { ALTO: '#ef4444', MEDIO: '#f97316', BAJO: '#eab308', CRITICO: '#7f1d1d' };

// --- Estilos Generales ---
export const mainContainer = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: '2rem'
};

// --- Header ---
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
  margin: '0.3rem 0 0'
};
export const headerButton = {
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '0.7rem 1.4rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer'
};

// --- Alertas ---
export const successAlert = {
  backgroundColor: '#dcfce7',
  color: '#166534',
  padding: '0.8rem 1.2rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontWeight: 500
};
export const infoAlert = {
  backgroundColor: '#dbeafe',
  color: '#1e40af',
  padding: '0.8rem 1.2rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontWeight: 500
};

// --- Formulario ---
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
export const formGridFull = {
  gridColumn: '1 / -1'
};
export const formActions = {
  marginTop: '1.2rem',
  display: 'flex',
  gap: '0.8rem'
};
export const submitButton = {
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer'
};
export const cancelButton = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer'
};

// --- Estilos de Inputs y Labels ---
export const input = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none'
};
export const label = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.4rem'
};
export const labelSpan = {
  fontWeight: 400,
  color: '#94a3b8',
  marginLeft: '0.4rem'
};
export const locationText = {
  fontSize: '0.8rem',
  color: '#64748b',
  marginTop: '0.4rem'
};

// --- Mapa ---
export const mapContainer = {
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #e2e8f0',
  height: '450px'
};
export const map = {
  height: '450px',
  width: '100%'
};

// --- Carga de Archivos ---
export const dropzone = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px dashed #e2e8f0',
  borderRadius: '8px',
  padding: '1.5rem',
  cursor: 'pointer',
  backgroundColor: '#f8fafc',
  color: '#64748b',
  fontSize: '0.9rem',
  gap: '0.4rem'
};
export const dropzoneIcon = {
  fontSize: '1.8rem'
};
export const dropzoneHint = {
  fontSize: '0.75rem',
  color: '#94a3b8'
};
export const filePreviewContainer = {
  marginTop: '0.8rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem'
};
export const filePreviewItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  backgroundColor: '#f1f5f9',
  borderRadius: '6px',
  padding: '0.3rem 0.7rem',
  fontSize: '0.8rem',
  color: '#475569'
};
export const filePreviewName = {
  maxWidth: '150px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};
export const fileDeleteButton = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#ef4444',
  fontWeight: 700,
  fontSize: '0.9rem',
  padding: 0
};

// --- Tabla ---
export const tableWrapper = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  overflow: 'hidden'
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
  fontSize: '0.85rem'
};
export const tableCellId = { ...tableCell, color: '#94a3b8' };
export const tableCellTitle = { ...tableCell, fontWeight: 500, color: '#1e293b' };
export const tableCellDescription = { ...tableCell, maxWidth: '200px' };
export const levelBadge = (nivel) => ({
  color: coloresNivel[nivel] ?? '#64748b',
  fontWeight: 700,
  fontSize: '0.85rem'
});
export const statusBadge = (estado) => ({
  backgroundColor: (coloresEstado[estado] ?? coloresEstado.CERRADO).bg,
  color: (coloresEstado[estado] ?? coloresEstado.CERRADO).text,
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 600
});
export const assignButton = {
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  padding: '0.35rem 0.9rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer'
};

// --- Modal ---
export const modalOverlay = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};
export const modalContent = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '2rem',
  width: '400px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
};
export const modalTitle = {
  margin: '0 0 0.3rem',
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#1e293b'
};
export const modalSubtitle = {
  color: '#64748b',
  fontSize: '0.9rem',
  marginBottom: '1.2rem'
};
export const modalFormActions = {
  display: 'flex',
  gap: '0.8rem'
};
export const modalConfirmButton = {
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  flex: 1
};
export const modalCancelButton = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  flex: 1
};
