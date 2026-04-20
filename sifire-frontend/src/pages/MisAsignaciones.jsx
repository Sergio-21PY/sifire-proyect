import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const asignacionesMock = [
    {
        id: 1,
        reporteId: 1,
        titulo: 'Incendio Sector Carén',
        nivel: 'ALTO',
        estado: 'EN_CURSO',
        fecha: '15-04-2026',
        descripcion: 'Incendio activo en el sector Carén, con humo visible desde el pueblo.',
        lat: -30.692,
        lng: -70.962,
    },
    {
        id: 2,
        reporteId: 2,
        titulo: 'Columna de humo Cerro Las Ramadas',
        nivel: 'MEDIO',
        estado: 'EN_CURSO',
        fecha: '14-04-2026',
        descripcion: 'Columna de humo visible desde el Cerro Las Ramadas, sin confirmación de incendio.',
        lat: -30.701,
        lng: -70.948,
    },
]

const coloresNivel = { ALTO: '#ef4444', MEDIO: '#f97316', BAJO: '#eab308', CRITICO: '#b91c1c' }
const coloresEstado = {
    PENDIENTE: { bg: '#fef9c3', text: '#854d0e' },
    EN_CURSO: { bg: '#fee2e2', text: '#991b1b' },
    CONTROLADO: { bg: '#dcfce7', text: '#166534' },
    CERRADO: { bg: '#f1f5f9', text: '#475569' },
}
const estadosSiguientes = {
  EN_CURSO:   ['CONTROLADO', 'CERRADO'],
  CONTROLADO: ['CERRADO'],
  CERRADO:    [],
}
export default function MisAsignaciones() {
  const { usuario } = useAuth()
  const [asignaciones, setAsignaciones] = useState(asignacionesMock)
  const [exito, setExito]               = useState(false)

  const cambiarEstado = (id, nuevoEstado) => {
    // TODO: axios.patch(`/bff/reportes/${id}/estado`, { estado: nuevoEstado })
    setAsignaciones(prev =>
      prev.map(a => a.id === id ? { ...a, estado: nuevoEstado } : a)
    )
    setExito(true)
    setTimeout(() => setExito(false), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Mis Asignaciones
        </h1>
        <p style={{ color: '#64748b', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
          Brigadista: {usuario?.nombre} — {asignaciones.filter(a => a.estado === 'EN_CURSO').length} activas
        </p>
      </div>

      {/* Alerta éxito */}
      {exito && (
        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 500 }}>
          ✓ Estado actualizado correctamente
        </div>
      )}

      {/* Sin asignaciones */}
      {asignaciones.length === 0 && (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>No tienes asignaciones activas.</p>
        </div>
      )}

      {/* Tarjetas de asignaciones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {asignaciones.map((a) => (
          <div key={a.id} style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: `5px solid ${coloresNivel[a.nivel] ?? '#64748b'}`
          }}>

            {/* Título y nivel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                {a.titulo}
              </h2>
              <span style={{ color: coloresNivel[a.nivel] ?? '#64748b', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                ● {a.nivel}
              </span>
            </div>

            {/* Descripción */}
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {a.descripcion}
            </p>

            {/* Meta info */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>📅 {a.fecha}</span>
              <span>📍 {a.lat}, {a.lng}</span>
            </div>

            {/* Estado actual */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                backgroundColor: (coloresEstado[a.estado] ?? coloresEstado.CERRADO).bg,
                color: (coloresEstado[a.estado] ?? coloresEstado.CERRADO).text,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {a.estado.replace('_', ' ')}
              </span>

              {/* Botones para cambiar estado */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {estadosSiguientes[a.estado]?.map(siguiente => (
                  <button
                    key={siguiente}
                    onClick={() => cambiarEstado(a.id, siguiente)}
                    style={{
                      backgroundColor: siguiente === 'CERRADO' ? '#f1f5f9' : '#dcfce7',
                      color: siguiente === 'CERRADO' ? '#475569' : '#166534',
                      border: 'none',
                      padding: '0.35rem 0.9rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                    → {siguiente.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}