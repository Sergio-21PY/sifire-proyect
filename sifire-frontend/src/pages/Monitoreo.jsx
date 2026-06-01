import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Polygon, Polyline, Popup } from 'react-leaflet';
import FooterComponent from '../components/FooterComponent';
import { useAuth } from '../context/AuthContext';
import { listarZonas, listarBrigadas, listarRutas } from '../services/monitoreo.service';
import { listarReportes } from '../services/reporte.service';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import * as styles from '../styles/Monitoreo.styles';

const PULSE_CSS = `
@keyframes foco-pulso {
  0%   { stroke-opacity: 0.85; stroke-width: 2; }
  50%  { stroke-opacity: 0.25; stroke-width: 6; }
  100% { stroke-opacity: 0.85; stroke-width: 2; }
}
.foco-activo { animation: foco-pulso 2.2s ease-in-out infinite; }
.foco-resuelto { opacity: 0.7; }
`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const parseCoords = (valor) => {
    if (!valor) return null;
    if (Array.isArray(valor)) return valor;
    try { return JSON.parse(valor); } catch { return null; }
};

export default function MapaIncendios() {
    const { usuario } = useAuth();
    const [centro, setCentro] = useState([-33.4944, -70.6170]);
    const [reportes, setReportes] = useState([]);
    const [brigadas, setBrigadas] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

    const esFuncionario = usuario?.tipo === 'FUNCIONARIO';
    const esBrigadista  = usuario?.tipo === 'BRIGADISTA';

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setCentro([pos.coords.latitude, pos.coords.longitude]),
            (err) => console.warn('Usando centro por defecto', err),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    const cargarDatos = async () => {
        try {
            const [dataReportes, dataBrigadas, dataZonas, dataRutas] = await Promise.all([
                listarReportes(),
                listarBrigadas(),
                listarZonas(),
                listarRutas().catch(() => []),
            ]);
            setReportes(dataReportes.filter(r => r.latitud && r.longitud));
            setBrigadas(dataBrigadas);
            setZonas(dataZonas);
            setRutas(dataRutas);
        } catch (err) {
            console.error('Error al cargar datos del mapa:', err);
        }
    };

    useEffect(() => {
        cargarDatos();
        const intervalo = setInterval(cargarDatos, 10000);
        return () => clearInterval(intervalo);
    }, []);

    const leyendaItems = [
        { color: styles.coloresPorNivel.alto,     label: 'Foco Alto'  },
        { color: styles.coloresPorNivel.medio,    label: 'Foco Medio' },
        { color: styles.coloresPorNivel.bajo,     label: 'Foco Bajo'  },
        { color: styles.coloresPorNivel.resuelto, label: 'Resuelto'   },
    ];

    return (
        <div style={styles.mainContainer}>
            <style>{PULSE_CSS}</style>

            <div style={styles.leyendaContainer}>
                <p style={styles.leyendaTitle}>
                    Mapa en vivo — <span style={{ fontWeight: 400 }}>{usuario?.username || usuario?.nombre}</span>
                </p>
                {leyendaItems.map(item => (
                    <div key={item.label} style={styles.leyendaItem}>
                        <span style={styles.leyendaColorBox(item.color)} />
                        <span style={styles.leyendaLabel}>{item.label}</span>
                    </div>
                ))}
                {(esFuncionario || esBrigadista) && (
                    <div style={styles.leyendaItem}>
                        <span style={{ fontSize: '16px' }}>🚒</span>
                        <span style={styles.leyendaLabel}>Brigada activa</span>
                    </div>
                )}
                {esFuncionario && (
                    <div style={styles.leyendaItem}>
                        <span style={styles.leyendaRuta} />
                        <span style={styles.leyendaLabel}>Ruta evacuación</span>
                    </div>
                )}
            </div>

            <MapContainer center={centro} zoom={15} style={styles.map}>
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="&copy; Esri"
                />
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    attribution="&copy; Esri"
                />

                {esFuncionario && zonas.map(zona => {
                    const positions = parseCoords(zona.coordenadas || zona.coords);
                    if (!positions) return null;
                    return (
                        <Polygon key={`zona-${zona.id}`} positions={positions} pathOptions={styles.zonaPathOptions(zona.nivel || zona.nivelRiesgo)}>
                            <Popup><strong>{zona.nombre}</strong><br />Zona de riesgo: {zona.nivel || zona.nivelRiesgo}</Popup>
                        </Polygon>
                    );
                })}

                {esFuncionario && rutas.map(ruta => {
                    const positions = parseCoords(ruta.trazado || ruta.puntos);
                    if (!positions) return null;
                    return (
                        <Polyline key={`ruta-${ruta.id}`} positions={positions} pathOptions={styles.rutaPathOptions}>
                            <Popup><strong>{ruta.nombre}</strong>{ruta.descripcion && <><br />{ruta.descripcion}</>}</Popup>
                        </Polyline>
                    );
                })}

                {reportes.map((reporte) => (
                    <React.Fragment key={reporte.id}>
                        <Circle
                            center={[reporte.latitud, reporte.longitud]}
                            radius={300}
                            pathOptions={styles.focoCirclePathOptions(reporte.nivelRiesgo || reporte.nivel, reporte.estado)}
                        />
                        <Marker
                            position={[reporte.latitud, reporte.longitud]}
                            icon={styles.iconoFoco(reporte.nivelRiesgo || reporte.nivel, reporte.estado)}
                            eventHandlers={{ click: () => setReporteSeleccionado(reporte) }}
                        />
                    </React.Fragment>
                ))}

                {(esFuncionario || esBrigadista) && brigadas.map(b => (
                    b.latitud && b.longitud ? (
                        <Marker key={`brigada-${b.id}`} position={[b.latitud, b.longitud]} icon={styles.iconoBrigada}>
                            <Popup>
                                <strong>{b.nombre}</strong><br />
                                Tipo: {b.tipo}<br />
                                Estado: {b.estado}
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>

            {reporteSeleccionado && (
                <div
                    onClick={() => setReporteSeleccionado(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)', zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(145deg,#0f172a,#1e293b)',
                            color: '#f1f5f9', borderRadius: '18px',
                            padding: '28px 32px', minWidth: '340px', maxWidth: '480px', width: '90%',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <button
                            onClick={() => setReporteSeleccionado(null)}
                            style={{
                                position: 'absolute', top: '14px', right: '16px',
                                background: 'rgba(255,255,255,0.07)', border: 'none',
                                color: '#94a3b8', fontSize: '16px', cursor: 'pointer',
                                width: '28px', height: '28px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >✕</button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <span style={{ fontSize: '26px' }}>
                                {(reporteSeleccionado.estado === 'RESUELTO' || reporteSeleccionado.estado === 'DESCARTADO') ? '✅' : '🔥'}
                            </span>
                            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
                                {reporteSeleccionado.titulo}
                            </h2>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <span style={styles.badgeNivel(reporteSeleccionado.nivelRiesgo || reporteSeleccionado.nivel, reporteSeleccionado.estado)}>
                                {reporteSeleccionado.nivelRiesgo || reporteSeleccionado.nivel || 'Sin nivel'}
                            </span>
                            <span style={styles.badgeEstado(reporteSeleccionado.estado)}>
                                {reporteSeleccionado.estado || 'Desconocido'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                            {reporteSeleccionado.descripcion && (
                                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 14px' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Descripción</span>
                                    <p style={{ margin: '4px 0 0', color: '#cbd5e1' }}>{reporteSeleccionado.descripcion}</p>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 14px' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Coordenadas</span>
                                    <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: '0.82rem' }}>
                                        {Number(reporteSeleccionado.latitud).toFixed(5)}, {Number(reporteSeleccionado.longitud).toFixed(5)}
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 14px' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fecha</span>
                                    <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: '0.82rem' }}>
                                        {reporteSeleccionado.fechaCreacion
                                            ? new Date(reporteSeleccionado.fechaCreacion).toLocaleString('es-CL')
                                            : 'Sin fecha'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <FooterComponent />
        </div>
    );
}