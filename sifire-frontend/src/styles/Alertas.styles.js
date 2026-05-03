export const coloresEstado = {
  ENVIADA:   { bg: '#dcfce7', text: '#166534' },
  PENDIENTE: { bg: '#fef9c3', text: '#854d0e' },
  FALLIDA:   { bg: '#fee2e2', text: '#991b1b' },
};

export const mainContainer = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: '2rem'
};

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
  margin: '0.3rem 0 0'
};

export const filterContainer = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '1.5rem'
};

export const filterButton = (isActive) => ({
  padding: '0.4rem 1rem',
  borderRadius: '999px',
  border: '1px solid #e2e8f0',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.85rem',
  backgroundColor: isActive ? '#1e293b' : '#fff',
  color: isActive ? '#fff' : '#64748b',
});

export const alertsListContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

export const alertCard = (estado) => ({
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '1.2rem 1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  borderLeft: `5px solid ${coloresEstado[estado].text}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem'
});

export const alertTitle = {
  color: '#1e293b',
  fontSize: '1rem',
  display: 'block',
  marginBottom: '0.4rem',
  fontWeight: 'bold'
};

export const alertMessage = {
  color: '#64748b',
  margin: '0 0 0.5rem',
  fontSize: '0.9rem'
};

export const alertMetaContainer = {
  display: 'flex',
  gap: '1rem',
  fontSize: '0.8rem',
  color: '#94a3b8'
};

export const alertStatusBadge = (estado) => ({
  backgroundColor: coloresEstado[estado].bg,
  color: coloresEstado[estado].text,
  padding: '0.3rem 0.9rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 700,
  whiteSpace: 'nowrap'
});