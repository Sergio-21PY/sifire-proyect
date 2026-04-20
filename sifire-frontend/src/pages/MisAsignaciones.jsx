import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as styles from '../styles/MisAsignaciones.styles';

const asignacionesMock = [
    { id: 1, reporteId: 1, titulo: 'Incendio Sector Carén', nivel: 'ALTO', estado: 'EN_CURSO', fecha: '15-04-2026', descripcion: 'Incendio activo en el sector Carén, con humo visible desde el pueblo.', lat: -30.692, lng: -70.962 },
    { id: 2, reporteId: 2, titulo: 'Columna de humo Cerro Las Ramadas', nivel: 'MEDIO', estado: 'EN_CURSO', fecha: '14-04-2026', descripcion: 'Columna de humo visible desde el Cerro Las Ramadas, sin confirmación de incendio.', lat: -30.701, lng: -70.948 },
];

const estadosSiguientes = {
  EN_CURSO:   ['CONTROLADO', 'CERRADO'],
  CONTROLADO: ['CERRADO'],
  CERRADO:    [],
};

export default function MisAsignaciones() {
  const { usuario } = useAuth();
  const [asignaciones, setAsignaciones] = useState(asignacionesMock);
  const [exito, setExito] = useState(false);

  const cambiarEstado = (id, nuevoEstado) => {
    setAsignaciones(prev =>
      prev.map(a => a.id === id ? { ...a, estado: nuevoEstado } : a)
    );
    setExito(true);
    setTimeout(() => setExito(false), 3000);
  };

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
      <div style={styles.headerContainer}>
        <h1 style={styles.headerTitle}>Mis Asignaciones</h1>
        <p style={styles.headerSubtitle}>
          Brigadista: {usuario?.nombre} — {asignaciones.filter(a => a.estado === 'EN_CURSO').length} activas
        </p>
      </div>

      {/* Alerta éxito */}
      {exito && <div style={styles.successAlert}>✓ Estado actualizado correctamente</div>}

      {/* Sin asignaciones */}
      {asignaciones.length === 0 && (
        <div style={styles.noAsignacionesContainer}>
          <p style={styles.noAsignacionesText}>No tienes asignaciones activas.</p>
        </div>
      )}

      {/* Tarjetas de asignaciones */}
      <div style={styles.cardsGrid}>
        {asignaciones.map((a) => (
          <div key={a.id} style={styles.card(a.nivel)}>
            {/* Título y nivel */}
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>{a.titulo}</h2>
              <span style={styles.cardLevelBadge(a.nivel)}>● {a.nivel}</span>
            </div>

            {/* Descripción */}
            <p style={styles.cardDescription}>{a.descripcion}</p>

            {/* Meta info */}
            <div style={styles.cardMeta}>
              <span>📅 {a.fecha}</span>
              <span>📍 {a.lat}, {a.lng}</span>
            </div>

            {/* Estado actual y acciones */}
            <div style={styles.cardFooter}>
              <span style={styles.cardStatusBadge(a.estado)}>
                {a.estado.replace('_', ' ')}
              </span>
              <div style={styles.cardActions}>
                {estadosSiguientes[a.estado]?.map(siguiente => (
                  <button
                    key={siguiente}
                    onClick={() => cambiarEstado(a.id, siguiente)}
                    style={styles.actionButton(siguiente)}
                  >
                    → {siguiente.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
