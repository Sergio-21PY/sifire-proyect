import { C } from './theme';

export const page     = { minHeight: '100vh', backgroundColor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' };
export const box      = { width: '100%', maxWidth: '480px' };
export const header   = { textAlign: 'center', marginBottom: '2rem' };
export const title    = { fontSize: '1.6rem', fontWeight: 700, color: C.textPrimary, margin: '0 0 0.3rem' };
export const subtitle = { color: C.textMuted, fontSize: '0.85rem', margin: 0 };
export const card     = { backgroundColor: C.surface, borderRadius: '16px', padding: '2rem', boxShadow: C.shadow, border: `1px solid ${C.border}` };

export const formGrid     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
export const formGridFull = { gridColumn: '1 / -1' };

export const label      = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: C.textMuted, marginBottom: '0.4rem' };
export const labelOpt   = { fontWeight: 400, color: '#94a3b8', marginLeft: '0.3rem' };
export const input      = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: C.radiusSm, border: `1px solid ${C.border}`, backgroundColor: C.surface, color: C.textPrimary, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };
export const inputError = { borderColor: C.red };
export const error      = { color: C.red, fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' };
export const mb         = { marginBottom: '1rem' };

export const btn     = { width: '100%', padding: '0.75rem', borderRadius: C.radiusSm, border: 'none', backgroundColor: C.red, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' };
export const btnLoad = { opacity: 0.7, cursor: 'not-allowed' };

export const alertErr = { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.7rem 1rem', borderRadius: C.radiusSm, fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.2rem' };

export const footer = { textAlign: 'center', color: C.textMuted, fontSize: '0.85rem', marginTop: '1.5rem' };
export const link   = { color: C.red, textDecoration: 'none', fontWeight: 600 };