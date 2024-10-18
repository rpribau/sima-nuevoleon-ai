import { useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

interface Coordinate {
  lat: number;
  lon: number;
  name: string;
}

interface MapComponentProps {
  coordinates: Coordinate[];
  stationsData: { [key: string]: { HrAveData: string; Parameter: string; }[] };
  onStationClick: (stationName: string) => void;
}

const createCustomIcon = (color: string) =>
  L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });

  const getWorstAirQuality = (stationData: { HrAveData: string; Parameter: string }[]) => {
    // Implement the logic to determine the worst air quality based on stationData
    // This is a placeholder implementation
    const qualities = stationData?.map(data => data.Parameter) || [];
    if (qualities.includes("Extremadamente mala")) return "Extremadamente mala";
    if (qualities.includes("Muy mala")) return "Muy mala";
    if (qualities.includes("Malo")) return "Malo";
    if (qualities.includes("Aceptable")) return "Aceptable";
    return "Bueno";
  };

  const getStationColor = (stationData: { HrAveData: string; Parameter: string }[]) => {
    const worstQuality = getWorstAirQuality(stationData);
    switch (worstQuality) {
      case "Bueno":
        return "#00FF00"; // Verde
      case "Aceptable":
        return "#FFFF00"; // Amarillo
      case "Malo":
        return "#FFA500"; // Naranja
      case "Muy mala":
        return "#FF0000"; // Rojo
      case "Extremadamente mala":
        return "#800080"; // Púrpura
      default:
        return "#808080"; // Gris para desconocido o no disponible
    }
  };

interface DynamicMapProps {
  coordinates: Coordinate[];
  stationsData: { [key: string]: { HrAveData: string; Parameter: string; }[] };
  onStationClick: (stationName: string) => void;
}

const DynamicMap: React.FC<DynamicMapProps> = ({ coordinates, stationsData, onStationClick }) => {
    useEffect(() => {
        // This effect ensures that the Leaflet CSS is only loaded on the client side
        import("leaflet/dist/leaflet.css");
      }, []);

      return (
        <MapContainer
          center={[25.67602, -100.335847]}
          zoom={10}
          style={{ height: "655px", width: "100%", borderRadius: 10 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coordinates.map((station, index) => {
            const stationData = stationsData[station.name];
            const pinColor = getStationColor(stationData);
    
            return (
              <Marker
                key={index}
                position={[station.lat, station.lon] as LatLngExpression}
                icon={createCustomIcon(pinColor)}
                eventHandlers={{ click: () => onStationClick(station.name) }}
              />
            );
          })}
        </MapContainer>
      );
    };

export default DynamicMap;
