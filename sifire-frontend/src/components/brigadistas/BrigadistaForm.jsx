import * as styles from '../../styles/GestionBrigadistas.styles';

export default function BrigadistaForm({ form, errors, loading, onChange, onSubmit, onCancelar }) {
  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>Nuevo Brigadista</h2>
      <form onSubmit={onSubmit}>
        <div style={styles.formGrid}>
          <div>
            <label style={styles.labelStyle}>Nombre completo *</label>
            <input name="nombre" value={form.nombre} onChange={onChange} required placeholder="Ej: Carlos Rojas" style={styles.inputStyle(errors.nombre)} />
            {errors.nombre && <span style={styles.errorStyle}>{errors.nombre}</span>}
          </div>
          <div>
            <label style={styles.labelStyle}>Correo electrónico *</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required placeholder="correo@ejemplo.cl" style={styles.inputStyle(errors.email)} />
            {errors.email && <span style={styles.errorStyle}>{errors.email}</span>}
          </div>
          <div>
            <label style={styles.labelStyle}>Teléfono <span style={{ fontWeight: 400, color: '#94a3b8' }}>(opcional)</span></label>
            <input name="telefono" type="tel" value={form.telefono} onChange={onChange} placeholder="+56 9 1234 5678" style={styles.inputStyle(errors.telefono)} />
            {errors.telefono && <span style={styles.errorStyle}>{errors.telefono}</span>}
          </div>
          <div>
            <label style={styles.labelStyle}>Contraseña temporal *</label>
            <input name="password" type="password" value={form.password} onChange={onChange} required placeholder="Mínimo 8 caracteres" style={styles.inputStyle(errors.password)} />
            {errors.password && <span style={styles.errorStyle}>{errors.password}</span>}
          </div>
        </div>
        {errors.form && <span style={styles.errorStyle}>{errors.form}</span>}
        <div style={styles.formActions}>
          <button type="submit" disabled={loading} style={styles.submitButton(loading)}>
            {loading ? 'Registrando...' : 'Registrar Brigadista'}
          </button>
          <button type="button" onClick={onCancelar} style={styles.cancelButton}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}