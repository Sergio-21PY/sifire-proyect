import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const brigadistasMock = [
  { id: 1, nombre: 'Carlos Rojas',  email: 'brigadista@demo.cl', telefono: '+56 9 8765 4321', estado: 'ACTIVO',   asignaciones: 1 },
  { id: 2, nombre: 'Pedro Sánchez', email: 'pedro@demo.cl',      telefono: '+56 9 7654 3210', estado: 'ACTIVO',   asignaciones: 0 },
  { id: 3, nombre: 'Laura Fuentes', email: 'laura@demo.cl',      telefono: '+56 9 6543 2109', estado: 'INACTIVO', asignaciones: 0 },
]

const initialForm = { nombre: '', email: '', telefono: '', password: '' }

export default function GestionBrigadistas() {
  const { usuario } = useAuth()

  const [brigadistas, setBrigadistas] = useState(brigadistasMock)
  const [form, setForm]               = useState(initialForm)
  const [errors, setErrors]           = useState({})
  const [showForm, setShowForm]       = useState(false)
  const [exito, setExito]             = useState(false)
  const [loading, setLoading]         = useState(false)

  const validate = () => {
    const e = {}
    if (!form.nombre.trim())
      e.nombre = 'El nombre es requerido.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Ingresa un correo válido.'
    if (form.telefono && !/^\+?56?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(form.telefono))
      e.telefono = 'Formato inválido. Ej: +56 9 1234 5678'
    if (form.password.length < 8)
      e.password = 'Mínimo 8 caracteres.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // TODO: reemplazar por POST /bff/usuarios/crear-brigadista
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))

    const nuevo = {
      id: brigadistas.length + 1,
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono || '—',
      estado: 'ACTIVO',
      asignaciones: 0,
    }

    setBrigadistas([nuevo, ...brigadistas])
    setForm(initialForm)
    setShowForm(false)
    setLoading(false)
    setExito(true)
    setTimeout(() => setExito(false), 3000)
  }

  // TODO: reemplazar por PATCH /bff/usuarios/:id/estado
  const toggleEstado = (id) => {
    setBrigadistas(prev =>
      prev.map(b => b.id === id
        ? { ...b, estado: b.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
        : b
      )
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Gestión de Brigadistas
          </h1>
          <p style={{ color: '#64748b', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
            Registrado como: {usuario?.nombre} — {usuario?.rol}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Brigadista'}
        </button>
      </div>

      {/* Alerta éxito */}
      {exito && (
        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 500 }}>
          ✓ Brigadista registrado correctamente.
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginTop: 0 }}>
            Nuevo Brigadista
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              <div>
                <label style={labelStyle}>Nombre completo *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required
                  placeholder="Ej: Carlos Rojas"
                  style={inputStyle(errors.nombre)} />
                {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}
              </div>

              <div>
                <label style={labelStyle}>Correo electrónico *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="correo@ejemplo.cl"
                  style={inputStyle(errors.email)} />
                {errors.email && <span style={errorStyle}>{errors.email}</span>}
              </div>

              <div>
                <label style={labelStyle}>Teléfono <span style={{ fontWeight: 400, color: '#94a3b8' }}>(opcional)</span></label>
                <input name="telefono" type="tel" value={form.telefono} onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  style={inputStyle(errors.telefono)} />
                {errors.telefono && <span style={errorStyle}>{errors.telefono}</span>}
              </div>

              <div>
                <label style={labelStyle}>Contraseña temporal *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required
                  placeholder="Mínimo 8 caracteres"
                  style={inputStyle(errors.password)} />
                {errors.password && <span style={errorStyle}>{errors.password}</span>}
              </div>

            </div>

            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem' }}>
              <button type="submit" disabled={loading}
                style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                {loading ? 'Registrando...' : 'Registrar Brigadista'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); setErrors({}) }}
                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            {brigadistas.length} brigadistas registrados — {brigadistas.filter(b => b.estado === 'ACTIVO').length} activos
          </p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {['#', 'Nombre', 'Correo', 'Teléfono', 'Asignaciones', 'Estado', 'Acción'].map(h => (
                <th key={h} style={{ padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brigadistas.map((b) => (
              <tr key={b.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>#{b.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#1e293b' }}>{b.nombre}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>{b.email}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>{b.telefono}</td>

                {/* columna nueva — asignaciones activas */}
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{
                    backgroundColor: b.asignaciones > 0 ? '#fef9c3' : '#f1f5f9',
                    color: b.asignaciones > 0 ? '#854d0e' : '#94a3b8',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {b.asignaciones > 0 ? `${b.asignaciones} activa${b.asignaciones > 1 ? 's' : ''}` : 'Sin asignar'}
                  </span>
                </td>

                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{
                    backgroundColor: b.estado === 'ACTIVO' ? '#dcfce7' : '#f1f5f9',
                    color: b.estado === 'ACTIVO' ? '#166534' : '#475569',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {b.estado}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button onClick={() => toggleEstado(b.id)}
                    style={{ backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.3rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', color: '#64748b' }}>
                    {b.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }
const inputStyle  = (error) => ({ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' })
const errorStyle  = { color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }