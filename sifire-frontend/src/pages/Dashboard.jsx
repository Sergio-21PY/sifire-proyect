import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listarReportes } from '../services/reporte.service';
import * as styles from '../styles/Dashboard.styles';

const API_MONITOREO = 'http://localhost:8083';

export default function Dashboard() {
    const { usuario } = useAuth();
    const [reportes, setReportes] = useState([]);
    const [brigadas, setBrigadas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modal, setModal] = useState(null); // reporteId seleccionado
    const [brigadaId, setBrigadaId] = useState('');
    const [kpis, setKpis] = useState([
        { label: 'Reportes Activos', valor: 0, color: '#ef4444', icono: '🔥' },
        { label: 'En Proceso', valor: 0, color: '#f97316', icono: '🔄' },
        { label: 'Brigadas Activas', valor: 0, color: '#3b82f6', icono: '🚒' },
        { label: 'Controlados Hoy', valor: 0, color: '#22c55e', icono: '✔️' },
    ]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await listarReportes();
                setReportes(data.slice(0, 5));
                setKpis([
                    { label: 'Reportes Activos', valor: data.filter(r => r.estado === 'PENDIENTE').length, color: '#ef4444', icono: '🔥' },
                    { label: 'En Proceso', valor: data.filter(r => r.estado === 'EN_PROCESO').length, color: '#f97316', icono: '🔄' },
                    { label: 'Brigadas Activas', valor: 0, color: '#3b82f6', icono: '🚒' },
                    { label: 'Controlados Hoy', valor: data.filter(r => r.estado === 'CONTROLADO').length, color: '#22c55e', icono: '✔️' },
                ]);

                // Cargar brigadas desde ms-monitoreo
                const res = await fetch(`${API_MONITOREO}/api/brigadas`);
                const b = await res.json();
                setBrigadas(b);
            } catch (err) {
                console.error('Error al cargar el dashboard:', err);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const asignarBrigada = async () => {
        if (!brigadaId) return alert('Selecciona una brigada');
        try {
            const res = await fetch(`${API_MONITOREO}/api/asignaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reporteId: modal, brigadaId: Number(brigadaId) }),
            });
            if (!res.ok) throw new Error('Error al asignar');

            // Actualizar estado del reporte en ms-reportes vía BFF
            await fetch(`http://localhost:8080/bff/reportes/${modal}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'EN_PROCESO' }),
            });

            // Actualizar la lista local sin recargar
            setReportes(prev => prev.map(r =>
                r.id === modal ? { ...r, estado: 'EN_PROCESO' } : r
            ));

            // Actualizar KPIs localmente
            setKpis(prev => prev.map(k => {
                if (k.label === 'Reportes Activos') return { ...k, valor: k.valor - 1 };
                if (k.label === 'En Proceso') return { ...k, valor: k.valor + 1 };
                return k;
            }));

            setModal(null);
            setBrigadaId('');
        } catch (err) {
            alert('❌ Error: ' + err.message);
        }
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.headerContainer}>
                <h1 style={styles.headerTitle}>🏛️ Panel de Control SIFIRE</h1>
                <p style={styles.headerSubtitle}>
                    Bienvenido, <strong>{usuario?.username || usuario?.nombre}</strong> — {usuario?.rol}
                </p>
            </div>

            <div style={styles.kpiGrid}>
                {kpis.map((kpi, i) => (
                    <div key={i} style={styles.kpiCard(kpi.color)}>
                        <div style={styles.kpiIcon}>{kpi.icono}</div>
                        <div style={styles.kpiValue(kpi.color)}>{kpi.valor}</div>
                        <div style={styles.kpiLabel}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            <div style={styles.tableWrapper}>
                <div style={styles.tableHeader}>
                    <h2 style={styles.tableTitle}>Reportes Recientes</h2>
                </div>
                {cargando ? (
                    <p style={{ textAlign: 'center', padding: '1rem' }}>Cargando...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeadRow}>
                                {['#', 'Titulo', 'Nivel', 'Estado', 'Fecha', 'Acción'].map(h => (
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
                                        <span style={styles.levelBadge(r.nivelRiesgo || r.nivel)}>
                                            ● {r.nivelRiesgo || r.nivel}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.statusBadge(r.estado)}>
                                            {r.estado?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>{r.fechaCreacion || r.fecha || r.hora}</td>
                                    <td style={styles.tableCell}>
                                        <button
                                            onClick={() => { setModal(r.id); setBrigadaId(''); }}
                                            style={{ padding: '4px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            🚒 Asignar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal asignar brigada */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', minWidth: '320px' }}>
                        <h3>Asignar brigada al reporte #{modal}</h3>
                        <select
                            value={brigadaId}
                            onChange={e => setBrigadaId(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Selecciona una brigada --</option>
                            {brigadas.map(b => (
                                <option key={b.id} value={b.id}>{b.nombre} ({b.estado})</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setModal(null)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={asignarBrigada} style={{ padding: '6px 14px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}