import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline } from 'react-leaflet'
import FooterComponent from '../components/FooterComponent'
import 'leaflet/dist/leaflet.css'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl       from 'leaflet/dist/images/marker-icon.png'
import shadowUrl     from 'leaflet/dist/images/marker-shadow.png'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

// ── Focos de incendio ──────────────────────────────────────────
const reportesMock = [
  { id: 1, lat: -30.692, lng: -70.962, nivel: 'alto',     titulo: 'Incendio Sector Carén' },
  { id: 2, lat: -30.701, lng: -70.948, nivel: 'medio',    titulo: 'Columna de humo Cerro Las Ramadas' },
  { id: 3, lat: -30.685, lng: -70.971, nivel: 'bajo',     titulo: 'Foco menor El Maitén' },
  { id: 4, lat: -30.710, lng: -70.955, nivel: 'resuelto', titulo: 'Incendio Resuelto Sector Ponio' },
]
const coloresPorNivel = { alto: '#ef4444', medio: '#f97316', bajo: '#eab308', resuelto: '#22c55e' }

// ── Brigadas activas ───────────────────────────────────────────
// TODO: reemplazar por GET /bff/mapa/brigadas
const brigadasMock = [
  { id: 1, lat: -30.688, lng: -70.950, nombre: 'Brigada Carén',     tipo: 'FORESTAL', disponible: true  },
  { id: 2, lat: -30.705, lng: -70.965, nombre: 'Brigada El Maitén', tipo: 'URBANA',   disponible: true  },
  { id: 3, lat: -30.712, lng: -70.942, nombre: 'Brigada Ponio',     tipo: 'MIXTA',    disponible: false },
]

// ícono personalizado para brigadas
const iconoBrigada = L.divIcon({
  html: '🚒',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// ── Zonas de riesgo (polígonos) ────────────────────────────────
// TODO: reemplazar por GET /bff/mapa/zonas
const zonasMock = [
  {
    id: 1, nombre: 'Sector Carén', nivel: 'ALTO',
    coords: [[-30.688, -70.968], [-30.688, -70.957], [-30.696, -70.957], [-30.696, -70.968]],
  },
  {
    id: 2, nombre: 'Cerro Las Ramadas', nivel: 'MEDIO',
    coords: [[-30.697, -70.954], [-30.697, -70.944], [-30.705, -70.944], [-30.705, -70.954]],
  },
  {
    id: 3, nombre: 'Sector El Maitén', nivel: 'BAJO',
    coords: [[-30.681, -70.977], [-30.681, -70.966], [-30.689, -70.966], [-30.689, -70.977]],
  },
]
const coloresZona = {
  ALTO:   { color: '#ef4444', fill: '#ef4444' },
  MEDIO:  { color: '#f97316', fill: '#f97316' },
  BAJO:   { color: '#eab308', fill: '#eab308' },
  CRITICO:{ color: '#7f1d1d', fill: '#7f1d1d' },
}

// ── Rutas de evacuación (líneas) ───────────────────────────────
// TODO: reemplazar por GET /bff/mapa/rutas
const rutasMock = [
  {
    id: 1, nombre: 'Ruta Evacuación Norte',
    puntos: [[-30.692, -70.962], [-30.685, -70.955], [-30.678, -70.948]],
  },
  {
    id: 2, nombre: 'Ruta Evacuación Sur',
    puntos: [[-30.710, -70.955], [-30.718, -70.948], [-30.725, -70.940]],
  },
]

export default function MapaIncendios() {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>

      {/* Leyenda */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '10px',
        padding: '0.8rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '0.78rem', minWidth: '160px'
      }}>
        <p style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem' }}>Leyenda</p>
        {[
          { color: '#ef4444', label: 'Foco Alto / Zona Alto' },
          { color: '#f97316', label: 'Foco Medio / Zona Medio' },
          { color: '#eab308', label: 'Foco Bajo / Zona Bajo' },
          { color: '#22c55e', label: 'Resuelto' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }} />
            <span style={{ color: '#475569' }}>{item.label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
          <span>🚒</span><span style={{ color: '#475569' }}>Brigada activa</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: 20, height: 3, backgroundColor: '#3b82f6', display: 'inline-block', borderRadius: 2 }} />
          <span style={{ color: '#475569' }}>Ruta evacuación</span>
        </div>
      </div>

      <MapContainer
        center={[-30.695, -70.958]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Zonas de riesgo — polígonos */}
        {zonasMock.map(zona => (
          <Polygon
            key={`zona-${zona.id}`}
            positions={zona.coords}
            pathOptions={{
              color: coloresZona[zona.nivel].color,
              fillColor: coloresZona[zona.nivel].fill,
              fillOpacity: 0.15,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{zona.nombre}</strong><br />
              Zona de riesgo: {zona.nivel}
            </Popup>
          </Polygon>
        ))}

        {/* Rutas de evacuación — líneas azules */}
        {rutasMock.map(ruta => (
          <Polyline
            key={`ruta-${ruta.id}`}
            positions={ruta.puntos}
            pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '8 4' }}
          >
            <Popup><strong>{ruta.nombre}</strong></Popup>
          </Polyline>
        ))}

        {/* Focos de incendio — círculo + marcador */}
        {reportesMock.map((reporte) => (
          <React.Fragment key={reporte.id}>
            <Circle
              center={[reporte.lat, reporte.lng]}
              radius={300}
              pathOptions={{
                color: coloresPorNivel[reporte.nivel],
                fillColor: coloresPorNivel[reporte.nivel],
                fillOpacity: 0.25,
              }}
            />
            <Marker position={[reporte.lat, reporte.lng]}>
              <Popup>
                <strong>{reporte.titulo}</strong><br />
                Nivel: {reporte.nivel}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Brigadas activas — ícono 🚒 */}
        {brigadasMock.map(b => (
          <Marker key={`brigada-${b.id}`} position={[b.lat, b.lng]} icon={iconoBrigada}>
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
  )
}