// src/components/Map.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

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

  return (
    <MapContainer center={[4.5, -75.7]} zoom={6} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <LocationMarker onSelect={(coords) => {
        setPosicion(coords);
        onUbicacionSeleccionada(coords); // pasa coords al padre
      }} />
      {posicion && <Marker position={posicion} />}
    </MapContainer>
  );
}
