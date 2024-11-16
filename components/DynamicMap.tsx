import { useEffect, useState } from "react";
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

const getAirQualityDescriptor = (value: string, parameter: string) => {
  if (value === "ND") return "Bueno";
  const numValue = Number(value);
  if (isNaN(numValue)) return "Bueno";

  switch (parameter) {
    case 'PM10_12':
      if (numValue < 51) return "Bueno";
      if (numValue < 76) return "Aceptable";
      if (numValue < 156) return "Malo";
      if (numValue < 236) return "Muy mala";
      return "Extremadamente mala";
    case 'PM25_12':
      if (numValue < 26) return "Bueno";
      if (numValue < 46) return "Aceptable";
      if (numValue < 80) return "Malo";
      if (numValue < 148) return "Muy mala";
      return "Extremadamente mala";
    case 'O3m':
      if (numValue < 52) return "Bueno";
      if (numValue < 96) return "Aceptable";
      if (numValue < 136) return "Malo";
      if (numValue < 176) return "Muy mala";
      return "Extremadamente mala";
    case 'NO2m':
      if (numValue < 108) return "Bueno";
      if (numValue < 211) return "Aceptable";
      if (numValue < 231) return "Malo";
      if (numValue < 251) return "Muy mala";
      return "Extremadamente mala";
    case 'O38m':
      if (numValue < 52) return "Bueno";
      if (numValue < 71) return "Aceptable";
      if (numValue < 93) return "Malo";
      if (numValue < 115) return "Muy mala";
      return "Extremadamente mala";
    case 'SO2m':
      if (numValue < 9) return "Bueno";
      if (numValue < 111) return "Aceptable";
      if (numValue < 166) return "Malo";
      if (numValue < 221) return "Muy mala";
      return "Extremadamente mala";
    case 'CO8m':
      if (numValue < 8.751) return "Bueno";
      if (numValue < 11.001) return "Aceptable";
      if (numValue < 13.301) return "Malo";
      if (numValue < 15.501) return "Muy mala";
      return "Extremadamente mala";
    default:
      return "Bueno";
  }
};

const getWorstAirQuality = (stationData: { HrAveData: string; Parameter: string }[]) => {
  if (!Array.isArray(stationData) || stationData.length === 0) {
    return "Bueno";
  }

  const qualityOrder = ["Bueno", "Aceptable", "Malo", "Muy mala", "Extremadamente mala"];
  let worstQuality = "Bueno";

  stationData.forEach((data) => {
    const descriptor = getAirQualityDescriptor(data.HrAveData, data.Parameter);
    if (qualityOrder.indexOf(descriptor) > qualityOrder.indexOf(worstQuality)) {
      worstQuality = descriptor;
    }
  });

  return worstQuality;
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

const DynamicMap: React.FC<MapComponentProps> = ({ coordinates, stationsData, onStationClick }) => {
  const [stationColors, setStationColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    import("leaflet/dist/leaflet.css");
  }, []);

  useEffect(() => {
    const newColors: { [key: string]: string } = {};
    coordinates.forEach((station) => {
      if (stationsData[station.name]) {
        newColors[station.name] = getStationColor(stationsData[station.name]);
      }
    });
    setStationColors(newColors);
  }, [stationsData, coordinates]);

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
      {coordinates.map((station, index) => (
        <Marker
          key={index}
          position={[station.lat, station.lon] as LatLngExpression}
          icon={createCustomIcon(stationColors[station.name] || "#808080")}
          eventHandlers={{ click: () => onStationClick(station.name) }}
        />
      ))}
    </MapContainer>
  );
};

export default DynamicMap;