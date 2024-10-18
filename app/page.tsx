"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import L from "leaflet";

const API_URL = "https://sima-api.simaapi.workers.dev/?station=";

const airQualityInfo = {
  "Bueno": {
    color: "#DCFCE7",
    imeca: "0 - 50",
    risks: "Ninguno",
    recommendations: [
      "Puedes realizar actividades al aire libre.",
      "Puedes ejercitarte al aire libre.",
      "Sin riesgo para grupos sensibles.",
    ],
  },
  "Aceptable": {
    color: "#FEF9C3",
    imeca: "51 - 100",
    risks: "Posibles molestias en niños, adultos mayores y personas con enfermedades respiratorias o cardiovasculares.",
    recommendations: [
      "Puedes realizar actividades al aire libre.",
      "Puedes ejercitarte al aire libre.",
      "Personas extremadamente sensibles limitar actividades al aire libre.",
    ],
  },
  "Malo": {
    color: "#FFEDD5",
    imeca: "101 - 150",
    risks: "Posibles efectos adversos a la salud, especialmente en niños, adultos mayores y personas con enfermedades respiratorias o cardiovasculares.",
    recommendations: [
      "Limita las actividades al aire libre.",
      "Limita el tiempo de ejercicio al aire libre.",
      "Grupos sensibles deben permanecer en interiores.",
    ],
  },
  "Muy mala": {
    color: "#FF0000",
    imeca: "151 - 200",
    risks: "Efectos adversos a la salud en la población general. Se agravan los síntomas en personas vulnerables.",
    recommendations: [
      "Evita las actividades al aire libre.",
      "Evita el ejercicio al aire libre.",
      "Mantén puertas y ventanas cerradas.",
      "Grupos sensibles deben permanecer en interiores.",
      "Acude al médico si presentas síntomas.",
    ],
  },
  "Extremadamente mala": {
    color: "#800080",
    imeca: "201 - 500",
    risks: "Efectos graves a la salud en toda la población. Pueden presentarse complicaciones en personas vulnerables.",
    recommendations: [
      "Suspende toda actividad al aire libre.",
      "Suspende cualquier ejercicio al aire libre.",
      "Mantén puertas y ventanas cerradas.",
      "Grupos sensibles deben permanecer en interiores.",
      "Solicita atención médica urgente si es necesario.",
    ],
  },
};

const coordinates = [
  { lat: 25.67602, lon: -100.335847, name: "Centro" },
  { lat: 25.66827, lon: -100.24958, name: "Sureste" },
  { lat: 25.74543, lon: -100.25502, name: "Noreste" },
  { lat: 25.75712, lon: -100.365974, name: "Noroeste" },
  { lat: 25.675674, lon: -100.465018, name: "Suroeste" },
  { lat: 25.783456, lon: -100.585874, name: "Garcia" },
  { lat: 25.80194, lon: -100.343056, name: "Norte" },
  { lat: 25.77722, lon: -100.188055, name: "Noreste2" },
  { lat: 25.64611, lon: -100.095555, name: "Sureste2" },
  { lat: 25.66528, lon: -100.412778, name: "[SAN Pedro]" },
  { lat: 25.600874, lon: -99.995298, name: "Sureste3" },
  { lat: 25.729787, lon: -100.310028, name: "Norte2" },
  { lat: 25.575383, lon: -100.249371, name: "Sur" },
  { lat: 25.785, lon: -100.46361112, name: "Noroeste3" },
  { lat: 25.7905833, lon: -100.078411, name: "Pesqueria" },
];

const createCustomIcon = (color) =>
  L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });

  const getBackgroundColor = (value, parameter) => {
    if (value === "ND") return "#D9D9D9"; // Gris para "No Disponible"
    if (typeof value !== "number") return "#FFFFFF"; // Blanco por defecto
  
    const numValue = Number(value);
    if (isNaN(numValue)) return "#FFFFFF"; // Blanco si no es un número válido
  
    switch (parameter) {
      case 'PM10_12':
        if (numValue < 51) return "#DCFCE7"; // Verde
        if (numValue < 76) return "#FEF9C3"; // Amarillo
        if (numValue < 156) return "#FFEDD5"; // Naranja
        if (numValue < 236) return "#FF0000"; // Rojo
        return "#800080"; // Púrpura
      case 'PM25_12':
        if (numValue < 26) return "#DCFCE7";
        if (numValue < 46) return "#FEF9C3";
        if (numValue < 80) return "#FFEDD5";
        if (numValue < 148) return "#FF0000";
        return "#800080";
      case 'O3m':
        if (numValue < 52) return "#DCFCE7";
        if (numValue < 96) return "#FEF9C3";
        if (numValue < 136) return "#FFEDD5";
        if (numValue < 176) return "#FF0000";
        return "#800080";
      case 'NO2m':
        if (numValue < 108) return "#DCFCE7";
        if (numValue < 211) return "#FEF9C3";
        if (numValue < 231) return "#FFEDD5";
        if (numValue < 251) return "#FF0000";
        return "#800080";
      case 'O38m':
        if (numValue < 52) return "#DCFCE7";
        if (numValue < 71) return "#FEF9C3";
        if (numValue < 93) return "#FFEDD5";
        if (numValue < 115) return "#FF0000";
        return "#800080";
      case 'SO2m':
        if (numValue < 9) return "#DCFCE7";
        if (numValue < 111) return "#FEF9C3";
        if (numValue < 166) return "#FFEDD5";
        if (numValue < 221) return "#FF0000";
        return "#800080";
      case 'CO8m':
        if (numValue < 8.751) return "#DCFCE7";
        if (numValue < 11.001) return "#FEF9C3";
        if (numValue < 13.301) return "#FFEDD5";
        if (numValue < 15.501) return "#FF0000";
        return "#800080";
      default:
        return "#FFFFFF"; // Blanco por defecto si no coincide con ningún parámetro
    }
  };
  

  const getAirQualityDescriptor = (value, parameter) => {
    if (value === "ND") return "No dato";
    const numValue = Number(value);
    if (isNaN(numValue)) return "Desconocido";
  
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
        return "Desconocido";
    }
  };
  
  const getWorstAirQuality = (stationData) => {
    if (!Array.isArray(stationData) || stationData.length === 0) {
      console.warn("Invalid station data:", stationData);
      return "Desconocido";
    }
  
    const hierarchy = ["Bueno", "Aceptable", "Malo", "Muy mala", "Extremadamente mala"];
    
    return stationData.reduce((worst, current) => {
      const currentDescriptor = getAirQualityDescriptor(current.HrAveData, current.Parameter);
      const worstIndex = hierarchy.indexOf(worst);
      const currentIndex = hierarchy.indexOf(currentDescriptor);
      return currentIndex > worstIndex ? currentDescriptor : worst;
    }, "Bueno");
  };
  
  const getStationColor = (stationData) => {
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

export default function StationsPage() {
  const [stationsData, setStationsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [stationLoading, setStationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState("Centro");

  useEffect(() => {
    const fetchAllStationsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const allData = await Promise.all(
          coordinates.map(async (station) => {
            const res = await fetch(`${API_URL}${station.name.toUpperCase()}`);
            if (!res.ok) throw new Error(`Failed to fetch ${station.name}`);
            const data = await res.json();
            return { [station.name]: data };
          })
        );
        setStationsData(Object.assign({}, ...allData));
      } catch (err) {
        console.error(err);
        setError("Error fetching station data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStationsData();
  }, []);

  const handleStationClick = async (stationName) => {
    setSelectedStation(stationName);
    setStationLoading(true);

    try {
      const res = await fetch(`${API_URL}${stationName.toUpperCase()}`);
      if (!res.ok) throw new Error(`Failed to fetch ${stationName}`);
      const data = await res.json();
      setStationsData((prev) => ({ ...prev, [stationName]: data }));
    } catch (err) {
      console.error(err);
      setError(`Failed to load ${stationName}`);
    } finally {
      setStationLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          {loading ? (
            <div className="flex justify-center items-center my-4">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">{selectedStation}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stationLoading ? (
                  <div className="flex justify-center items-center my-4">
                    <Loader className="animate-spin" />
                  </div>
                ) : (
                  stationsData[selectedStation]?.map((param, index) => (
                    <Card
                      key={index}
                      className="p-2"
                      style={{ backgroundColor: getBackgroundColor(param.HrAveData, param.Parameter) }}
                    >
                      <CardHeader className="p-2">
                        <CardTitle className="text-sm">{param.ParameterLargo}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="text-xs">Valor: {param.HrAveData}</div>
                        <div className="text-xs">Fecha: {param.Date}</div>
                      </CardContent>
                    </Card>


                  ))
                )}
              </div>
              {!stationLoading && (
                <Card
                  className="p-4 mt-4"
                  style={{
                    backgroundColor: getBackgroundColor(
                      getWorstAirQuality(stationsData[selectedStation]),
                      "PM10_12"
                    ),
                  }}
                >
                  <CardHeader className="p-2">
                    <CardTitle className="text-lg">
                      Calidad del Aire: {getWorstAirQuality(stationsData[selectedStation])}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="text-sm">
                      <strong>Riesgos:</strong> {airQualityInfo[getWorstAirQuality(stationsData[selectedStation])].risks}
                    </div>
                    <div className="text-sm">
                      <strong>Recomendaciones:</strong>
                      <ul className="list-disc list-inside">
                        {airQualityInfo[getWorstAirQuality(stationsData[selectedStation])].recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <div className="w-full lg:w-1/2">
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
                  eventHandlers={{ click: () => handleStationClick(station.name) }}
                />
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
