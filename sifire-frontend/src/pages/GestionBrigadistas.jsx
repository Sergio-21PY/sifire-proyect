import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listarUsuarios, registrarUsuario } from '../services/usuario.service';
import * as styles from '../styles/GestionBrigadistas.styles';

const initialForm = { nombre: '', email: '', telefono: '', password: '' };

export default function GestionBrigadistas() {
  const { usuario } = useAuth();

  const [brigadistas, setBrigadistas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoadingData(true);
        const data = await listarUsuarios();
        setBrigadistas(data.map(u => ({ ...u, asignaciones: 0, estado: 'ACTIVO' })));
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoadingData(false);
      }
    };
    cargarUsuarios();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido.';
    if (form.telefono && !/^\+?56?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(form.telefono)) e.telefono = 'Formato inválido. Ej: +56 9 1234 5678';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const nuevoBrigadista = await registrarUsuario({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
      });
      setBrigadistas([{ ...nuevoBrigadista, telefono: form.telefono || '—', asignaciones: 0, estado: 'ACTIVO' }, ...brigadistas]);
      setForm(initialForm);
      setShowForm(false);
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch (error) {
      console.error("Error al registrar brigadista:", error);
      setErrors({ form: 'No se pudo registrar el brigadista. Intente de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = (id) => {
    setBrigadistas(prev =>
      prev.map(b => b.id === id ? { ...b, estado: b.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : b)
    );
  };

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.headerTitle}>Gestión de Brigadistas</h1>
          <p style={styles.headerSubtitle}>Registrado como: {usuario?.nombre} — {usuario?.rol}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={styles.headerButton}>
          {showForm ? 'Cancelar' : '+ Nuevo Brigadista'}
        </button>
      </div>

      {/* Alerta éxito */}
      {exito && <div style={styles.successAlert}>✓ Brigadista registrado correctamente.</div>}

      {/* Formulario */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Nuevo Brigadista</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.labelStyle}>Nombre completo *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Carlos Rojas" style={styles.inputStyle(errors.nombre)} />
                {errors.nombre && <span style={styles.errorStyle}>{errors.nombre}</span>}
              </div>
              <div>
                <label style={styles.labelStyle}>Correo electrónico *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="correo@ejemplo.cl" style={styles.inputStyle(errors.email)} />
                {errors.email && <span style={styles.errorStyle}>{errors.email}</span>}
              </div>
              <div>
                <label style={styles.labelStyle}>Teléfono <span style={{ fontWeight: 400, color: '#94a3b8' }}>(opcional)</span></label>
                <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="+56 9 1234 5678" style={styles.inputStyle(errors.telefono)} />
                {errors.telefono && <span style={styles.errorStyle}>{errors.telefono}</span>}
              </div>
              <div>
                <label style={styles.labelStyle}>Contraseña temporal *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Mínimo 8 caracteres" style={styles.inputStyle(errors.password)} />
                {errors.password && <span style={styles.errorStyle}>{errors.password}</span>}
              </div>
            </div>
            {errors.form && <span style={styles.errorStyle}>{errors.form}</span>}
            <div style={styles.formActions}>
              <button type="submit" disabled={loading} style={styles.submitButton(loading)}>
                {loading ? 'Registrando...' : 'Registrar Brigadista'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); setErrors({}); }} style={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div style={styles.tableWrapper}>
        <div style={styles.tableHeader}>
          <p style={styles.tableHeaderText}>
            {brigadistas.length} brigadistas registrados — {brigadistas.filter(b => b.estado === 'ACTIVO').length} activos
          </p>
        </div>
        {loadingData ? (
          <p style={styles.loadingText}>Cargando datos...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                {['#', 'Nombre', 'Correo', 'Teléfono', 'Asignaciones', 'Estado', 'Acción'].map(h => (
                  <th key={h} style={styles.tableHeadCell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brigadistas.map((b) => (
                <tr key={b.id} style={styles.tableBodyRow}>
                  <td style={styles.tableCellId}>#{b.id}</td>
                  <td style={styles.tableCellName}>{b.nombre}</td>
                  <td style={styles.tableCell}>{b.email}</td>
                  <td style={styles.tableCell}>{b.telefono || 'N/A'}</td>
                  <td style={styles.tableCell}>
                    <span style={styles.asignacionesBadge(b.asignaciones)}>
                      {b.asignaciones > 0 ? `${b.asignaciones} activa${b.asignaciones > 1 ? 's' : ''}` : 'Sin asignar'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.estadoBadge(b.estado)}>
                      {b.estado}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <button onClick={() => toggleEstado(b.id)} style={styles.actionButton}>
                      {b.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
