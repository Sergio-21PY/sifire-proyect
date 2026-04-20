import { useState } from 'react'

const alertasMock = [
  { id: 1, titulo: 'Evacuación Centro Rad. Fleming', mensaje: 'Se ordena evacuación preventiva del sector norte. Lamentablemente Matias murió en el lugar XD', estado: 'ENVIADA',   fecha: '15/04/2026 21:10', autor: 'Sergio Perez' },
  { id: 2, titulo: 'Alerta Lo Barnechea',            mensaje: 'Foco activo en sector oriente. Evite la zona y manténgase informado.',                         estado: 'ENVIADA',   fecha: '15/04/2026 20:45', autor: 'Ana Martínez' },
  { id: 3, titulo: 'Aviso Pudahuel',                 mensaje: 'Foco menor detectado en el sector. Equipos en camino, situación bajo control.',                 estado: 'PENDIENTE', fecha: '15/04/2026 20:30', autor: 'Carlos Rojas'  },
  { id: 4, titulo: 'Alerta Las Condes',              mensaje: 'Se detectó humo en el sector oriente de Las Condes. Pendiente confirmación.',                   estado: 'PENDIENTE', fecha: '15/04/2026 19:55', autor: 'Carlos Rojas'  },
]

const coloresEstado = {
  ENVIADA:   { bg: '#dcfce7', text: '#166534' },
  PENDIENTE: { bg: '#fef9c3', text: '#854d0e' },
  FALLIDA:   { bg: '#fee2e2', text: '#991b1b' },
}

export default function Alertas() {
  const [alertas]           = useState(alertasMock)
  const [filtro, setFiltro] = useState('TODOS')

  const alertasFiltradas = filtro === 'TODOS'
    ? alertas
    : alertas.filter(a => a.estado === filtro)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Alertas a la Comunidad
        </h1>
        <p style={{ color: '#64748b', margin: '0.3rem 0 0' }}>
          Alertas oficiales emitidas por funcionarios del sistema
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['TODOS', 'ENVIADA', 'PENDIENTE', 'FALLIDA'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            backgroundColor: filtro === f ? '#1e293b' : '#fff',
            color: filtro === f ? '#fff' : '#64748b',
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alertasFiltradas.map((alerta) => (
          <div key={alerta.id} style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.2rem 1.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: `5px solid ${coloresEstado[alerta.estado].text}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>

            <div>
              <strong style={{ color: '#1e293b', fontSize: '1rem', display: 'block', marginBottom: '0.4rem' }}>
                {alerta.titulo}
              </strong>
              <p style={{ color: '#64748b', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
                {alerta.mensaje}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>{alerta.fecha}</span>
                <span>{alerta.autor}</span>
              </div>
            </div>

            <span style={{
              backgroundColor: coloresEstado[alerta.estado].bg,
              color: coloresEstado[alerta.estado].text,
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              {alerta.estado}
            </span>

          </div>
        ))}
      </div>

    </div>
  )
}