// --- Colores y Constantes ---
export const coloresNivel = { ALTO: '#ef4444', MEDIO: '#f97316', BAJO: '#eab308', CRITICO: '#b91c1c' };
export const coloresEstado = {
  PENDIENTE: { bg: '#fef9c3', text: '#854d0e' },
  EN_CURSO: { bg: '#fee2e2', text: '#991b1b' },
  CONTROLADO: { bg: '#dcfce7', text: '#166534' },
  CERRADO: { bg: '#f1f5f9', text: '#475569' },
};

// --- Estilos Generales ---
export const mainContainer = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: '2rem'
};

// --- Header ---
export const headerContainer = {
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

// --- Alertas y Mensajes ---
export const successAlert = {
  backgroundColor: '#dcfce7',
  color: '#166534',
  padding: '0.8rem 1.2rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontWeight: 500
};
export const noAsignacionesContainer = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '3rem',
  textAlign: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
};
export const noAsignacionesText = {
  fontSize: '1.1rem',
  color: '#94a3b8'
};

// --- Grid de Tarjetas ---
export const cardsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '1rem'
};

// --- Tarjeta de Asignación ---
export const card = (nivel) => ({
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  borderLeft: `5px solid ${coloresNivel[nivel] ?? '#64748b'}`
});
export const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '0.8rem'
};
export const cardTitle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#1e293b',
  margin: 0
};
export const cardLevelBadge = (nivel) => ({
  color: coloresNivel[nivel] ?? '#64748b',
  fontWeight: 700,
  fontSize: '0.8rem',
  whiteSpace: 'nowrap',
  marginLeft: '0.5rem'
});
export const cardDescription = {
  color: '#64748b',
  fontSize: '0.875rem',
  marginBottom: '1rem'
};
export const cardMeta = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1rem',
  fontSize: '0.8rem',
  color: '#94a3b8'
};
export const cardFooter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};
export const cardStatusBadge = (estado) => ({
  backgroundColor: (coloresEstado[estado] ?? coloresEstado.CERRADO).bg,
  color: (coloresEstado[estado] ?? coloresEstado.CERRADO).text,
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 600
});
export const cardActions = {
  display: 'flex',
  gap: '0.5rem'
};
export const actionButton = (estado) => ({
  backgroundColor: estado === 'CERRADO' ? '#f1f5f9' : '#dcfce7',
  color: estado === 'CERRADO' ? '#475569' : '#166534',
  border: 'none',
  padding: '0.35rem 0.9rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer'
});
