import { C } from './theme';

export const coloresEstado = {
  ENVIADA:   { bg: '#052e16', text: '#4ade80' },
  PENDIENTE: { bg: '#422006', text: '#fb923c' },
  FALLIDA:   { bg: '#450a0a', text: '#f87171' },
};

export const mainContainer  = { minHeight: '100vh', backgroundColor: C.bg, padding: '2rem' };
export const headerContainer = { marginBottom: '1.5rem' };
export const headerTitle    = { fontSize: '1.8rem', fontWeight: 700, color: C.textPrimary, margin: 0 };
export const headerSubtitle = { color: C.textMuted, margin: '0.3rem 0 0' };

export const filterContainer = { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' };
export const filterButton = (isActive) => ({
  padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer',
  fontWeight: 600, fontSize: '0.85rem',
  border: `1px solid ${isActive ? C.red : C.border}`,
  backgroundColor: isActive ? C.red : C.surface,
  color: isActive ? '#fff' : C.textMuted,
});

export const alertsListContainer = { display: 'flex', flexDirection: 'column', gap: '1rem' };
export const alertCard = (estado) => ({
  backgroundColor: C.surface,
  borderRadius: C.radius,
  padding: '1.2rem 1.5rem',
  boxShadow: C.shadowSm,
  borderLeft: `4px solid ${coloresEstado[estado].text}`,
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
  border: `1px solid ${C.border}`,
  borderLeftWidth: '4px',
});
export const alertTitle   = { color: C.textPrimary, fontSize: '1rem', display: 'block', marginBottom: '0.4rem', fontWeight: 'bold' };
export const alertMessage = { color: C.textMuted, margin: '0 0 0.5rem', fontSize: '0.9rem' };
export const alertMetaContainer = { display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#475569' };
export const alertStatusBadge = (estado) => ({
  backgroundColor: coloresEstado[estado].bg,
  color: coloresEstado[estado].text,
  padding: '0.3rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap',
});