import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const iconDefault = L.icon({ iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41] });

function SelectorClick({ onSeleccionar }) {
  useMapEvents({ click: (e) => onSeleccionar(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)) });
  return null;
}

function MoveCentro({ centro }) {
  const map = useMap();
  useEffect(() => { if (centro) map.setView(centro, 17); }, [centro]);
  return null;
}

export default function MapaSelector({ centro, latitud, longitud, onSeleccionar }) {
  return (
    <MapContainer center={[-33.4944, -70.6170]} zoom={17} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
      <MoveCentro centro={centro} />
      <SelectorClick onSeleccionar={onSeleccionar} />
      {latitud && longitud && <Marker position={[parseFloat(latitud), parseFloat(longitud)]} icon={iconDefault} />}
    </MapContainer>
  );
}