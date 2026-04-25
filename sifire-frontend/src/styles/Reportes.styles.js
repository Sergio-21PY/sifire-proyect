import { C } from './theme';

export const coloresEstado = {
  PENDIENTE:  { bg: '#422006', text: '#fb923c' },
  EN_CURSO:   { bg: '#450a0a', text: '#f87171' },
  CONTROLADO: { bg: '#052e16', text: '#4ade80' },
  CERRADO:    { bg: '#1e293b', text: '#94a3b8' },
};
export const coloresNivel = { ALTO: C.red, MEDIO: C.orange, BAJO: C.yellow, CRITICO: '#7f1d1d' };

export const mainContainer  = { minHeight: '100vh', backgroundColor: C.bg, padding: '2rem' };

export const headerContainer = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem',
};
export const headerTitle    = { fontSize: '1.8rem', fontWeight: 700, color: C.textPrimary, margin: 0 };
export const headerSubtitle = { color: C.textMuted, margin: '0.3rem 0 0' };
export const headerButton   = {
  backgroundColor: C.red, color: '#fff', border: 'none',
  padding: '0.7rem 1.4rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: 'pointer',
};

export const successAlert = {
  backgroundColor: '#052e16', color: '#4ade80',
  padding: '0.8rem 1.2rem', borderRadius: C.radiusSm, marginBottom: '1rem', fontWeight: 500,
};
export const infoAlert = {
  backgroundColor: '#1e3a5f', color: '#93c5fd',
  padding: '0.8rem 1.2rem', borderRadius: C.radiusSm, marginBottom: '1rem', fontWeight: 500,
};

export const formContainer = {
  backgroundColor: C.surface, borderRadius: C.radius,
  padding: '1.5rem', boxShadow: C.shadow, marginBottom: '1.5rem',
  border: `1px solid ${C.border}`,
};
export const formTitle   = { fontSize: '1.1rem', fontWeight: 600, color: C.textPrimary, marginTop: 0 };
export const formGrid    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
export const formGridFull = { gridColumn: '1 / -1' };
export const formActions = { marginTop: '1.2rem', display: 'flex', gap: '0.8rem' };

export const submitButton = {
  backgroundColor: C.red, color: '#fff', border: 'none',
  padding: '0.7rem 1.5rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: 'pointer',
};
export const cancelButton = {
  backgroundColor: C.surfaceAlt, color: C.textMuted, border: `1px solid ${C.border}`,
  padding: '0.7rem 1.5rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: 'pointer',
};

export const input = {
  width: '100%', padding: '0.6rem 0.8rem', borderRadius: C.radiusSm,
  border: `1px solid ${C.border}`, fontSize: '0.95rem', boxSizing: 'border-box',
  backgroundColor: C.bg, color: C.textPrimary, outline: 'none',
};
export const label     = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: C.textMuted, marginBottom: '0.4rem' };
export const labelSpan = { fontWeight: 400, color: '#475569', marginLeft: '0.4rem' };
export const locationText = { fontSize: '0.8rem', color: C.textMuted, marginTop: '0.4rem' };

export const mapContainer = { borderRadius: C.radiusSm, overflow: 'hidden', border: `1px solid ${C.border}`, height: '480px' };
export const map          = { height: '100%', width: '100%' };

export const dropzone = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  border: `2px dashed ${C.border}`, borderRadius: C.radiusSm, padding: '1.5rem',
  cursor: 'pointer', backgroundColor: C.bg, color: C.textMuted, fontSize: '0.9rem', gap: '0.4rem',
};
export const dropzoneIcon = { fontSize: '1.8rem' };
export const dropzoneHint = { fontSize: '0.75rem', color: '#475569' };

export const filePreviewContainer = { marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' };
export const filePreviewItem = {
  display: 'flex', alignItems: 'center', gap: '0.4rem',
  backgroundColor: C.surfaceAlt, borderRadius: '6px',
  padding: '0.3rem 0.7rem', fontSize: '0.8rem', color: C.textMuted,
};
export const filePreviewName   = { maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
export const fileDeleteButton  = { background: 'none', border: 'none', cursor: 'pointer', color: C.red, fontWeight: 700, fontSize: '0.9rem', padding: 0 };

export const tableWrapper  = { backgroundColor: C.surface, borderRadius: C.radius, boxShadow: C.shadowSm, overflow: 'hidden', border: `1px solid ${C.border}` };
export const table         = { width: '100%', borderCollapse: 'collapse' };
export const tableHeadRow  = { backgroundColor: C.bg };
export const tableHeadCell = {
  padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.75rem',
  color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
};
export const tableBodyRow         = { borderTop: `1px solid ${C.border}` };
export const tableCell            = { padding: '1rem 1.5rem', color: C.textMuted, fontSize: '0.85rem' };
export const tableCellId          = { ...tableCell, color: '#475569' };
export const tableCellTitle       = { ...tableCell, fontWeight: 500, color: C.textPrimary };
export const tableCellDescription = { ...tableCell, maxWidth: '200px' };

export const levelBadge  = (nivel) => ({ color: coloresNivel[nivel] ?? C.textMuted, fontWeight: 700, fontSize: '0.85rem' });
export const statusBadge = (estado) => ({
  backgroundColor: (coloresEstado[estado] ?? coloresEstado.CERRADO).bg,
  color:           (coloresEstado[estado] ?? coloresEstado.CERRADO).text,
  padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
});
export const assignButton = {
  backgroundColor: C.blue, color: '#fff', border: 'none',
  padding: '0.35rem 0.9rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
};

export const modalOverlay = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
export const modalContent = {
  backgroundColor: C.surface, borderRadius: C.radius, padding: '2rem',
  width: '400px', boxShadow: C.shadow, border: `1px solid ${C.border}`,
};
export const modalTitle         = { margin: '0 0 0.3rem', fontSize: '1.1rem', fontWeight: 700, color: C.textPrimary };
export const modalSubtitle      = { color: C.textMuted, fontSize: '0.9rem', marginBottom: '1.2rem' };
export const modalFormActions   = { display: 'flex', gap: '0.8rem' };
export const modalConfirmButton = {
  backgroundColor: C.blue, color: '#fff', border: 'none',
  padding: '0.7rem 1.5rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: 'pointer', flex: 1,
};
export const modalCancelButton = {
  backgroundColor: C.surfaceAlt, color: C.textMuted, border: `1px solid ${C.border}`,
  padding: '0.7rem 1.5rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: 'pointer', flex: 1,
};