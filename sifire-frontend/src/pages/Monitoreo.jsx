import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline } from 'react-leaflet';
import FooterComponent from '../components/FooterComponent';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import * as styles from '../styles/Monitoreo.styles';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const puntosReferencia = {
  duocSanJoaquin: { lat: -33.4969, lng: -70.6168 },
  inacapAgricola: { lat: -33.4918, lng: -70.6172 },
};

const reportesMock = [
  { id: 1, lat: -33.4969, lng: -70.6168, titulo: 'Incendio en Duoc San Joaquin',          nivel: 'ALTO'  },
  { id: 2, lat: -33.4945, lng: -70.6170, titulo: 'Incendio intermedio en Camino Agricola', nivel: 'MEDIO' },
  { id: 3, lat: -33.4918, lng: -70.6172, titulo: 'Incendio en Inacap de Agricola',         nivel: 'BAJO'  },
];

const brigadasMock = [
  { id: 1, nombre: 'Brigada A', lat: -33.4963, lng: -70.6169, tipo: 'Terrestre', disponible: false },
  { id: 2, nombre: 'Brigada B', lat: -33.4923, lng: -70.6171, tipo: 'Aérea',     disponible: true  },
];

const zonasMock = [
  { id: 1, nombre: 'Duoc San Joaquin',          nivel: 'ALTO',  coords: [[-33.4976, -70.6173], [-33.4976, -70.6163], [-33.4962, -70.6163], [-33.4962, -70.6173]] },
  { id: 2, nombre: 'Tramo intermedio Agricola', nivel: 'MEDIO', coords: [[-33.4952, -70.6173], [-33.4952, -70.6165], [-33.4938, -70.6165], [-33.4938, -70.6173]] },
  { id: 3, nombre: 'Inacap de Agricola',        nivel: 'BAJO',  coords: [[-33.4925, -70.6176], [-33.4925, -70.6168], [-33.4913, -70.6168], [-33.4913, -70.6176]] },
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
  },
];

const leyendaItems = [
  { color: styles.coloresPorNivel.alto,     label: 'Foco Alto / Zona Alto'   },
  { color: styles.coloresPorNivel.medio,    label: 'Foco Medio / Zona Medio' },
  { color: styles.coloresPorNivel.bajo,     label: 'Foco Bajo / Zona Bajo'   },
  { color: styles.coloresPorNivel.resuelto, label: 'Resuelto'                },
];

export default function MapaIncendios() {
  // ✅ Fix 1: useState importado
  const [centro, setCentro] = useState([-33.4944, -70.6170]);

  useEffect(() => {
    // ✅ Fix 2: navigator (no navigation)
    navigator.geolocation.getCurrentPosition(
      (pos) => setCentro([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn('No se pudo obtener ubicación, usando centro por defecto', err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return (
    <div style={styles.mainContainer}>

      <div style={styles.leyendaContainer}>
        <p style={styles.leyendaTitle}>Leyenda</p>
        {leyendaItems.map(item => (
          <div key={item.label} style={styles.leyendaItem}>
            <span style={styles.leyendaColorBox(item.color)} />
            <span style={styles.leyendaLabel}>{item.label}</span>
          </div>
        ))}
        <div style={styles.leyendaItem}>
          <span>🚒</span>
          <span style={styles.leyendaLabel}>Brigada activa</span>
        </div>
        <div style={styles.leyendaItem}>
          <span style={styles.leyendaRuta} />
          <span style={styles.leyendaLabel}>Ruta evacuación</span>
        </div>
      </div>

      {/* ✅ Fix 3: center={centro} sin doble array */}
      <MapContainer center={centro} zoom={15} style={styles.map}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        {zonasMock.map(zona => (
          <Polygon key={`zona-${zona.id}`} positions={zona.coords} pathOptions={styles.zonaPathOptions(zona.nivel)}>
            <Popup><strong>{zona.nombre}</strong><br />Zona de riesgo: {zona.nivel}</Popup>
          </Polygon>
        ))}

        {rutasMock.map(ruta => (
          <Polyline key={`ruta-${ruta.id}`} positions={ruta.puntos} pathOptions={styles.rutaPathOptions}>
            <Popup><strong>{ruta.nombre}</strong></Popup>
          </Polyline>
        ))}

        {reportesMock.map((reporte) => (
          <React.Fragment key={reporte.id}>
            <Circle center={[reporte.lat, reporte.lng]} radius={300} pathOptions={styles.focoCirclePathOptions(reporte.nivel)} />
            <Marker position={[reporte.lat, reporte.lng]}>
              <Popup><strong>{reporte.titulo}</strong><br />Nivel: {reporte.nivel}</Popup>
            </Marker>
          </React.Fragment>
        ))}

        {brigadasMock.map(b => (
          <Marker key={`brigada-${b.id}`} position={[b.lat, b.lng]} icon={styles.iconoBrigada}>
            <Popup>
              <strong>{b.nombre}</strong><br />
              Tipo: {b.tipo}<br />
              Estado: {b.disponible ? '✅ Disponible' : '🔴 En operación'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <FooterComponent />
    </div>
  );
}