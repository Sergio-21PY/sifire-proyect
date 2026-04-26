import { C } from './theme';

export const mainContainer   = { minHeight: '100vh', backgroundColor: C.bg, padding: '2rem' };
export const headerContainer = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' };
export const headerTitle     = { fontSize: '1.8rem', fontWeight: 700, color: C.textPrimary, margin: 0 };
export const headerSubtitle  = { color: C.textMuted, margin: '0.3rem 0 0' };
export const headerButton    = { backgroundColor: C.red, color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: 'pointer' };

export const successAlert = { backgroundColor: '#dcfce7', color: '#166534', padding: '0.8rem 1.2rem', borderRadius: C.radiusSm, marginBottom: '1rem', fontWeight: 500 };

export const formContainer = { backgroundColor: C.surface, borderRadius: C.radius, padding: '1.5rem', boxShadow: C.shadow, marginBottom: '1.5rem', border: `1px solid ${C.border}` };
export const formTitle     = { fontSize: '1.1rem', fontWeight: 600, color: C.textPrimary, marginTop: 0 };
export const formGrid      = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
export const formActions   = { marginTop: '1.2rem', display: 'flex', gap: '0.8rem' };

export const inputStyle  = (hasError) => ({ width: '100%', padding: '0.6rem 0.8rem', borderRadius: C.radiusSm, boxSizing: 'border-box', border: `1px solid ${hasError ? C.red : C.border}`, backgroundColor: C.surface, color: C.textPrimary, fontSize: '0.95rem', outline: 'none' });
export const labelStyle  = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: C.textMuted, marginBottom: '0.4rem' };
export const errorStyle  = { color: C.red, fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' };

export const submitButton = (loading) => ({ backgroundColor: loading ? '#fca5a5' : C.red, color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 });
export const cancelButton = { backgroundColor: C.surfaceAlt, color: C.textMuted, border: `1px solid ${C.border}`, padding: '0.7rem 1.5rem', borderRadius: C.radiusSm, fontWeight: 600, cursor: 'pointer' };

export const tableWrapper    = { backgroundColor: C.surface, borderRadius: C.radius, boxShadow: C.shadowSm, overflow: 'hidden', border: `1px solid ${C.border}` };
export const tableHeader     = { padding: '1rem 1.5rem', borderBottom: `1px solid ${C.border}` };
export const tableHeaderText = { margin: 0, fontSize: '0.85rem', color: C.textMuted };
export const loadingText     = { padding: '2rem', textAlign: 'center', color: C.textMuted };
export const table           = { width: '100%', borderCollapse: 'collapse' };
export const tableHeadRow    = { backgroundColor: C.bg };
export const tableHeadCell   = { padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' };
export const tableBodyRow    = { borderTop: `1px solid ${C.border}` };
export const tableCell       = { padding: '1rem 1.5rem', color: C.textMuted, fontSize: '0.85rem' };
export const tableCellId     = { ...tableCell, color: '#94a3b8' };
export const tableCellName   = { ...tableCell, fontWeight: 500, color: C.textPrimary };

export const asignacionesBadge = (n) => ({ backgroundColor: n > 0 ? '#dbeafe' : C.surfaceAlt, color: n > 0 ? '#1e40af' : C.textMuted, padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 });
export const estadoBadge       = (estado) => ({ backgroundColor: estado === 'ACTIVO' ? '#dcfce7' : '#fee2e2', color: estado === 'ACTIVO' ? '#166534' : '#991b1b', padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 });
export const actionButton      = { backgroundColor: C.surfaceAlt, color: C.textMuted, border: `1px solid ${C.border}`, padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };