import * as styles from '../../styles/Reportes.styles';
import MapaSelector from './MapaSelector';

export default function ReporteForm({ form, centroMapa, onChange, onUbicacion, onArchivos, onEliminarArchivo, onUbicacionActual, onSubmit, onCancelar }) {
  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>Nuevo Reporte</h2>
      <form onSubmit={onSubmit}>
        <div style={styles.formGrid}>

          <div style={styles.formGridFull}>
            <label style={styles.label}>Título del reporte *</label>
            <input name="titulo" value={form.titulo} onChange={onChange} required placeholder="Ej: Incendio en Sector Carén" style={styles.input} />
          </div>

          <div style={styles.formGridFull}>
            <label style={styles.label}>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={onChange} rows={3} placeholder="Describe lo que estás viendo..." style={{ ...styles.input, resize: 'vertical' }} />
          </div>

          <div>
            <label style={styles.label}>Nivel de Riesgo *</label>
            <select name="nivel" value={form.nivel} onChange={onChange} style={styles.input}>
              <option value="BAJO">Bajo</option>
              <option value="MEDIO">Medio</option>
              <option value="ALTO">Alto</option>
              <option value="CRITICO">Crítico</option>
            </select>
          </div>
          <div>
            <select name="comuna" value={form.comuna} onChange={onChange}>
              <option value="">-- Selecciona una comuna --</option>
              <option value="San Joaquín">San Joaquín</option>
              <option value="La Granja">La Granja</option>
              <option value="San Ramón">San Ramón</option>
              <option value="La Pintana">La Pintana</option>
              <option value="El Bosque">El Bosque</option>
              <option value="Pedro Aguirre Cerda">Pedro Aguirre Cerda</option>
              <option value="San Miguel">San Miguel</option>
              <option value="Lo Espejo">Lo Espejo</option>
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
            <label style={styles.label}>
              Ubicación del foco <span style={styles.labelSpan}>— haz click en el mapa para marcar el lugar</span>
            </label>
            <button type="button" onClick={onUbicacionActual} style={{ marginBottom: '0.5rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
              📍 Usar mi ubicación actual
            </button>
            <div style={styles.mapContainer}>
              <MapaSelector centro={centroMapa} latitud={form.latitud} longitud={form.longitud} onSeleccionar={onUbicacion} />
            </div>
            {form.latitud && <p style={styles.locationText}>📍 Ubicación seleccionada: {form.latitud}, {form.longitud}</p>}
          </div>

          <div style={styles.formGridFull}>
            <label style={styles.label}>Evidencia fotográfica / video <span style={styles.labelSpan}>(opcional)</span></label>
            <label style={styles.dropzone}>
              <span style={styles.dropzoneIcon}>📎</span>
              <span>Haz click para adjuntar fotos o videos</span>
              <span style={styles.dropzoneHint}>JPG, PNG, MP4 — máx. 10MB por archivo</span>
              <input type="file" accept="image/*,video/*" multiple onChange={onArchivos} style={{ display: 'none' }} />
            </label>
            {form.archivos.length > 0 && (
              <div style={styles.filePreviewContainer}>
                {form.archivos.map((archivo, i) => (
                  <div key={i} style={styles.filePreviewItem}>
                    <span>{archivo.type.startsWith('video') ? '🎥' : '🖼️'}</span>
                    <span style={styles.filePreviewName}>{archivo.name}</span>
                    <button type="button" onClick={() => onEliminarArchivo(i)} style={styles.fileDeleteButton}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        <div style={styles.formActions}>
          <button type="submit" style={styles.submitButton}>Enviar Reporte</button>
          <button type="button" onClick={onCancelar} style={styles.cancelButton}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}