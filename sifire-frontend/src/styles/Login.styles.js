import { C } from './theme';

export const flameStyles = `
  @keyframes flicker {
    0%   { transform: scaleY(1)    scaleX(1)    rotate(-2deg); opacity: 1;    }
    25%  { transform: scaleY(1.08) scaleX(0.95) rotate(2deg);  opacity: 0.95; }
    50%  { transform: scaleY(0.95) scaleX(1.05) rotate(-1deg); opacity: 1;    }
    75%  { transform: scaleY(1.05) scaleX(0.97) rotate(3deg);  opacity: 0.9;  }
    100% { transform: scaleY(1)    scaleX(1)    rotate(-2deg); opacity: 1;    }
  }
  @keyframes flicker2 {
    0%   { transform: scaleY(1)    scaleX(1)    rotate(2deg);  opacity: 0.8; }
    33%  { transform: scaleY(1.1)  scaleX(0.92) rotate(-3deg); opacity: 0.6; }
    66%  { transform: scaleY(0.92) scaleX(1.08) rotate(2deg);  opacity: 0.7; }
    100% { transform: scaleY(1)    scaleX(1)    rotate(2deg);  opacity: 0.8; }
  }
  @keyframes flicker3 {
    0%   { transform: scaleY(1)    scaleX(1)    rotate(-1deg); opacity: 0.5; }
    50%  { transform: scaleY(1.15) scaleX(0.9)  rotate(2deg);  opacity: 0.3; }
    100% { transform: scaleY(1)    scaleX(1)    rotate(-1deg); opacity: 0.5; }
  }
  .flame-wrap {
    position: relative;
    width: 60px;
    height: 72px;
    margin: 0 auto 0.5rem;
    filter: drop-shadow(0 0 18px #f97316) drop-shadow(0 0 8px #ef4444);
  }
  .flame {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform-origin: bottom center;
    border-radius: 50% 50% 30% 30% / 60% 60% 40% 40%;
  }
  .flame-outer {
    width: 40px; height: 60px;
    margin-left: -20px;
    background: linear-gradient(to top, #ef4444, #f97316, #fbbf24);
    animation: flicker 1.4s ease-in-out infinite;
  }
  .flame-mid {
    width: 26px; height: 44px;
    margin-left: -13px;
    background: linear-gradient(to top, #f97316, #fbbf24, #fef08a);
    animation: flicker2 1.1s ease-in-out infinite;
  }
  .flame-inner {
    width: 14px; height: 28px;
    margin-left: -7px;
    background: linear-gradient(to top, #fef08a, #fff);
    animation: flicker3 0.9s ease-in-out infinite;
  }
`;

export const page = { minHeight: '100vh', backgroundColor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' };
export const box = { width: '100%', maxWidth: '400px' };
export const header = { textAlign: 'center', marginBottom: '2rem' };
export const title = { fontSize: '1.6rem', fontWeight: 700, color: C.textPrimary, margin: '0 0 0.3rem' };
export const subtitle = { color: C.textMuted, fontSize: '0.85rem', margin: 0 };
export const card = { backgroundColor: C.surface, borderRadius: '16px', padding: '2rem', boxShadow: C.shadow, border: `1px solid ${C.border}` };

export const label = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: C.textMuted, marginBottom: '0.4rem' };
export const input = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: C.radiusSm, border: `1px solid ${C.border}`, backgroundColor: C.bg, color: C.textPrimary, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };
export const inputError = { borderColor: C.red };
export const error = { color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' };
export const mb = { marginBottom: '1.2rem' };

export const btn = { width: '100%', padding: '0.75rem', borderRadius: C.radiusSm, border: 'none', backgroundColor: C.red, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' };
export const btnLoad = { opacity: 0.7, cursor: 'not-allowed' };

export const alertOk = { backgroundColor: '#052e16', color: '#4ade80', padding: '0.7rem 1rem', borderRadius: C.radiusSm, fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' };
export const alertErr = { backgroundColor: '#450a0a', color: '#f87171', padding: '0.7rem 1rem', borderRadius: C.radiusSm, fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' };

export const footer = { textAlign: 'center', color: C.textMuted, fontSize: '0.85rem', marginTop: '1.5rem' };
export const link = { color: C.red, textDecoration: 'none', fontWeight: 600 };