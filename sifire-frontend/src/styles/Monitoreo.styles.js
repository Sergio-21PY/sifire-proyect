import L from 'leaflet';

// --- Colores y Constantes ---
export const coloresPorNivel = { alto: '#ef4444', medio: '#f97316', bajo: '#eab308', resuelto: '#22c55e' };
export const coloresZona = {
  ALTO:   { color: '#ef4444', fill: '#ef4444' },
  MEDIO:  { color: '#f97316', fill: '#f97316' },
  BAJO:   { color: '#eab308', fill: '#eab308' },
  CRITICO:{ color: '#7f1d1d', fill: '#7f1d1d' },
};

// --- Iconos ---
export const iconoBrigada = L.divIcon({
  html: '🚒',
  className: '', // Usar className vacío para evitar estilos por defecto de Leaflet
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// --- Estilos de Componentes ---
export const mainContainer = {
  position: 'relative',
  height: '100vh',
  width: '100%'
};

export const map = {
  height: '100%',
  width: '100%'
};

// --- Leyenda ---
export const leyendaContainer = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  zIndex: 1000,
  backgroundColor: 'rgba(255,255,255,0.95)',
  borderRadius: '10px',
  padding: '0.8rem 1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontSize: '0.78rem',
  minWidth: '160px'
};
export const leyendaTitle = {
  fontWeight: 700,
  color: '#1e293b',
  margin: '0 0 0.5rem'
};
export const leyendaItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  marginBottom: '0.3rem'
};
export const leyendaColorBox = (color) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  display: 'inline-block'
});
export const leyendaLabel = {
  color: '#475569'
};
export const leyendaRuta = {
  width: 20,
  height: 3,
  backgroundColor: '#3b82f6',
  display: 'inline-block',
  borderRadius: 2
};

// --- Estilos para Elementos del Mapa ---
export const zonaPathOptions = (nivel) => ({
  color: coloresZona[nivel].color,
  fillColor: coloresZona[nivel].fill,
  fillOpacity: 0.15,
  weight: 2,
});

export const rutaPathOptions = {
  color: '#3b82f6',
  weight: 4,
  dashArray: '8 4'
};

export const focoCirclePathOptions = (nivel) => {
  const nivelNormalizado = String(nivel || '').toLowerCase();
  const color = coloresPorNivel[nivelNormalizado] || coloresPorNivel.medio;

  return {
    color,
    fillColor: color,
    fillOpacity: 0.25,
  };
};
