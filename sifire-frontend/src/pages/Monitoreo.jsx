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
// Coordenadas de referencia en Santiago:
// Duoc UC San Joaquin (aprox.) e INACAP sector Camino Agricola (aprox.)
const puntosReferencia = {
  duocSanJoaquin: { lat: -33.4969, lng: -70.6168 },
  inacapAgricola: { lat: -33.4918, lng: -70.6172 },
};

navigator.geolocation.getCurrentPosition((pos) => {
  setCenter([pos.coords.latitude, pos.coords.longitude])
});

const centroMapa = [
  (puntosReferencia.duocSanJoaquin.lat + puntosReferencia.inacapAgricola.lat) / 2,
  (puntosReferencia.duocSanJoaquin.lng + puntosReferencia.inacapAgricola.lng) / 2,
];

const reportesMock = [
  { id: 1, lat: -33.4969, lng: -70.6168, titulo: 'Incendio en Duoc San Joaquin', nivel: 'ALTO' },
  { id: 2, lat: -33.4945, lng: -70.6170, titulo: 'Incendio intermedio en Camino Agricola', nivel: 'MEDIO' },
  { id: 3, lat: -33.4918, lng: -70.6172, titulo: 'Incendio en Inacap de Agricola', nivel: 'BAJO' },
];

const brigadasMock = [
  { id: 1, nombre: 'Brigada A', lat: -33.4963, lng: -70.6169, tipo: 'Terrestre', disponible: false },
  { id: 2, nombre: 'Brigada B', lat: -33.4923, lng: -70.6171, tipo: 'Aérea', disponible: true }
];

// const zonasMock = [
//   { id: 1, nombre: 'Sector Carén', nivel: 'ALTO', coords: [[-30.688, -70.968], [-30.688, -70.957], [-30.696, -70.957], [-30.696, -70.968]] },
//   { id: 2, nombre: 'Cerro Las Ramadas', nivel: 'MEDIO', coords: [[-30.697, -70.954], [-30.697, -70.944], [-30.705, -70.944], [-30.705, -70.954]] },
//   { id: 3, nombre: 'Sector El Maitén', nivel: 'BAJO', coords: [[-30.681, -70.977], [-30.681, -70.966], [-30.689, -70.966], [-30.689, -70.977]] },
// ];

const zonasMock = [
  { id: 1, nombre: 'Duoc San Joaquin', nivel: 'ALTO', coords: [[-33.4976, -70.6173], [-33.4976, -70.6163], [-33.4962, -70.6163], [-33.4962, -70.6173]] },
  { id: 2, nombre: 'Tramo intermedio Agricola', nivel: 'MEDIO', coords: [[-33.4952, -70.6173], [-33.4952, -70.6165], [-33.4938, -70.6165], [-33.4938, -70.6173]] },
  { id: 3, nombre: 'Inacap de Agricola', nivel: 'BAJO', coords: [[-33.4925, -70.6176], [-33.4925, -70.6168], [-33.4913, -70.6168], [-33.4913, -70.6176]] },
];

const rutasMock = [
  {
    id: 1,
    nombre: 'Ruta Evacuacion Principal',
    puntos: [
      [puntosReferencia.duocSanJoaquin.lat, puntosReferencia.duocSanJoaquin.lng],
      [-33.4953, -70.6169],
      [-33.4939, -70.6171],
      [puntosReferencia.inacapAgricola.lat, puntosReferencia.inacapAgricola.lng],
    ],
  }
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

      <MapContainer center={[-33.4897, -70.6408]} zoom={15} style={styles.map}>
        
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
