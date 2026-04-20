import { useState } from 'react'

const kpisMock = [
  { label: 'Reportes Activos',   valor: 12, color: '#ef4444', icono: '🔥' },
  { label: 'En Proceso',         valor: 5,  color: '#f97316', icono: '🔄' },
  { label: 'Brigadas Activas',   valor: 3,  color: '#3b82f6', icono: '🚒' },
  { label: 'Controlados Hoy',    valor: 8,  color: '#22c55e', icono: '✔️' },
]

const reportesRecientesMock = [
  { id: 1, titulo: 'Incendio Sector Carén',         nivel: 'ALTO',  estado: 'EN_CURSO',  hora: '21:10' },
  { id: 2, titulo: 'Foco Cerro Las Ramadas',        nivel: 'MEDIO', estado: 'PENDIENTE', hora: '20:45' },
  { id: 3, titulo: 'Humo sector El Maitén',         nivel: 'BAJO',  estado: 'PENDIENTE', hora: '20:30' },
  { id: 4, titulo: 'Incendio Sector Ponio resuelto',nivel: 'ALTO',  estado: 'CONTROLADO',hora: '19:55' },
  { id: 5, titulo: 'Alerta Quebrada El Durazno',    nivel: 'MEDIO', estado: 'CONTROLADO',hora: '19:20' },
]
const coloresNivel = { ALTO: '#ef4444', MEDIO: '#f97316', BAJO: '#eab308' }
const coloresEstado = {
  PENDIENTE:   { bg: '#fef9c3', text: '#854d0e' },
  EN_CURSO:  { bg: '#fee2e2', text: '#991b1b' },
  CONTROLADO:  { bg: '#dcfce7', text: '#166534' },
  CERRADO:     { bg: '#f1f5f9', text: '#475569' },
}

export default function Dashboard() {
  const [reportes] = useState(reportesRecientesMock)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          🏛️ Panel de Control SIFIRE
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.3rem' }}>
          Municipalidad Valle del Sol — Subdirección de Emergencias
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {kpisMock.map((kpi, i) => (
          <div key={i} style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: `5px solid ${kpi.color}`
          }}>
            <div style={{ fontSize: '2rem' }}>{kpi.icono}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: kpi.color }}>{kpi.valor}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla reportes recientes */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
            Reportes Recientes
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {['#', 'Titulo', 'Nivel', 'Estado', 'Hora'].map(h => (
                <th key={h} style={{ padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>#{r.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#1e293b' }}>{r.titulo}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ color: coloresNivel[r.nivel], fontWeight: 700, fontSize: '0.85rem' }}>
                    ● {r.nivel}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{
                    backgroundColor: coloresEstado[r.estado].bg,
                    color: coloresEstado[r.estado].text,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}>
                    {r.estado.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>{r.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}