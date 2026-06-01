import L from 'leaflet';

export const coloresPorNivel = { alto: '#ef4444', medio: '#f97316', bajo: '#eab308', resuelto: '#22c55e' };
export const coloresZona = {
  ALTO:    { color: '#ef4444', fill: '#ef4444' },
  MEDIO:   { color: '#f97316', fill: '#f97316' },
  BAJO:    { color: '#eab308', fill: '#eab308' },
  CRITICO: { color: '#7f1d1d', fill: '#7f1d1d' },
  RESUELTO:{ color: '#22c55e', fill: '#22c55e' }
};

// Icono fuego coloreado por nivel
export const iconoFoco = (nivel, estado) => {
  const esResuelto = estado === 'RESUELTO' || estado === 'DESCARTADO';
  const nivelNorm = String(nivel || '').toLowerCase();
  const color = esResuelto
    ? coloresPorNivel.resuelto
    : coloresPorNivel[nivelNorm] || coloresPorNivel.medio;
  const emoji = esResuelto ? '✅' : '🔥';
  return L.divIcon({
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px ${color}bb,0 0 0 4px ${color}33;border:2px solid rgba(255,255,255,0.85);font-size:15px;line-height:1;">${emoji}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Icono brigada con fondo azul
export const iconoBrigada = L.divIcon({
  html: '<div style="width:34px;height:34px;border-radius:50%;background:#1d4ed8;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(29,78,216,0.6),0 0 0 4px rgba(59,130,246,0.25);border:2px solid rgba(255,255,255,0.85);font-size:16px;line-height:1;">🚒</div>',
  className: '',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

export const mainContainer = { position: 'relative', height: '100vh', width: '100%' };
export const map = { height: '100%', width: '100%' };

// Leyenda dark glassmorphism
export const leyendaContainer = {
  position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000,
  background: 'rgba(10,15,30,0.88)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '14px',
  padding: '0.9rem 1.2rem',
  boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
  fontSize: '0.78rem', minWidth: '170px',
  border: '1px solid rgba(255,255,255,0.09)',
};
export const leyendaTitle = {
  fontWeight: 700, color: '#f1f5f9',
  margin: '0 0 0.6rem', fontSize: '0.82rem', letterSpacing: '0.01em',
};
export const leyendaItem = { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' };
export const leyendaColorBox = (color) => ({
  width: 12, height: 12, borderRadius: '50%',
  backgroundColor: color, display: 'inline-block',
  boxShadow: `0 0 6px ${color}99`, flexShrink: 0,
});
export const leyendaLabel = { color: '#94a3b8' };
export const leyendaRuta = {
  width: 20, height: 3,
  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
  display: 'inline-block', borderRadius: 2, flexShrink: 0,
};

export const zonaPathOptions = (nivel) => ({
  color: coloresZona[nivel]?.color ?? '#94a3b8',
  fillColor: coloresZona[nivel]?.fill ?? '#94a3b8',
  fillOpacity: 0.15, weight: 2,
});

export const rutaPathOptions = {
  color: '#3b82f6', weight: 4, dashArray: '10 5', lineCap: 'round',
};

// Círculo con clase CSS para animación de pulso
export const focoCirclePathOptions = (nivel, estado) => {
  const esResuelto = estado === 'RESUELTO' || estado === 'DESCARTADO';
  const nivelNorm = String(nivel || '').toLowerCase();
  const color = esResuelto
    ? coloresPorNivel.resuelto
    : coloresPorNivel[nivelNorm] || coloresPorNivel.medio;
  return {
    color, fillColor: color, fillOpacity: 0.18, weight: 2,
    className: esResuelto ? 'foco-resuelto' : 'foco-activo',
  };
};

// Badges para el modal
export const badgeNivel = (nivel, estado) => {
  const esResuelto = estado === 'RESUELTO' || estado === 'DESCARTADO';
  const nivelNorm = String(nivel || '').toLowerCase();
  const color = esResuelto
    ? coloresPorNivel.resuelto
    : coloresPorNivel[nivelNorm] || coloresPorNivel.medio;
  return {
    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
    background: `${color}22`, color, border: `1px solid ${color}66`,
    fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase',
  };
};

export const badgeEstado = (estado) => {
  const palette = {
    ACTIVO:     { bg: '#ef444422', color: '#f87171', border: '#ef444466' },
    RESUELTO:   { bg: '#22c55e22', color: '#4ade80', border: '#22c55e66' },
    DESCARTADO: { bg: '#94a3b822', color: '#94a3b8', border: '#94a3b866' },
    PENDIENTE:  { bg: '#f9731622', color: '#fb923c', border: '#f9731666' },
  };
  const p = palette[estado] || palette.PENDIENTE;
  return {
    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
    background: p.bg, color: p.color, border: `1px solid ${p.border}`,
    fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase',
  };
};