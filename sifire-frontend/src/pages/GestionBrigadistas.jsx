import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGestionBrigadistas } from '../hooks/useGestionBrigadistas';
import { useBrigadas } from '../hooks/useBrigadas';
import BrigadistaForm from '../components/brigadistas/BrigadistaForm';
import BrigadistasTabla from '../components/brigadistas/BrigadistasTabla';
import * as styles from '../styles/GestionBrigadistas.styles';

export default function GestionBrigadistas() {
  const { usuario } = useAuth();
  const [tab, setTab] = useState('brigadistas');

  const brig = useGestionBrigadistas();
  const brig2 = useBrigadas();

  const tabStyle = (activa) => ({
    padding: '8px 20px', border: 'none', cursor: 'pointer', borderRadius: '6px',
    background: tab === activa ? '#1d4ed8' : '#e5e7eb',
    color: tab === activa ? '#fff' : '#111',
    fontWeight: tab === activa ? '600' : '400',
  });

  return (
    <div style={styles.mainContainer}>
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.headerTitle}>Gestión de Brigadistas</h1>
          <p style={styles.headerSubtitle}>Registrado como: {usuario?.nombre} — {usuario?.rol}</p>
        </div>
        <button
          onClick={() => tab === 'brigadistas' ? brig.setShowForm(!brig.showForm) : brig2.setShowForm(!brig2.showForm)}
          style={styles.headerButton}
        >
          {tab === 'brigadistas'
            ? (brig.showForm ? 'Cancelar' : '+ Nuevo Brigadista')
            : (brig2.showForm ? 'Cancelar' : '+ Nueva Brigada')}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button style={tabStyle('brigadistas')} onClick={() => setTab('brigadistas')}>Brigadistas</button>
        <button style={tabStyle('brigadas')} onClick={() => setTab('brigadas')}>Brigadas</button>
      </div>

      {/* Tab Brigadistas */}
      {tab === 'brigadistas' && (
        <>
          {brig.exito && <div style={styles.successAlert}>Brigadista registrado correctamente.</div>}
          {brig.showForm && (
            <BrigadistaForm
              form={brig.form} errors={brig.errors} loading={brig.loading}
              onChange={brig.handleChange} onSubmit={brig.handleSubmit}
              onCancelar={() => { brig.setShowForm(false); brig.setForm({ nombre: '', email: '', telefono: '', password: '' }); brig.setErrors({}); }}
            />
          )}
          <BrigadistasTabla brigadistas={brig.brigadistas} loadingData={brig.loadingData} onToggleEstado={brig.toggleEstado} />
        </>
      )}

      {/* Tab Brigadas */}
      {tab === 'brigadas' && (
        <>
          {brig2.exito && <div style={styles.successAlert}>Brigada creada correctamente.</div>}
          {brig2.errors.form && <div style={{ ...styles.successAlert, background: '#fee2e2', color: '#991b1b' }}>{brig2.errors.form}</div>}

          {brig2.showForm && (
            <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <form onSubmit={brig2.handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Nombre</label>
                    <input name="nombre" value={brig2.form.nombre} onChange={brig2.handleChange} required
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${brig2.errors.nombre ? '#ef4444' : '#ccc'}`, marginTop: '4px' }} />
                    {brig2.errors.nombre && <span style={{ color: '#ef4444', fontSize: '12px' }}>{brig2.errors.nombre}</span>}
                  </div>
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="EN_CAMINO">EN_CAMINO</option>
                  <option value="INTERVINIENDO">INTERVINIENDO</option>
                  <option value="INACTIVA">INACTIVA</option>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Tipo</label>
                    <select name="tipo" value={brig2.form.tipo} onChange={brig2.handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}>
                      <option value="FORESTAL">FORESTAL</option>
                      <option value="URBANA">URBANA</option>
                      <option value="MIXTA">MIXTA</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Latitud</label>
                    <input name="latitud" type="number" step="any" value={brig2.form.latitud} onChange={brig2.handleChange}
                      placeholder="-33.45"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Longitud</label>
                    <input name="longitud" type="number" step="any" value={brig2.form.longitud} onChange={brig2.handleChange}
                      placeholder="-70.65"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => { brig2.setShowForm(false); brig2.setForm({ nombre: '', estado: 'DISPONIBLE', latitud: '', longitud: '' }); brig2.setErrors({}); }}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', background: '#fff' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={brig2.loading}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#1d4ed8', color: '#fff' }}>
                    {brig2.loading ? 'Guardando...' : 'Crear Brigada'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabla brigadas */}
          {brig2.loadingData ? <p>Cargando...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  {['ID', 'Nombre', 'Estado', 'Latitud', 'Longitud'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brig2.brigadas.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>Sin brigadas registradas</td></tr>
                ) : brig2.brigadas.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px 12px', fontSize: '14px' }}>#{b.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: '14px', fontWeight: '500' }}>{b.nombre}</td>
                    <td style={{ padding: '10px 12px', fontSize: '14px' }}>{b.estado}</td>
                    <td style={{ padding: '10px 12px', fontSize: '14px' }}>{b.latitud ?? '—'}</td>
                    <td style={{ padding: '10px 12px', fontSize: '14px' }}>{b.longitud ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}