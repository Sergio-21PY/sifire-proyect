import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as styles from '../styles/Alertas.styles';

const alertasMock = [
  { id: 1, titulo: 'Evacuación Centro Rad. Fleming', mensaje: 'Se ordena evacuación preventiva del sector norte. Lamentablemente Matias murió en el lugar XD', estado: 'ENVIADA',   fecha: '15/04/2026 21:10', autor: 'Sergio Perez' },
  { id: 2, titulo: 'Alerta Lo Barnechea',            mensaje: 'Foco activo en sector oriente. Evite la zona y manténgase informado.',                         estado: 'ENVIADA',   fecha: '15/04/2026 20:45', autor: 'Ana Martínez' },
  { id: 3, titulo: 'Aviso Pudahuel',                 mensaje: 'Foco menor detectado en el sector. Equipos en camino, situación bajo control.',                 estado: 'PENDIENTE', fecha: '15/04/2026 20:30', autor: 'Carlos Rojas'  },
  { id: 4, titulo: 'Alerta Las Condes',              mensaje: 'Se detectó humo en el sector oriente de Las Condes. Pendiente confirmación.',                   estado: 'PENDIENTE', fecha: '15/04/2026 19:55', autor: 'Carlos Rojas'  },
];

export default function Alertas() {
  const { usuario } = useAuth();
  const [alertas] = useState(alertasMock);
  const [filtro, setFiltro] = useState('TODOS');

  const esFuncionario = usuario?.rol === 'FUNCIONARIO';

  const alertasFiltradas = filtro === 'TODOS'
    ? alertas
    : alertas.filter(a => a.estado === filtro);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.headerContainer}>
        <h1 style={styles.headerTitle}>Alertas a la Comunidad</h1>
        <p style={styles.headerSubtitle}>
          {esFuncionario
            ? `Funcionario: ${usuario?.username || usuario?.nombre} — alertas oficiales emitidas`
            : 'Alertas oficiales emitidas por funcionarios del sistema'}
        </p>
      </div>

      <div style={styles.filterContainer}>
        {['TODOS', 'ENVIADA', 'PENDIENTE', 'FALLIDA'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={styles.filterButton(filtro === f)}>
            {f}
          </button>
        ))}
      </div>

      <div style={styles.alertsListContainer}>
        {alertasFiltradas.map((alerta) => (
          <div key={alerta.id} style={styles.alertCard(alerta.estado)}>
            <div>
              <strong style={styles.alertTitle}>
                {alerta.titulo}
              </strong>
              <p style={styles.alertMessage}>
                {alerta.mensaje}
              </p>
              <div style={styles.alertMetaContainer}>
                <span>{alerta.fecha}</span>
                <span>{alerta.autor}</span>
              </div>
            </div>
            <span style={styles.alertStatusBadge(alerta.estado)}>
              {alerta.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
