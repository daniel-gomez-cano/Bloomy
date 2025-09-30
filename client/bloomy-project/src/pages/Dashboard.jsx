// src/pages/Reporte.jsx
import Map from '../components/Map';

export default function Reporte() {
  const handleUbicacion = (coords) => {
    console.log('Coordenadas seleccionadas:', coords);
    // Aquí puedes enviar coords al backend para generar el reporte
  };

  return (
    <div>
      <h2>Selecciona una zona en el mapa</h2>
      <Map onUbicacionSeleccionada={handleUbicacion} />
    </div>
  );
}
