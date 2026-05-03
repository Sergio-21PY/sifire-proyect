import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGestionBrigadistas } from '../hooks/useGestionBrigadistas';
import { useBrigadas } from '../hooks/useBrigadas';
import BrigadistaForm from '../components/brigadistas/BrigadistaForm';
import BrigadistasTabla from '../components/brigadistas/BrigadistasTabla';
import MapaSelector from '../components/reportes/MapaSelector';
import * as styles from '../styles/GestionBrigadistas.styles';

export default function GestionBrigadistas() {
  const { usuario } = useAuth();
  const [tab, setTab] = useState('brigadistas');

  const brig  = useGestionBrigadistas();
  const brig2 = useBrigadas();

  const tabStyle = (activa) => ({
    padding: '8px 20px', border: 'none', cursor: 'pointer', borderRadius: '6px',
    background: tab === activa ? '#1d4ed8' : '#e5e7eb',
    color: tab === activa ? '#fff' : '#111',
    fontWeight: tab === activa ? '600' : '400',
  });

  // Handler para cuando el funcionario hace clic en el mapa
  const handleMapaSeleccionar = (lat, lng) => {
    brig2.handleChange({ target: { name: 'latitud',  value: lat } });
    brig2.handleChange({ target: { name: 'longitud', value: lng } });
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.headerTitle}>Gestión de Brigadistas</h1>
          <p style={styles.headerSubtitle}>
            Registrado como: {usuario?.nombre} — {usuario?.tipo}
          </p>
        </div>
        <button
          onClick={() => tab === 'brigadistas'
            ? brig.setShowForm(!brig.showForm)
            : brig2.setShowForm(!brig2.showForm)}
          style={styles.headerButton}
        >
          {tab === 'brigadistas'
            ? (brig.showForm  ? 'Cancelar' : '+ Nuevo Brigadista')
            : (brig2.showForm ? 'Cancelar' : '+ Nueva Brigada')}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button style={tabStyle('brigadistas')} onClick={() => setTab('brigadistas')}>Brigadistas</button>
        <button style={tabStyle('brigadas')}    onClick={() => setTab('brigadas')}>Brigadas</button>
      </div>

      {/* ── Tab Brigadistas ── */}
      {tab === 'brigadistas' && (
        <>
          {brig.exito && <div style={styles.successAlert}>Brigadista registrado correctamente.</div>}
          {brig.showForm && (
            <BrigadistaForm
              form={brig.form} errors={brig.errors} loading={brig.loading}
              onChange={brig.handleChange} onSubmit={brig.handleSubmit}
              onCancelar={() => {
                brig.setShowForm(false);
                brig.setForm({ nombre: '', email: '', telefono: '', password: '' });
                brig.setErrors({});
              }}
            />
          )}
          <BrigadistasTabla
            brigadistas={brig.brigadistas}
            loadingData={brig.loadingData}
            onToggleEstado={brig.toggleEstado}
          />
        </>
      )}

      {/* ── Tab Brigadas ── */}
      {tab === 'brigadas' && (
        <>
          {brig2.exito && <div style={styles.successAlert}>Brigada creada correctamente.</div>}
          {brig2.errors.form && (
            <div style={{ ...styles.successAlert, background: '#fee2e2', color: '#991b1b' }}>
              {brig2.errors.form}
            </div>
          )}

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
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Estado</label>
                    <select name="estado" value={brig2.form.estado} onChange={brig2.handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}>
                      <option value="DISPONIBLE">DISPONIBLE</option>
                      <option value="EN_CAMINO">EN_CAMINO</option>
                      <option value="INTERVINIENDO">INTERVINIENDO</option>
                      <option value="INACTIVA">INACTIVA</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Tipo</label>
                    <select name="tipo" value={brig2.form.tipo} onChange={brig2.handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}>
                      <option value="FORESTAL">FORESTAL</option>
                      <option value="URBANA">URBANA</option>
                      <option value="MIXTA">MIXTA</option>
                    </select>
                  </div>

                  {/* Coordenadas — se pueden editar manualmente o seleccionar del mapa */}
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Latitud</label>
                    <input name="latitud" type="number" step="any" value={brig2.form.latitud}
                      onChange={brig2.handleChange} placeholder="Haz click en el mapa →"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Longitud</label>
                    <input name="longitud" type="number" step="any" value={brig2.form.longitud}
                      onChange={brig2.handleChange} placeholder="Haz click en el mapa →"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }} />
                  </div>
                </div>

                {/* Mapa para seleccionar ubicación de la brigada */}
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                    📍 Ubicación de la brigada — <span style={{ color: '#6b7280', fontWeight: 400 }}>haz clic en el mapa para marcar</span>
                  </label>
                  <div style={{ height: '260px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <MapaSelector
                      centro={[-33.4969, -70.6168]}
                      latitud={brig2.form.latitud}
                      longitud={brig2.form.longitud}
                      onSeleccionar={handleMapaSeleccionar}
                    />
                  </div>
                  {brig2.form.latitud && brig2.form.longitud && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      📌 Seleccionado: {brig2.form.latitud}, {brig2.form.longitud}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button"
                    onClick={() => {
                      brig2.setShowForm(false);
                      brig2.setForm({ nombre: '', estado: 'DISPONIBLE', tipo: 'FORESTAL', latitud: '', longitud: '' });
                      brig2.setErrors({});
                    }}
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
                  {['ID', 'Nombre', 'Tipo', 'Estado', 'Latitud', 'Longitud'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brig2.brigadas.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                      Sin brigadas registradas
                    </td>
                  </tr>
                ) : brig2.brigadas.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px 12px', fontSize: '14px' }}>#{b.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: '14px', fontWeight: '500' }}>{b.nombre}</td>
                    <td style={{ padding: '10px 12px', fontSize: '14px' }}>{b.tipo ?? '—'}</td>
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