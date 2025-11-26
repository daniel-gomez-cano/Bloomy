// src/components/Map.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet'

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng); // envía coordenadas al padre
    },
  });
  return null;
}

export default function Map({ onUbicacionSeleccionada }) {
  const [posicion, setPosicion] = useState(null);
  const [isLight, setIsLight] = useState(() => document.body.classList.contains('light-theme'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.body.classList.contains('light-theme'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const tileUrl = isLight
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = isLight
    ? '&copy; OpenStreetMap contributors'
    : '&copy; OpenStreetMap contributors &copy; CARTO';

  return (
    <MapContainer center={[4.5, -75.7]} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer key={isLight ? 'light' : 'dark'} url={tileUrl} attribution={attribution} />
      <LocationMarker onSelect={(coords) => {
        setPosicion(coords);
        onUbicacionSeleccionada(coords);
      }} />
      {posicion && (
        <Marker
          position={posicion}
          icon={L.divIcon({
            className: 'bloomy-pin',
            html: `<div style="font-size:24px; line-height:24px;">📍</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          })}
        />
      )}
    </MapContainer>
  );
}
