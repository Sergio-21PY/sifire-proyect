import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { listarAsignaciones } from "../services/monitoreo.service";
import { cambiarEstadoReporte } from "../services/reporte.service";
import * as styles from '../styles/MisAsignaciones.styles';

const estadosSiguientes = {
    EN_PROCESO: ['RESUELTO', 'DESCARTADO'],
    RESUELTO:   [],
    DESCARTADO: [],
};

export default function MisAsignaciones() {
    const { usuario } = useAuth();
    const [asignaciones, setAsignaciones] = useState([]);
    const [exito, setExito]               = useState(false);
    const [cargando, setCargando]         = useState(true);
    const [error, setError]               = useState(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await listarAsignaciones();
                const activas = data.filter(a => !a.fechaFin);
                setAsignaciones(activas);
            } catch (err) {
                setError('No se pudieron cargar las asignaciones');
                console.error(err);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [usuario]);

    const cambiarEstado = async (reporteId, nuevoEstado) => {
        try {
            await cambiarEstadoReporte(reporteId, nuevoEstado);
            setAsignaciones(prev =>
                prev.map(a => a.reporteId === reporteId ? { ...a, estado: nuevoEstado } : a)
            );
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch (err) {
            setError('No se pudo actualizar el estado');
            console.error(err);
        }
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.headerContainer}>
                <h1 style={styles.headerTitle}>Mis Asignaciones</h1>
                <p style={styles.headerSubtitle}>
                    Brigadista: <strong>{usuario?.username || usuario?.nombre}</strong> — {asignaciones.filter(a => a.estado === 'EN_PROCESO').length} activas
                </p>
            </div>

            {exito && <div style={styles.successAlert}>Estado actualizado correctamente</div>}
            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

            {cargando && <p style={{ textAlign: 'center', padding: '1rem' }}>Cargando asignaciones...</p>}

            {!cargando && asignaciones.length === 0 && (
                <div style={styles.noAsignacionesContainer}>
                    <p style={styles.noAsignacionesText}>No tienes asignaciones activas.</p>
                </div>
            )}

            <div style={styles.cardsGrid}>
                {asignaciones.map((a) => (
                    <div key={a.id} style={styles.card(a.nivel || a.nivelRiesgo)}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>{a.titulo}</h2>
                            <span style={styles.cardLevelBadge(a.nivel || a.nivelRiesgo)}>
                                {a.nivel || a.nivelRiesgo}
                            </span>
                        </div>

                        <p style={styles.cardDescription}>{a.descripcion}</p>

                        <div style={styles.cardMeta}>
                            <span>{a.fechaCreacion || a.fecha}</span>
                            <span>{a.latitud || a.lat}, {a.longitud || a.lng}</span>
                        </div>

                        <div style={styles.cardFooter}>
                            <span style={styles.cardStatusBadge(a.estado)}>
                                {a.estado?.replace('_', ' ')}
                            </span>
                            <div style={styles.cardActions}>
                                {estadosSiguientes[a.estado]?.map(siguiente => (
                                    <button
                                        key={siguiente}
                                        onClick={() => cambiarEstado(a.reporteId, siguiente)}
                                        style={styles.actionButton(siguiente)}
                                    >
                                        {siguiente.replace('_', ' ')}
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