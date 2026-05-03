import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listarReportes } from '../services/reporte.service';
import { listarBrigadas, crearAsignacion } from '../services/monitoreo.service';
import { cambiarEstadoReporte } from '../services/reporte.service';
import * as styles from '../styles/Dashboard.styles';

const nivelColor = n => ({ CRITICO:'#dc2626', ALTO:'#f97316', MEDIO:'#d97706', BAJO:'#16a34a' }[n] || '#64748b');
const estadoColor = e => ({ PENDIENTE:'#d97706', EN_PROCESO:'#3b82f6', RESUELTO:'#16a34a', DESCARTADO:'#64748b' }[e] || '#64748b');
const fmt = d => d ? new Date(d).toLocaleDateString('es-CL') : '—';

export default function Dashboard() {
    const { usuario } = useAuth();
    const [reportes, setReportes]   = useState([]);
    const [brigadas, setBrigadas]   = useState([]);
    const [cargando, setCargando]   = useState(true);
    const [modal, setModal]         = useState(null);
    const [brigadaId, setBrigadaId] = useState('');
    const [filtro, setFiltro]       = useState('TODOS');
    const [exito, setExito]         = useState(false);

    const cargar = async () => {
        try {
            const [data, b] = await Promise.all([listarReportes(), listarBrigadas()]);
            setReportes(data);
            setBrigadas(b);
        } catch (err) {
            console.error('Error al cargar el dashboard:', err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
        const intervalo = setInterval(cargar, 10000);
        return () => clearInterval(intervalo);
    }, []);

    const total        = reportes.length;
    const pendientes   = reportes.filter(r => r.estado === 'PENDIENTE').length;
    const enProceso    = reportes.filter(r => r.estado === 'EN_PROCESO').length;
    const resueltos    = reportes.filter(r => r.estado === 'RESUELTO').length;
    const descartados  = reportes.filter(r => r.estado === 'DESCARTADO').length;
    const brigadasDisp = brigadas.filter(b => b.estado === 'DISPONIBLE').length;
    const brigadasOp   = brigadas.filter(b => b.estado === 'EN_CAMINO' || b.estado === 'INTERVINIENDO').length;
    const criticos     = reportes.filter(r => (r.nivelRiesgo || r.nivel) === 'CRITICO').length;
    const altos        = reportes.filter(r => (r.nivelRiesgo || r.nivel) === 'ALTO').length;

    const reportesFiltrados = filtro === 'TODOS'
        ? reportes
        : reportes.filter(r => r.estado === filtro);

    const asignar = async () => {
        if (!brigadaId) return;
        try {
            await crearAsignacion({ reporteId: modal, brigadaId: Number(brigadaId) });
            await cambiarEstadoReporte(modal, 'EN_PROCESO');
            await cargar();
            setModal(null); setBrigadaId('');
            setExito(true); setTimeout(() => setExito(false), 3000);
        } catch (err) { alert('❌ ' + err.message); }
    };

    return (
        <div style={styles.mainContainer}>

            {/* Header */}
            <div style={{ ...styles.headerContainer, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                    <h1 style={styles.headerTitle}>🏛️ Panel de Control SIFIRE</h1>
                    <p style={styles.headerSubtitle}>
                        Bienvenido, <strong>{usuario?.nombre || usuario?.username}</strong> — {usuario?.tipo}
                    </p>
                </div>
                <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
                    {pendientes > 0 && (
                        <span style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius: 8, padding:'6px 12px', fontSize:13, fontWeight:700, color:'#dc2626' }}>
                            🔴 {pendientes} reporte{pendientes > 1 ? 's' : ''} pendiente{pendientes > 1 ? 's' : ''}
                        </span>
                    )}
                    {exito && (
                        <span style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'6px 12px', fontSize:13, color:'#16a34a', fontWeight:700 }}>
                            ✓ Brigada asignada
                        </span>
                    )}
                </div>
            </div>

            {/* KPIs */}
            <div style={styles.kpiGrid}>
                <div style={styles.kpiCard('#dc2626')}>
                    <div style={styles.kpiIcon}>🔥</div>
                    <div style={styles.kpiValue('#dc2626')}>{pendientes}</div>
                    <div style={styles.kpiLabel}>Pendientes</div>
                    <div style={{ fontSize:'0.8rem', color:'#dc2626', marginTop:4 }}>
                        {criticos > 0 ? `⚠ ${criticos} crítico${criticos>1?'s':''}` : '✓ Sin críticos'}
                    </div>
                </div>
                <div style={styles.kpiCard('#3b82f6')}>
                    <div style={styles.kpiIcon}>🔄</div>
                    <div style={styles.kpiValue('#3b82f6')}>{enProceso}</div>
                    <div style={styles.kpiLabel}>En Proceso</div>
                    <div style={{ fontSize:'0.8rem', color:'#64748b', marginTop:4 }}>{brigadasOp} brigada{brigadasOp!==1?'s':''} operando</div>
                </div>
                <div style={styles.kpiCard('#16a34a')}>
                    <div style={styles.kpiIcon}>✅</div>
                    <div style={styles.kpiValue('#16a34a')}>{resueltos}</div>
                    <div style={styles.kpiLabel}>Resueltos</div>
                    <div style={{ fontSize:'0.8rem', color:'#64748b', marginTop:4 }}>{descartados} descartados</div>
                </div>
                <div style={styles.kpiCard('#d97706')}>
                    <div style={styles.kpiIcon}>🚒</div>
                    <div style={styles.kpiValue('#d97706')}>{brigadasDisp}</div>
                    <div style={styles.kpiLabel}>Brigadas Disponibles</div>
                    <div style={{ fontSize:'0.8rem', color:'#64748b', marginTop:4 }}>de {brigadas.length} en total</div>
                </div>
            </div>

            {/* Fila: distribución + tabla */}
            <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:'1.5rem' }}>

                {/* Panel distribución */}
                <div style={{ background:'#fff', borderRadius:12, padding:'1.2rem', boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:'1px solid #e2e8f0' }}>
                    <h3 style={{ margin:'0 0 1rem', fontSize:'0.85rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.05em' }}>
                        Resumen del sistema
                    </h3>

                    <p style={{ fontSize:'0.75rem', color:'#94a3b8', margin:'0 0 6px', fontWeight:600, textTransform:'uppercase' }}>Por estado</p>
                    {[
                        { label:'Pendientes',  valor:pendientes,  total, color:'#dc2626' },
                        { label:'En Proceso',  valor:enProceso,   total, color:'#3b82f6' },
                        { label:'Resueltos',   valor:resueltos,   total, color:'#16a34a' },
                        { label:'Descartados', valor:descartados, total, color:'#94a3b8' },
                    ].map(({ label, valor, color }) => {
                        const pct = total > 0 ? Math.round((valor/total)*100) : 0;
                        return (
                            <div key={label} style={{ marginBottom:10 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                                    <span style={{ fontSize:12, color:'#64748b' }}>{label}</span>
                                    <span style={{ fontSize:12, fontWeight:700, color }}>{valor} ({pct}%)</span>
                                </div>
                                <div style={{ height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99 }} />
                                </div>
                            </div>
                        );
                    })}

                    <hr style={{ border:'none', borderTop:'1px solid #e2e8f0', margin:'12px 0' }} />

                    <p style={{ fontSize:'0.75rem', color:'#94a3b8', margin:'0 0 6px', fontWeight:600, textTransform:'uppercase' }}>Por nivel</p>
                    {[
                        { label:'Crítico', valor:criticos, color:'#dc2626' },
                        { label:'Alto',    valor:altos,    color:'#f97316' },
                        { label:'Medio',   valor:reportes.filter(r=>(r.nivelRiesgo||r.nivel)==='MEDIO').length, color:'#d97706' },
                        { label:'Bajo',    valor:reportes.filter(r=>(r.nivelRiesgo||r.nivel)==='BAJO').length,  color:'#16a34a' },
                    ].map(({ label, valor, color }) => {
                        const pct = total > 0 ? Math.round((valor/total)*100) : 0;
                        return (
                            <div key={label} style={{ marginBottom:10 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                                    <span style={{ fontSize:12, color:'#64748b' }}>{label}</span>
                                    <span style={{ fontSize:12, fontWeight:700, color }}>{valor} ({pct}%)</span>
                                </div>
                                <div style={{ height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99 }} />
                                </div>
                            </div>
                        );
                    })}

                    <hr style={{ border:'none', borderTop:'1px solid #e2e8f0', margin:'12px 0' }} />

                    <p style={{ fontSize:'0.75rem', color:'#94a3b8', margin:'0 0 8px', fontWeight:600, textTransform:'uppercase' }}>Brigadas</p>
                    {brigadas.length === 0
                        ? <p style={{ fontSize:12, color:'#94a3b8' }}>Sin brigadas registradas</p>
                        : brigadas.slice(0,4).map(b => (
                            <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                                <span style={{ fontSize:12, color:'#334155', fontWeight:500 }}>{b.nombre}</span>
                                <span style={{
                                    fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4,
                                    background: b.estado==='DISPONIBLE' ? '#dcfce7' : b.estado==='EN_CAMINO' ? '#dbeafe' : '#fef3c7',
                                    color:      b.estado==='DISPONIBLE' ? '#16a34a' : b.estado==='EN_CAMINO' ? '#3b82f6' : '#d97706',
                                }}>
                                    {b.estado}
                                </span>
                            </div>
                        ))
                    }

                    <hr style={{ border:'none', borderTop:'1px solid #e2e8f0', margin:'12px 0' }} />

                    <p style={{ fontSize:'0.75rem', color:'#94a3b8', margin:'0 0 8px', fontWeight:600, textTransform:'uppercase' }}>🏘 Comunas más afectadas</p>
                    {(() => {
                        const porComuna = reportes
                            .filter(r => r.comuna)
                            .reduce((acc, r) => {
                                acc[r.comuna] = (acc[r.comuna] || 0) + 1;
                                return acc;
                            }, {});
                        const ranking = Object.entries(porComuna)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 4);
                        const maxVal = ranking[0]?.[1] || 1;

                        return ranking.length === 0
                            ? <p style={{ fontSize:12, color:'#94a3b8' }}>Sin datos de comuna aún</p>
                            : ranking.map(([comuna, cant], i) => (
                                <div key={comuna} style={{ marginBottom:10 }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                                        <span style={{ fontSize:12, color:'#334155', fontWeight: i===0 ? 700 : 400 }}>
                                            {i===0 ? '🔥 ' : ''}{comuna}
                                        </span>
                                        <span style={{ fontSize:12, fontWeight:700, color: i===0 ? '#dc2626' : '#64748b' }}>
                                            {cant} reporte{cant>1?'s':''}
                                        </span>
                                    </div>
                                    <div style={{ height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                        <div style={{
                                            height:'100%', borderRadius:99,
                                            width:`${Math.round((cant/maxVal)*100)}%`,
                                            background: i===0 ? '#dc2626' : i===1 ? '#f97316' : '#d97706',
                                        }} />
                                    </div>
                                </div>
                            ));
                    })()}
                </div>

                {/* Tabla reportes */}
                <div style={styles.tableWrapper}>
                    <div style={{ ...styles.tableHeader, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <h2 style={styles.tableTitle}>Reportes de Incendio</h2>
                        <div style={{ display:'flex', gap:6 }}>
                            {['TODOS','PENDIENTE','EN_PROCESO','RESUELTO'].map(f => (
                                <button key={f} onClick={() => setFiltro(f)} style={{
                                    padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:600,
                                    border: `1px solid ${filtro===f ? '#f97316' : '#e2e8f0'}`,
                                    background: filtro===f ? '#f97316' : '#fff',
                                    color: filtro===f ? '#fff' : '#64748b',
                                }}>
                                    {f === 'TODOS' ? 'Todos' : f.replace('_',' ')}
                                    {f !== 'TODOS' && ` (${reportes.filter(r=>r.estado===f).length})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {cargando ? (
                        <p style={{ textAlign:'center', padding:'2rem', color:'#64748b' }}>Cargando...</p>
                    ) : reportesFiltrados.length === 0 ? (
                        <p style={{ textAlign:'center', padding:'2rem', color:'#94a3b8' }}>Sin reportes para mostrar.</p>
                    ) : (
                        <div style={{ overflowY:'auto', maxHeight:420 }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeadRow}>
                                        {['#','Título','Nivel','Estado','Fecha','Acción'].map(h => (
                                            <th key={h} style={styles.tableHeadCell}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportesFiltrados.map(r => (
                                        <tr key={r.id} style={styles.tableBodyRow}>
                                            <td style={styles.tableCellId}>#{r.id}</td>
                                            <td style={styles.tableCellTitle}>
                                                {r.titulo}
                                                <div style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:2 }}>{r.tipoReportante || '—'}</div>
                                            </td>
                                            <td style={styles.tableCell}>
                                                <span style={{ color: nivelColor(r.nivelRiesgo||r.nivel), fontWeight:700, fontSize:'0.8rem' }}>
                                                    ● {r.nivelRiesgo || r.nivel || '—'}
                                                </span>
                                            </td>
                                            <td style={styles.tableCell}>
                                                <span style={{
                                                    background: estadoColor(r.estado) + '20',
                                                    color: estadoColor(r.estado),
                                                    border: `1px solid ${estadoColor(r.estado)}40`,
                                                    padding:'2px 8px', borderRadius:6, fontSize:'0.78rem', fontWeight:700,
                                                }}>
                                                    {(r.estado||'').replace('_',' ')}
                                                </span>
                                            </td>
                                            <td style={styles.tableCell}>{fmt(r.fechaCreacion)}</td>
                                            <td style={styles.tableCell}>
                                                {r.estado === 'PENDIENTE' && (
                                                    <button onClick={() => { setModal(r.id); setBrigadaId(''); }}
                                                        style={{ padding:'4px 10px', background:'#eff6ff', color:'#3b82f6', border:'1px solid #bfdbfe', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:600 }}>
                                                        🚒 Asignar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal asignar */}
            {modal && (
                <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
                    <div style={{ background:'#fff', padding:'2rem', borderRadius:12, minWidth:320, maxWidth:400, boxShadow:'0 10px 40px rgba(0,0,0,.2)' }}>
                        <h3 style={{ margin:'0 0 8px', fontSize:16 }}>Asignar brigada al reporte #{modal}</h3>
                        <p style={{ margin:'0 0 16px', fontSize:13, color:'#64748b' }}>Selecciona una brigada disponible para atender este incendio.</p>
                        <select value={brigadaId} onChange={e => setBrigadaId(e.target.value)}
                            style={{ width:'100%', padding:'8px', marginBottom:'1rem', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13 }}>
                            <option value="">-- Selecciona una brigada --</option>
                            {brigadas.filter(b => b.estado === 'DISPONIBLE').map(b => (
                                <option key={b.id} value={b.id}>{b.nombre} — {b.tipo}</option>
                            ))}
                        </select>
                        {brigadas.filter(b => b.estado === 'DISPONIBLE').length === 0 && (
                            <p style={{ fontSize:12, color:'#d97706', background:'#fffbeb', padding:'8px', borderRadius:6, border:'1px solid #fde68a', marginBottom:12 }}>
                                ⚠ No hay brigadas disponibles ahora.
                            </p>
                        )}
                        <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end' }}>
                            <button onClick={() => setModal(null)} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', cursor:'pointer', fontSize:13 }}>Cancelar</button>
                            <button onClick={asignar} disabled={!brigadaId}
                                style={{ padding:'6px 14px', background: brigadaId ? '#16a34a' : '#e2e8f0', color:'#fff', border:'none', borderRadius:8, cursor: brigadaId ? 'pointer':'default', fontSize:13, fontWeight:600 }}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}