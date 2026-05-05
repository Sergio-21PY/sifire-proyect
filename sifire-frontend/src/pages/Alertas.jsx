import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as styles from '../styles/Alertas.styles';
import MapaSelector from '../components/reportes/MapaSelector';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_MS_ALERTAS_URL || 'http://localhost:8084') + '/api/alertas';

export default function Alertas() {
  const { usuario } = useAuth();
  const [alertas, setAlertas]   = useState([]);
  const [filtro, setFiltro]     = useState('TODOS');
  const [exito, setExito]       = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(true);
  const [form, setForm]         = useState({
    titulo: '', mensaje: '', tipo: '', descripcion: '',
    latitud: '', longitud: '', canal: 'EMAIL',
  });

  const esFuncionario = usuario?.tipo === 'FUNCIONARIO';
  const esAdmin       = usuario?.tipo === 'ADMINISTRADOR';

  useEffect(() => { cargarAlertas(); }, []);

  const cargarAlertas = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setAlertas(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('No se pudieron cargar las alertas.');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Cuando el funcionario hace clic en el mapa
  const handleMapaSeleccionar = (lat, lng) => {
    setForm(prev => ({ ...prev, latitud: lat, longitud: lng }));
  };

  const handleEmitir = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${BASE_URL}/crear`, form);
      setExito('✓ Alerta emitida correctamente');
      setForm({ titulo: '', mensaje: '', tipo: '', descripcion: '', latitud: '', longitud: '', canal: 'EMAIL' });
      setTimeout(() => setExito(''), 3000);
      cargarAlertas();
    } catch { setError('No se pudo emitir la alerta.'); }
  };

  const handleAsignarBrigadistas = async (id) => {
    setError('');
    try {
      await axios.post(`${BASE_URL}/${id}/asignar-brigadistas`);
      setExito('✓ Brigadistas asignados correctamente');
      setTimeout(() => setExito(''), 3000);
      cargarAlertas();
    } catch { setError('No se pudo asignar brigadistas.'); }
  };

  const estadoVisual = (estado) => {
    const mapa = { NUEVA: 'PENDIENTE', ASIGNADA: 'ENVIADA', ENVIADA: 'ENVIADA', PENDIENTE: 'PENDIENTE', FALLIDA: 'FALLIDA' };
    return mapa[estado] || 'PENDIENTE';
  };

  const alertasFiltradas = filtro === 'TODOS'
    ? alertas
    : alertas.filter(a => estadoVisual(a.estado) === filtro);

  return (
    <div style={styles.mainContainer}>

      <div style={styles.headerContainer}>
        <h1 style={styles.headerTitle}>Alertas a la Comunidad</h1>
        <p style={styles.headerSubtitle}>
          {esFuncionario
            ? 'Emite alertas oficiales hacia la comunidad ante incendios activos'
            : esAdmin
            ? 'Administración de alertas y asignación de brigadistas'
            : 'Alertas oficiales emitidas por funcionarios del sistema'}
        </p>
      </div>

      {exito && <div style={{ background:'#dcfce7', color:'#166534', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem', fontWeight:600 }}>{exito}</div>}
      {error && <div style={{ background:'#fee2e2', color:'#991b1b', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem' }}>{error}</div>}

      {/* Formulario — solo FUNCIONARIO */}
      {esFuncionario && (
        <form onSubmit={handleEmitir} style={{ background:'#fff', borderRadius:12, padding:'1.5rem', marginBottom:'2rem', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', border:'1px solid #e2e8f0' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1rem', color:'#1e293b' }}>📢 Emitir nueva alerta</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <input name="titulo"      placeholder="Título de la alerta *" value={form.titulo}      onChange={handleChange} required style={inputStyle} />
            <input name="tipo"        placeholder="Tipo (ej: EVACUACIÓN)"  value={form.tipo}        onChange={handleChange} style={inputStyle} />
            <input name="descripcion" placeholder="Descripción"            value={form.descripcion} onChange={handleChange} style={{ ...inputStyle, gridColumn:'1 / -1' }} />
            <input name="mensaje"     placeholder="Mensaje para la comunidad *" value={form.mensaje} onChange={handleChange} required style={{ ...inputStyle, gridColumn:'1 / -1' }} />

            {/* Coordenadas — solo lectura, se llenan desde el mapa */}
            <input name="latitud"  placeholder="Latitud (clic en el mapa ↓)"  value={form.latitud}  readOnly style={{ ...inputStyle, background:'#f8fafc', cursor:'not-allowed' }} />
            <input name="longitud" placeholder="Longitud (clic en el mapa ↓)" value={form.longitud} readOnly style={{ ...inputStyle, background:'#f8fafc', cursor:'not-allowed' }} />

            <select name="canal" value={form.canal} onChange={handleChange} style={inputStyle}>
              <option value="EMAIL">EMAIL</option>
              <option value="SMS">SMS</option>
              <option value="PUSH">PUSH</option>
            </select>
          </div>

          {/* Mapa selector */}
          <div style={{ marginTop:'1rem' }}>
            <label style={{ fontSize:'14px', fontWeight:'500', display:'block', marginBottom:'6px' }}>
              📍 Ubicación de la alerta — <span style={{ color:'#6b7280', fontWeight:400 }}>haz clic en el mapa para marcar</span>
            </label>
            <div style={{ height:'260px', borderRadius:'10px', overflow:'hidden', border:'1px solid #e5e7eb' }}>
              <MapaSelector
                centro={[-33.4969, -70.6168]}
                latitud={form.latitud}
                longitud={form.longitud}
                onSeleccionar={handleMapaSeleccionar}
              />
            </div>
            {form.latitud && form.longitud && (
              <p style={{ fontSize:'12px', color:'#6b7280', marginTop:'4px' }}>
                📌 Seleccionado: {form.latitud}, {form.longitud}
              </p>
            )}
          </div>

          <button type="submit" style={{ marginTop:'1rem', background:'#dc2626', color:'white', border:'none', borderRadius:8, padding:'0.6rem 1.5rem', fontWeight:700, cursor:'pointer', fontSize:'0.9rem' }}>
            🚨 Emitir Alerta
          </button>
        </form>
      )}

      <div style={styles.filterContainer}>
        {['TODOS', 'ENVIADA', 'PENDIENTE', 'FALLIDA'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={styles.filterButton(filtro === f)}>
            {f}
            {f !== 'TODOS' && (
              <span style={{ marginLeft:6, opacity:.7 }}>
                ({alertas.filter(a => estadoVisual(a.estado) === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {cargando ? (
        <p style={{ color:'#64748b', textAlign:'center', padding:'2rem' }}>Cargando alertas...</p>
      ) : alertasFiltradas.length === 0 ? (
        <p style={{ color:'#94a3b8', textAlign:'center', padding:'2rem' }}>No hay alertas para mostrar.</p>
      ) : (
        <div style={styles.alertsListContainer}>
          {alertasFiltradas.map(alerta => (
            <div key={alerta.id} style={styles.alertCard(estadoVisual(alerta.estado))}>
              <div style={{ flex: 1 }}>
                <strong style={styles.alertTitle}>
                  {alerta.titulo || alerta.tipo || `Alerta #${alerta.id}`}
                </strong>
                <p style={styles.alertMessage}>
                  {alerta.mensaje || alerta.descripcion || '—'}
                </p>
                <div style={styles.alertMetaContainer}>
                  <span>
                    🕐 {alerta.createdAt
                      ? new Date(alerta.createdAt).toLocaleString('es-CL')
                      : alerta.fechaHora
                      ? new Date(alerta.fechaHora).toLocaleString('es-CL')
                      : '—'}
                  </span>
                  {alerta.canal && <span>📡 {alerta.canal}</span>}
                  {alerta.latitud && <span>📍 {alerta.latitud}, {alerta.longitud}</span>}
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                <span style={styles.alertStatusBadge(estadoVisual(alerta.estado))}>
                  {alerta.estado}
                </span>
                {esAdmin && alerta.estado !== 'ASIGNADA' && (
                  <button onClick={() => handleAsignarBrigadistas(alerta.id)}
                    style={{ background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, padding:'4px 12px', fontSize:'0.8rem', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap' }}>
                    👥 Asignar Brigada
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '0.5rem 0.75rem', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '100%',
};
