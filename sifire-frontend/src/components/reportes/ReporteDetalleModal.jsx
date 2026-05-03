const BASE_URL = 'http://localhost:8082/';

export default function ReporteDetalleModal({ reporte, onCerrar }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onCerrar} style={closeBtn}>✕</button>

        <h2 style={{ marginBottom: '0.5rem' }}>{reporte.titulo}</h2>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>{reporte.descripcion}</p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={badge('#dcfce7', '#166534')}>📍 {reporte.origen}</span>
          <span style={badge('#fef3c7', '#92400e')}>⚠ {reporte.nivel}</span>
          <span style={badge('#e0f2fe', '#0369a1')}>{reporte.estado}</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          🕐 {reporte.fecha} &nbsp;|&nbsp; Lat: {reporte.latitud} Lng: {reporte.longitud}
        </p>

        {reporte.multimedia?.length > 0 ? (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>📷 Evidencia fotográfica</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {reporte.multimedia.map((m, i) => (
                <img
                  key={i}
                  src={BASE_URL + m.urlArchivo}
                  alt={`evidencia-${i + 1}`}
                  style={{
                    width: 150, height: 110,
                    objectFit: 'cover',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                  onClick={() => window.open(BASE_URL + m.urlArchivo, '_blank')}
                />
              ))}
            </div>
          </div>
        ) : (
          <p style={{ marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            Sin evidencia fotográfica adjunta.
          </p>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.55)',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 1000,
};
const modal = {
  background: 'white', borderRadius: 16,
  padding: '2rem', width: '90%', maxWidth: 560,
  position: 'relative', maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
};
const closeBtn = {
  position: 'absolute', top: 12, right: 16,
  background: 'none', border: 'none',
  fontSize: '1.2rem', cursor: 'pointer', color: '#64748b',
};
const badge = (bg, color) => ({
  background: bg, color,
  padding: '2px 10px', borderRadius: 999,
  fontSize: '0.8rem', fontWeight: 600,
});