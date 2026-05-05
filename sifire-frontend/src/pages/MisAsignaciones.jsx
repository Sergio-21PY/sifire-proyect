import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { listarAsignaciones } from "../services/monitoreo.service";
import { cambiarEstadoReporte } from "../services/reporte.service";
import * as styles from '../styles/MisAsignaciones.styles';

const API_REPORTES = (import.meta.env.VITE_MS_REPORTES_URL || 'http://localhost:8082') + '/api/reportes';

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

                // Filtrar asignaciones activas (sin fechaFin)
                const activas = data.filter(a => !a.fechaFin);

                // Enriquecer cada asignacion con datos del reporte
                const enriquecidas = await Promise.all(
                    activas.map(async (a) => {
                        try {
                            const res = await fetch(`${API_REPORTES}/${a.reporteId}`);
                            if (!res.ok) return { ...a, _reporte: null };
                            const reporte = await res.json();
                            return { ...a, _reporte: reporte };
                        } catch {
                            return { ...a, _reporte: null };
                        }
                    })
                );

                // Deduplicar por reporteId
                const seen = new Set();
                const unicas = enriquecidas.filter(a => {
                    if (seen.has(a.reporteId)) return false;
                    seen.add(a.reporteId);
                    return true;
                });

                setAsignaciones(unicas);
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
                prev.map(a => a.reporteId === reporteId
                    ? { ...a, _reporte: { ...a._reporte, estado: nuevoEstado } }
                    : a
                )
            );
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch (err) {
            setError('No se pudo actualizar el estado');
            console.error(err);
        }
    };

    const activas = asignaciones.filter(a => a._reporte?.estado === 'EN_PROCESO');

    return (
        <div style={styles.mainContainer}>
            <div style={styles.headerContainer}>
                <h1 style={styles.headerTitle}>Mis Asignaciones</h1>
                <p style={styles.headerSubtitle}>
                    Brigadista: <strong>{usuario?.username || usuario?.nombre}</strong> — {activas.length} activas
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
                {asignaciones.map((a) => {
                    const r = a._reporte;
                    const nivelRiesgo = r?.nivelRiesgo ?? '—';
                    const estado      = r?.estado      ?? '—';
                    return (
                        <div key={a.id} style={styles.card(nivelRiesgo)}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.cardTitle}>{r?.titulo ?? `Reporte #${a.reporteId}`}</h2>
                                <span style={styles.cardLevelBadge(nivelRiesgo)}>
                                    {nivelRiesgo}
                                </span>
                            </div>

                            <p style={styles.cardDescription}>{r?.descripcion ?? 'Sin descripción'}</p>

                            <div style={styles.cardMeta}>
                                <span>{r?.fechaCreacion ? new Date(r.fechaCreacion).toLocaleDateString('es-CL') : '—'}</span>
                                <span>{r?.latitud ?? '—'}, {r?.longitud ?? '—'}</span>
                            </div>

                            <div style={styles.cardFooter}>
                                <span style={styles.cardStatusBadge(estado)}>
                                    {estado?.replace('_', ' ')}
                                </span>
                                <div style={styles.cardActions}>
                                    {estadosSiguientes[estado]?.map(siguiente => (
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
                    );
                })}
            </div>
        </div>
    );
}
