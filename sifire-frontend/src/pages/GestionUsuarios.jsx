import { useState, useEffect } from 'react';
import { listarUsuarios, registrarUsuario } from '../services/usuario.service';
import * as styles from '../styles/GestionBrigadistas.styles';

const initialForm = {
    nombre: '', email: '', telefono: '', password: '', tipo: 'FUNCIONARIO'
};

const TIPO_LABELS = {
    FUNCIONARIO: { label: 'Funcionario Municipal', color: '#1e40af', bg: '#dbeafe' },
    BRIGADISTA:  { label: 'Brigadista',             color: '#166534', bg: '#dcfce7' },
    CIUDADANO:   { label: 'Ciudadano',              color: '#92400e', bg: '#fef3c7' },
    ADMINISTRADOR: { label: 'Administrador',        color: '#6b21a8', bg: '#f3e8ff' },
};

export default function GestionUsuarios() {
    const [usuarios, setUsuarios]     = useState([]);
    const [form, setForm]             = useState(initialForm);
    const [errors, setErrors]         = useState({});
    const [showForm, setShowForm]     = useState(false);
    const [exito, setExito]           = useState(false);
    const [loading, setLoading]       = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState('TODOS');

    useEffect(() => { cargar(); }, []);

    const cargar = async () => {
        try {
            const data = await listarUsuarios();
            setUsuarios(data);
        } catch (e) {
            console.error('Error al cargar usuarios:', e);
        } finally {
            setLoadingData(false);
        }
    };

    const validate = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = 'El nombre es requerido.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido.';
        if (form.telefono && !/^\+?56?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(form.telefono)) e.telefono = 'Formato inválido. Ej: +56 9 1234 5678';
        if (form.password.length < 4) e.password = 'Mínimo 4 caracteres.';
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
        if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
        setLoading(true);
        try {
            const nuevo = await registrarUsuario({
                username: form.nombre,
                nombre:   form.nombre,
                email:    form.email,
                password: form.password,
                telefono: form.telefono || null,
                tipo:     form.tipo,
                activo:   true,
            });
            setUsuarios(prev => [nuevo, ...prev]);
            setForm(initialForm);
            setShowForm(false);
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch (e) {
            setErrors({ form: 'No se pudo registrar el usuario. El correo puede estar en uso.' });
        } finally {
            setLoading(false);
        }
    };

    const usuariosFiltrados = filtroTipo === 'TODOS'
        ? usuarios
        : usuarios.filter(u => u.tipo === filtroTipo);

    return (
        <div style={styles.mainContainer}>
            <div style={styles.headerContainer}>
                <div>
                    <h1 style={styles.headerTitle}>Gestión de Usuarios</h1>
                    <p style={styles.headerSubtitle}>Administración de cuentas del sistema</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setErrors({}); }} style={styles.headerButton}>
                    {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
                </button>
            </div>

            {exito && <div style={styles.successAlert}>✓ Usuario registrado correctamente.</div>}

            {showForm && (
                <div style={styles.formContainer}>
                    <h2 style={styles.formTitle}>Nuevo usuario</h2>
                    {errors.form && (
                        <div style={{ ...styles.successAlert, backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '1rem' }}>
                            {errors.form}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGrid}>
                            <div>
                                <label style={styles.labelStyle}>Nombre completo</label>
                                <input name="nombre" value={form.nombre} onChange={handleChange}
                                    placeholder="Ej: Carlos Muñoz"
                                    style={styles.inputStyle(!!errors.nombre)} />
                                {errors.nombre && <span style={styles.errorStyle}>{errors.nombre}</span>}
                            </div>
                            <div>
                                <label style={styles.labelStyle}>Correo electrónico</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange}
                                    placeholder="correo@ejemplo.cl"
                                    style={styles.inputStyle(!!errors.email)} />
                                {errors.email && <span style={styles.errorStyle}>{errors.email}</span>}
                            </div>
                            <div>
                                <label style={styles.labelStyle}>Teléfono (opcional)</label>
                                <input name="telefono" value={form.telefono} onChange={handleChange}
                                    placeholder="+56 9 1234 5678"
                                    style={styles.inputStyle(!!errors.telefono)} />
                                {errors.telefono && <span style={styles.errorStyle}>{errors.telefono}</span>}
                            </div>
                            <div>
                                <label style={styles.labelStyle}>Contraseña</label>
                                <input name="password" type="password" value={form.password} onChange={handleChange}
                                    placeholder="Mínimo 4 caracteres"
                                    style={styles.inputStyle(!!errors.password)} />
                                {errors.password && <span style={styles.errorStyle}>{errors.password}</span>}
                            </div>
                            <div>
                                <label style={styles.labelStyle}>Tipo de usuario</label>
                                <select name="tipo" value={form.tipo} onChange={handleChange}
                                    style={{ ...styles.inputStyle(false), cursor: 'pointer' }}>
                                    <option value="FUNCIONARIO">Funcionario Municipal</option>
                                    <option value="BRIGADISTA">Brigadista</option>
                                    <option value="CIUDADANO">Ciudadano</option>
                                </select>
                            </div>
                        </div>
                        <div style={styles.formActions}>
                            <button type="submit" disabled={loading} style={styles.submitButton(loading)}>
                                {loading ? 'Registrando...' : 'Registrar Usuario'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); setErrors({}); }}
                                style={styles.cancelButton}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filtro por tipo */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {['TODOS', 'FUNCIONARIO', 'BRIGADISTA', 'CIUDADANO', 'ADMINISTRADOR'].map(tipo => (
                    <button key={tipo} onClick={() => setFiltroTipo(tipo)} style={{
                        padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.8rem',
                        fontWeight: 600, cursor: 'pointer', border: 'none',
                        backgroundColor: filtroTipo === tipo ? '#1d4ed8' : '#e5e7eb',
                        color: filtroTipo === tipo ? '#fff' : '#374151',
                    }}>
                        {tipo === 'TODOS' ? 'Todos' : TIPO_LABELS[tipo]?.label || tipo}
                        {' '}({tipo === 'TODOS' ? usuarios.length : usuarios.filter(u => u.tipo === tipo).length})
                    </button>
                ))}
            </div>

            <div style={styles.tableWrapper}>
                <div style={styles.tableHeader}>
                    <p style={styles.tableHeaderText}>{usuariosFiltrados.length} usuario(s)</p>
                </div>
                {loadingData ? (
                    <p style={styles.loadingText}>Cargando...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeadRow}>
                                {['#', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Estado'].map(h => (
                                    <th key={h} style={styles.tableHeadCell}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ ...styles.tableCell, textAlign: 'center', padding: '2rem' }}>
                                        Sin usuarios registrados
                                    </td>
                                </tr>
                            ) : usuariosFiltrados.map(u => (
                                <tr key={u.id} style={styles.tableBodyRow}>
                                    <td style={styles.tableCellId}>#{u.id}</td>
                                    <td style={styles.tableCellName}>{u.nombre || u.username}</td>
                                    <td style={styles.tableCell}>{u.email}</td>
                                    <td style={styles.tableCell}>{u.telefono || '—'}</td>
                                    <td style={styles.tableCell}>
                                        <span style={{
                                            backgroundColor: TIPO_LABELS[u.tipo]?.bg || '#f1f5f9',
                                            color: TIPO_LABELS[u.tipo]?.color || '#475569',
                                            padding: '0.2rem 0.7rem', borderRadius: '999px',
                                            fontSize: '0.8rem', fontWeight: 600,
                                        }}>
                                            {TIPO_LABELS[u.tipo]?.label || u.tipo}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.estadoBadge(u.activo ? 'ACTIVO' : 'INACTIVO')}>
                                            {u.activo ? 'Activo' : 'Inactivo'}
                                        </span>
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