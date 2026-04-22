import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useAuth } from '../context/AuthContext';
import * as styles from '../styles/Reportes.styles';

const iconDefault = L.icon({ iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41] });

const reportesMock = [
  { id: 1, titulo: 'Incendio Sector Carén',    nivel: 'ALTO',  estado: 'EN_CURSO',  fecha: '15-04-2026', origen: 'FUNCIONARIO', descripcion: 'Incendio activo en el sector Carén, con humo visible desde el pueblo.' },
  { id: 2, titulo: 'Foco Cerro Las Ramadas',   nivel: 'MEDIO', estado: 'PENDIENTE', fecha: '15-04-2026', origen: 'CIUDADANO',   descripcion: 'Vecinos reportan posible foco en Cerro Las Ramadas, se observa humo.' },
  { id: 3, titulo: 'Humo sector El Maitén',    nivel: 'BAJO',  estado: 'PENDIENTE', fecha: '15-04-2026', origen: 'BRIGADISTA',  descripcion: 'Se observa columna de humo leve en el sector El Maitén.' },
];

const brigadistasMock = [
  { id: 1, nombre: 'Carlos Rojas' },
  { id: 2, nombre: 'Pedro Sánchez' },
  { id: 3, nombre: 'Laura Fuentes' },
];

const initialForm = { titulo: '', descripcion: '', nivel: 'MEDIO', latitud: '', longitud: '', archivos: [] };

function SelectorUbicacion({ onSeleccionar }) {
  useMapEvents({
    click(e) {
      onSeleccionar(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    }
  });
  return null;
}

export default function Reportes() {
  const { usuario } = useAuth();

  const [reportes, setReportes] = useState(reportesMock);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [exito, setExito] = useState(false);
  const [modalReporte, setModalReporte] = useState(null);
  const [brigadistaId, setBrigadistaId] = useState('');
  const [exitoAsign, setExitoAsign] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUbicacion = (lat, lng) => setForm(prev => ({ ...prev, latitud: lat, longitud: lng }));
  const handleArchivos = (e) => setForm(prev => ({ ...prev, archivos: [...prev.archivos, ...Array.from(e.target.files)] }));
  const eliminarArchivo = (index) => setForm(prev => ({ ...prev, archivos: prev.archivos.filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = {
      id: reportes.length + 1,
      titulo: form.titulo,
      nivel: form.nivel,
      estado: 'PENDIENTE',
      fecha: new Date().toLocaleDateString('es-CL'),
      origen: 'CIUDADANO',
      descripcion: form.descripcion,
    };
    setReportes([nuevo, ...reportes]);
    setForm(initialForm);
    setShowForm(false);
    setExito(true);
    setTimeout(() => setExito(false), 3000);
  };

  const handleAsignar = (e) => {
    e.preventDefault();
    if (!brigadistaId) return;
    setModalReporte(null);
    setBrigadistaId('');
    setExitoAsign(true);
    setTimeout(() => setExitoAsign(false), 3000);
  };

  const esFuncionario = usuario?.rol === 'FUNCIONARIO';

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.headerTitle}>Reportes de Incendio</h1>
          <p style={styles.headerSubtitle}>Gestión de focos activos y su historial</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={styles.headerButton}>
          {showForm ? 'Cancelar' : '+ Nuevo Reporte'}
        </button>
      </div>

      {/* Alertas */}
      {exito && <div style={styles.successAlert}>✓ Reporte enviado correctamente</div>}
      {exitoAsign && <div style={styles.infoAlert}>✓ Brigadista asignado correctamente</div>}

      {/* Formulario */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Nuevo Reporte</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.formGridFull}>
                <label style={styles.label}>Título del reporte *</label>
                <input name="titulo" value={form.titulo} onChange={handleChange} required placeholder="Ej: Incendio en Sector Carén" style={styles.input} />
              </div>
              <div style={styles.formGridFull}>
                <label style={styles.label}>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Describe lo que estás viendo..." style={{ ...styles.input, resize: 'vertical' }} />
              </div>
              <div>
                <label style={styles.label}>Nivel de Riesgo *</label>
                <select name="nivel" value={form.nivel} onChange={handleChange} style={styles.input}>
                  <option value="BAJO">Bajo</option>
                  <option value="MEDIO">Medio</option>
                  <option value="ALTO">Alto</option>
                  <option value="CRITICO">Crítico</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Latitud</label>
                  <input value={form.latitud} readOnly placeholder="Haz click en el mapa" style={{ ...styles.input, backgroundColor: '#f8fafc', color: '#64748b' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Longitud</label>
                  <input value={form.longitud} readOnly placeholder="Haz click en el mapa" style={{ ...styles.input, backgroundColor: '#f8fafc', color: '#64748b' }} />
                </div>
              </div>
              <div style={styles.formGridFull}>
                <label style={styles.label}>Ubicación del foco<span style={styles.labelSpan}>— haz click en el mapa para marcar el lugar</span></label>
                <div style={styles.mapContainer}>
                  <MapContainer center={[-30.695, -70.958]} zoom={12} style={styles.map}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
                    <SelectorUbicacion onSeleccionar={handleUbicacion} />
                    {form.latitud && form.longitud && <Marker position={[parseFloat(form.latitud), parseFloat(form.longitud)]} icon={iconDefault} />}
                  </MapContainer>
                </div>
                {form.latitud && <p style={styles.locationText}>📍 Ubicación seleccionada: {form.latitud}, {form.longitud}</p>}
              </div>
              <div style={styles.formGridFull}>
                <label style={styles.label}>Evidencia fotográfica / video<span style={styles.labelSpan}>(opcional)</span></label>
                <label style={styles.dropzone}>
                  <span style={styles.dropzoneIcon}>📎</span>
                  <span>Haz click para adjuntar fotos o videos</span>
                  <span style={styles.dropzoneHint}>JPG, PNG, MP4 — máx. 10MB por archivo</span>
                  <input type="file" accept="image/*,video/*" multiple onChange={handleArchivos} style={{ display: 'none' }} />
                </label>
                {form.archivos.length > 0 && (
                  <div style={styles.filePreviewContainer}>
                    {form.archivos.map((archivo, i) => (
                      <div key={i} style={styles.filePreviewItem}>
                        <span>{archivo.type.startsWith('video') ? '🎥' : '🖼️'}</span>
                        <span style={styles.filePreviewName}>{archivo.name}</span>
                        <button type="button" onClick={() => eliminarArchivo(i)} style={styles.fileDeleteButton}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>Enviar Reporte</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); }} style={styles.cancelButton}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              {['#', 'Título', 'Nivel', 'Estado', 'Origen', 'Descripción', 'Fecha', ...(esFuncionario ? ['Acción'] : [])].map(h => (
                <th key={h} style={styles.tableHeadCell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.id} style={styles.tableBodyRow}>
                <td style={styles.tableCellId}>#{r.id}</td>
                <td style={styles.tableCellTitle}>{r.titulo}</td>
                <td style={styles.tableCell}><span style={styles.levelBadge(r.nivel)}>● {r.nivel}</span></td>
                <td style={styles.tableCell}><span style={styles.statusBadge(r.estado)}>{r.estado.replace('_', ' ')}</span></td>
                <td style={styles.tableCell}>{r.origen}</td>
                <td style={styles.tableCellDescription}>{r.descripcion}</td>
                <td style={styles.tableCell}>{r.fecha}</td>
                {esFuncionario && (
                  <td style={styles.tableCell}>
                    {r.estado === 'EN_CURSO' && <button onClick={() => { setModalReporte(r); setBrigadistaId(''); }} style={styles.assignButton}>Asignar</button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal asignación */}
      {modalReporte && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Asignar Brigadista</h2>
            <p style={styles.modalSubtitle}>Reporte: <strong>{modalReporte.titulo}</strong></p>
            <form onSubmit={handleAsignar}>
              <label style={styles.label}>Selecciona un brigadista *</label>
              <select value={brigadistaId} onChange={e => setBrigadistaId(e.target.value)} required style={{ ...styles.input, marginBottom: '1.2rem' }}>
                <option value="">— Seleccionar —</option>
                {brigadistasMock.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
              </select>
              <div style={styles.modalFormActions}>
                <button type="submit" style={styles.modalConfirmButton}>Confirmar</button>
                <button type="button" onClick={() => setModalReporte(null)} style={styles.modalCancelButton}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
