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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const parseCoords = (valor) => {
    if (!valor) return null;
    if (Array.isArray(valor)) return valor;
    try { return JSON.parse(valor); } catch { return null; }
};

export default function MapaIncendios() {
    const { usuario } = useAuth();
    const [centro, setCentro]                           = useState([-33.4944, -70.6170]);
    const [reportes, setReportes]                       = useState([]);
    const [brigadas, setBrigadas]                       = useState([]);
    const [zonas, setZonas]                             = useState([]);
    const [rutas, setRutas]                             = useState([]);
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
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#1e1e2e', color: '#fff', borderRadius: '14px',
                        padding: '32px', minWidth: '340px', maxWidth: '480px',
                        position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                    }}>
                        <button onClick={() => setReporteSeleccionado(null)} style={{
                            position: 'absolute', top: '12px', right: '16px',
                            background: 'none', border: 'none', color: '#fff',
                            fontSize: '20px', cursor: 'pointer'
                        }}>✕</button>
                        <h2 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
                            🔥 {reporteSeleccionado.titulo}
                        </h2>
                        <p><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>
                        <p><strong>Nivel de riesgo:</strong> {reporteSeleccionado.nivelRiesgo}</p>
                        <p><strong>Estado:</strong> {reporteSeleccionado.estado}</p>
                        <p><strong>Coordenadas:</strong> {reporteSeleccionado.latitud}, {reporteSeleccionado.longitud}</p>
                        <p><strong>Fecha:</strong> {reporteSeleccionado.fechaCreacion
                            ? new Date(reporteSeleccionado.fechaCreacion).toLocaleString('es-CL')
                            : 'Sin fecha'}
                        </p>
                    </div>
                </div>
            )}

            <FooterComponent />
        </div>
    );
}