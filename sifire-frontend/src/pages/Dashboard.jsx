import { useState } from 'react';
import * as styles from '../styles/Dashboard.styles';

const kpisMock = [
  { label: 'Reportes Activos',   valor: 12, color: '#ef4444', icono: '🔥' },
  { label: 'En Proceso',         valor: 5,  color: '#f97316', icono: '🔄' },
  { label: 'Brigadas Activas',   valor: 3,  color: '#3b82f6', icono: '🚒' },
  { label: 'Controlados Hoy',    valor: 8,  color: '#22c55e', icono: '✔️' },
];

const reportesRecientesMock = [
  { id: 1, titulo: 'Incendio Sector Carén',         nivel: 'ALTO',  estado: 'EN_CURSO',  hora: '21:10' },
  { id: 2, titulo: 'Foco Cerro Las Ramadas',        nivel: 'MEDIO', estado: 'PENDIENTE', hora: '20:45' },
  { id: 3, titulo: 'Humo sector El Maitén',         nivel: 'BAJO',  estado: 'PENDIENTE', hora: '20:30' },
  { id: 4, titulo: 'Incendio Sector Ponio resuelto',nivel: 'ALTO',  estado: 'CONTROLADO',hora: '19:55' },
  { id: 5, titulo: 'Alerta Quebrada El Durazno',    nivel: 'MEDIO', estado: 'CONTROLADO',hora: '19:20' },
];

export default function Dashboard() {
  const [reportes] = useState(reportesRecientesMock);

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
      <div style={styles.headerContainer}>
        <h1 style={styles.headerTitle}>🏛️ Panel de Control SIFIRE</h1>
        <p style={styles.headerSubtitle}>
          Municipalidad Valle del Sol — Subdirección de Emergencias
        </p>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {kpisMock.map((kpi, i) => (
          <div key={i} style={styles.kpiCard(kpi.color)}>
            <div style={styles.kpiIcon}>{kpi.icono}</div>
            <div style={styles.kpiValue(kpi.color)}>{kpi.valor}</div>
            <div style={styles.kpiLabel}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla reportes recientes */}
      <div style={styles.tableWrapper}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>Reportes Recientes</h2>
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              {['#', 'Titulo', 'Nivel', 'Estado', 'Hora'].map(h => (
                <th key={h} style={styles.tableHeadCell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.id} style={styles.tableBodyRow}>
                <td style={styles.tableCellId}>#{r.id}</td>
                <td style={styles.tableCellTitle}>{r.titulo}</td>
                <td style={styles.tableCell}>
                  <span style={styles.levelBadge(r.nivel)}>● {r.nivel}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.statusBadge(r.estado)}>
                    {r.estado.replace('_', ' ')}
                  </span>
                </td>
                <td style={styles.tableCell}>{r.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
