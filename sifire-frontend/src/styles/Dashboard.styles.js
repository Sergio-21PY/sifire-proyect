import { C } from './theme';

export const coloresNivel = { ALTO: C.red, MEDIO: C.orange, BAJO: C.yellow };
export const coloresEstado = {
  PENDIENTE:  { bg: '#422006', text: '#fb923c' },
  EN_CURSO:   { bg: '#450a0a', text: '#f87171' },
  CONTROLADO: { bg: '#052e16', text: '#4ade80' },
  CERRADO:    { bg: '#1e293b', text: '#94a3b8' },
};

export const mainContainer = {
  minHeight: '100vh',
  backgroundColor: C.bg,
  padding: '2rem',
};

export const headerContainer = { marginBottom: '2rem' };
export const headerTitle = {
  fontSize: '1.8rem', fontWeight: 700, color: C.textPrimary, margin: 0,
};
export const headerSubtitle = { color: C.textMuted, marginTop: '0.3rem' };

export const kpiGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem',
  marginBottom: '2rem',
};
export const kpiCard = (color) => ({
  backgroundColor: C.surface,
  borderRadius: C.radius,
  padding: '1.5rem',
  boxShadow: C.shadowSm,
  borderLeft: `4px solid ${color}`,
});
export const kpiIcon  = { fontSize: '2rem' };
export const kpiValue = (color) => ({ fontSize: '2.2rem', fontWeight: 700, color });
export const kpiLabel = { color: C.textMuted, fontSize: '0.9rem' };

export const tableWrapper = {
  backgroundColor: C.surface,
  borderRadius: C.radius,
  boxShadow: C.shadowSm,
  overflow: 'hidden',
};
export const tableHeader = {
  padding: '1.2rem 1.5rem',
  borderBottom: `1px solid ${C.border}`,
};
export const tableTitle = {
  margin: 0, fontSize: '1.1rem', fontWeight: 600, color: C.textPrimary,
};
export const table           = { width: '100%', borderCollapse: 'collapse' };
export const tableHeadRow    = { backgroundColor: C.bg };
export const tableHeadCell   = {
  padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.75rem',
  color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
};
export const tableBodyRow    = { borderTop: `1px solid ${C.border}` };
export const tableCell       = { padding: '1rem 1.5rem', fontSize: '0.9rem', color: C.textMuted };
export const tableCellId     = { ...tableCell, color: '#475569' };
export const tableCellTitle  = { ...tableCell, fontWeight: 500, color: C.textPrimary };
export const levelBadge = (nivel) => ({
  color: coloresNivel[nivel] || C.textMuted, fontWeight: 700, fontSize: '0.85rem',
});
export const statusBadge = (estado) => ({
  backgroundColor: (coloresEstado[estado] || coloresEstado.CERRADO).bg,
  color:           (coloresEstado[estado] || coloresEstado.CERRADO).text,
  padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
});