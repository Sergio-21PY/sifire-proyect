import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export default function Alertas() {
  const { usuario } = useAuth();
  const [alertas, setAlertas]     = useState([]);
  const [exito, setExito]         = useState('');
  const [error, setError]         = useState('');
  const [form, setForm]           = useState({
    titulo: '', mensaje: '', canal: 'EMAIL',
    tipo: '', descripcion: '', latitud: '', longitud: ''
  });

  const esFuncionario  = usuario?.tipo === 'FUNCIONARIO';
  const esAdmin        = usuario?.tipo === 'ADMINISTRADOR';

  useEffect(() => { cargarAlertas(); }, []);

  const cargarAlertas = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/bff/alertas`);
      setAlertas(res.data || []);
    } catch { setError('No se pudieron cargar las alertas'); }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEmitir = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/bff/alertas/crear`, form);
      setExito('✓ Alerta emitida correctamente');
      setForm({ titulo: '', mensaje: '', canal: 'EMAIL', tipo: '', descripcion: '', latitud: '', longitud: '' });
      setTimeout(() => setExito(''), 3000);
      cargarAlertas();
    } catch { setError('No se pudo emitir la alerta'); }
  };

  const handleAsignarBrigadistas = async (id) => {
    try {
      await axios.post(`${BASE_URL}/bff/alertas/${id}/asignar-brigadistas`);
      setExito('✓ Brigadistas asignados correctamente');
      setTimeout(() => setExito(''), 3000);
      cargarAlertas();
    } catch { setError('No se pudo asignar brigadistas'); }
  };

  const estadoColor = (estado) => ({
    NUEVA:    { background: '#e0f2fe', color: '#0369a1' },
    ASIGNADA: { background: '#dcfce7', color: '#166534' },
    PENDIENTE:{ background: '#fef3c7', color: '#92400e' },
    ENVIADA:  { background: '#f0fdf4', color: '#15803d' },
    FALLIDA:  { background: '#fee2e2', color: '#991b1b' },
  }[estado] || { background: '#f1f5f9', color: '#475569' });

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        Gestión de Alertas
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        {esAdmin ? 'Administración y asignación de brigadas' : 'Emisión y seguimiento de alertas'}
      </p>

      {exito && <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' }}>{exito}</div>}
      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}

      {/* Formulario solo para FUNCIONARIO */}
      {esFuncionario && (
        <form onSubmit={handleEmitir} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Emitir nueva alerta</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <input name="titulo"      placeholder="Título"      value={form.titulo}      onChange={handleChange} required style={input} />
            <input name="tipo"        placeholder="Tipo"        value={form.tipo}        onChange={handleChange} style={input} />
            <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} style={{ ...input, gridColumn: '1 / -1' }} />
            <input name="mensaje"     placeholder="Mensaje"     value={form.mensaje}     onChange={handleChange} required style={{ ...input, gridColumn: '1 / -1' }} />
            <input name="latitud"     placeholder="Latitud"     value={form.latitud}     onChange={handleChange} style={input} />
            <input name="longitud"    placeholder="Longitud"    value={form.longitud}    onChange={handleChange} style={input} />
            <select name="canal" value={form.canal} onChange={handleChange} style={input}>
              <option value="EMAIL">EMAIL</option>
              <option value="SMS">SMS</option>
              <option value="PUSH">PUSH</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>
            Emitir Alerta
          </button>
        </form>
      )}

      {/* Tabla de alertas */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['#', 'Título', 'Tipo', 'Canal', 'Estado', 'Fecha', ...(esAdmin ? ['Acción'] : [])].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alertas.length === 0 ? (
              <tr><td colSpan={esAdmin ? 7 : 6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No hay alertas registradas</td></tr>
            ) : alertas.map((a, i) => (
              <tr key={a.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={cell}>#{a.id}</td>
                <td style={cell}>{a.titulo || a.tipo || '—'}</td>
                <td style={cell}>{a.tipo || '—'}</td>
                <td style={cell}>{a.canal || '—'}</td>
                <td style={cell}>
                  <span style={{ ...estadoColor(a.estado), padding: '2px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600 }}>
                    {a.estado}
                  </span>
                </td>
                <td style={cell}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : a.fechaHora ? new Date(a.fechaHora).toLocaleDateString() : '—'}</td>
                {esAdmin && (
                  <td style={cell}>
                    {a.estado !== 'ASIGNADA' && (
                      <button onClick={() => handleAsignarBrigadistas(a.id)}
                        style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                        Asignar Brigada
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const input = {
  padding: '0.5rem 0.75rem', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '100%'
};
const cell = { padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#334155' };