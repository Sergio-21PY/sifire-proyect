import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline } from 'react-leaflet';
import FooterComponent from '../components/FooterComponent';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import * as styles from '../styles/Monitoreo.styles';

// --- Configuración de Iconos de Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// --- Datos Mock (simulados) ---
const reportesMock = [
  { id: 1, lat: -30.692, lng: -70.962, nivel: 'alto',     titulo: 'Incendio Sector Carén' },
  { id: 2, lat: -30.701, lng: -70.948, nivel: 'medio',    titulo: 'Columna de humo Cerro Las Ramadas' },
  { id: 3, lat: -30.685, lng: -70.971, nivel: 'bajo',     titulo: 'Foco menor El Maitén' },
  { id: 4, lat: -30.710, lng: -70.955, nivel: 'resuelto', titulo: 'Incendio Resuelto Sector Ponio' },
];

const brigadasMock = [
  { id: 1, lat: -30.688, lng: -70.950, nombre: 'Brigada Carén',     tipo: 'FORESTAL', disponible: true  },
  { id: 2, lat: -30.705, lng: -70.965, nombre: 'Brigada El Maitén', tipo: 'URBANA',   disponible: true  },
  { id: 3, lat: -30.712, lng: -70.942, nombre: 'Brigada Ponio',     tipo: 'MIXTA',    disponible: false },
];

const zonasMock = [
  { id: 1, nombre: 'Sector Carén', nivel: 'ALTO', coords: [[-30.688, -70.968], [-30.688, -70.957], [-30.696, -70.957], [-30.696, -70.968]] },
  { id: 2, nombre: 'Cerro Las Ramadas', nivel: 'MEDIO', coords: [[-30.697, -70.954], [-30.697, -70.944], [-30.705, -70.944], [-30.705, -70.954]] },
  { id: 3, nombre: 'Sector El Maitén', nivel: 'BAJO', coords: [[-30.681, -70.977], [-30.681, -70.966], [-30.689, -70.966], [-30.689, -70.977]] },
];

const rutasMock = [
  { id: 1, nombre: 'Ruta Evacuación Norte', puntos: [[-30.692, -70.962], [-30.685, -70.955], [-30.678, -70.948]] },
  { id: 2, nombre: 'Ruta Evacuación Sur', puntos: [[-30.710, -70.955], [-30.718, -70.948], [-30.725, -70.940]] },
];

const leyendaItems = [
  { color: styles.coloresPorNivel.alto, label: 'Foco Alto / Zona Alto' },
  { color: styles.coloresPorNivel.medio, label: 'Foco Medio / Zona Medio' },
  { color: styles.coloresPorNivel.bajo, label: 'Foco Bajo / Zona Bajo' },
  { color: styles.coloresPorNivel.resuelto, label: 'Resuelto' },
];

export default function MapaIncendios() {
  return (
    <div style={styles.mainContainer}>
      {/* Leyenda */}
      <div style={styles.leyendaContainer}>
        <p style={styles.leyendaTitle}>Leyenda</p>
        {leyendaItems.map(item => (
          <div key={item.label} style={styles.leyendaItem}>
            <span style={styles.leyendaColorBox(item.color)} />
            <span style={styles.leyendaLabel}>{item.label}</span>
          </div>
        ))}
        <div style={styles.leyendaItem}>
          <span>🚒</span><span style={styles.leyendaLabel}>Brigada activa</span>
        </div>
        <div style={styles.leyendaItem}>
          <span style={styles.leyendaRuta} />
          <span style={styles.leyendaLabel}>Ruta evacuación</span>
        </div>
      </div>

      <MapContainer center={[-30.695, -70.958]} zoom={13} style={styles.map}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Zonas de riesgo — polígonos */}
        {zonasMock.map(zona => (
          <Polygon key={`zona-${zona.id}`} positions={zona.coords} pathOptions={styles.zonaPathOptions(zona.nivel)}>
            <Popup><strong>{zona.nombre}</strong><br />Zona de riesgo: {zona.nivel}</Popup>
          </Polygon>
        ))}

        {/* Rutas de evacuación — líneas azules */}
        {rutasMock.map(ruta => (
          <Polyline key={`ruta-${ruta.id}`} positions={ruta.puntos} pathOptions={styles.rutaPathOptions}>
            <Popup><strong>{ruta.nombre}</strong></Popup>
          </Polyline>
        ))}

        {/* Focos de incendio — círculo + marcador */}
        {reportesMock.map((reporte) => (
          <React.Fragment key={reporte.id}>
            <Circle center={[reporte.lat, reporte.lng]} radius={300} pathOptions={styles.focoCirclePathOptions(reporte.nivel)} />
            <Marker position={[reporte.lat, reporte.lng]}>
              <Popup><strong>{reporte.titulo}</strong><br />Nivel: {reporte.nivel}</Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Brigadas activas — ícono */}
        {brigadasMock.map(b => (
          <Marker key={`brigada-${b.id}`} position={[b.lat, b.lng]} icon={styles.iconoBrigada}>
            <Popup><strong>{b.nombre}</strong><br />Tipo: {b.tipo}<br />Estado: {b.disponible ? '✅ Disponible' : '🔴 En operación'}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <FooterComponent />
    </div>
  );
}
