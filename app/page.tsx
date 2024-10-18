"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import L from "leaflet";

const API_URL = "https://sima-api-af0ce57d922a.herokuapp.com/api/stations?station=";

const airQualityInfo = {
  bueno: {
    color: "#DCFCE7",
    imeca: "0 - 50",
    risks: "Ninguno",
    recommendations: [
      "Puedes realizar actividades al aire libre.",
      "Puedes ejercitarte al aire libre.",
      "Sin riesgo para grupos sensibles.",
    ],
  },
  aceptable: {
    color: "#FEF9C3",
    imeca: "51 - 100",
    risks: "Posibles molestias en niños, adultos mayores y personas con enfermedades respiratorias o cardiovasculares.",
    recommendations: [
      "Puedes realizar actividades al aire libre.",
      "Puedes ejercitarte al aire libre.",
      "Personas extremadamente sensibles limitar actividades al aire libre.",
    ],
  },
  malo: {
    color: "#FFEDD5",
    imeca: "101 - 150",
    risks: "Posibles efectos adversos a la salud, especialmente en niños, adultos mayores y personas con enfermedades respiratorias o cardiovasculares.",
    recommendations: [
      "Limita las actividades al aire libre.",
      "Limita el tiempo de ejercicio al aire libre.",
      "Grupos sensibles deben permanecer en interiores.",
    ],
  },
  "muy mala": {
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
  "extremadamente mala": {
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

const getBackgroundColor = (airQuality: string | undefined) => {
  if (!airQuality) return "#808080"; // Gray for unknown
  switch (airQuality.toLowerCase()) {
    case "bueno":
      return "#00FF00"; // Green
    case "aceptable":
      return "#FFFF00"; // Yellow
    case "malo":
      return "#FFA500"; // Orange
    case "muy mala":
      return "#FF0000"; // Red
    case "extremadamente mala":
      return "#800080"; // Purple
    default:
      return "#FFFFFF"; // White
  }
};

const getTailwindBackgroundColor = (airQuality: string | undefined) => {
  if (!airQuality) return "bg-gray-100"; // Default for missing data
  switch (airQuality.toLowerCase()) {
    case "bueno":
      return "bg-green-100";
    case "aceptable":
      return "bg-yellow-100";
    case "malo":
      return "bg-orange-100";
    case "muy mala":
      return "bg-red-100";
    case "extremadamente mala":
      return "bg-purple-100";
    default:
      return "bg-white";
  }
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
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
  { lat: 25.66528, lon: -100.412778, name: "Suroeste2" },
  { lat: 25.600874, lon: -99.995298, name: "Sureste3" },
  { lat: 25.729787, lon: -100.310028, name: "Norte2" },
  { lat: 25.575383, lon: -100.249371, name: "Sur" },
];

export default function StationsPage() {
  const [stationsData, setStationsData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [stationLoading, setStationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>("Centro");
  const [selectedAirQuality, setSelectedAirQuality] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllStationsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allData = await Promise.all(
          coordinates.map(async (station) => {
            try {
              const res = await fetch(`${API_URL}${station.name.toUpperCase()}`);
              if (!res.ok) {
                throw new Error(`Failed to fetch data for ${station.name}: ${res.statusText}`);
              }
              const data = await res.json();
              return { [station.name]: data.data };
            } catch (err) {
              console.error(`Error fetching data for ${station.name}:`, err);
              return { [station.name]: null };
            }
          })
        );
        const combinedData = Object.assign({}, ...allData);
        setStationsData(combinedData);

        const centroData = combinedData["Centro"];
        if (centroData) {
          const worstAirQuality = getWorstAirQuality({ data: centroData });
          setSelectedAirQuality(worstAirQuality.descriptor.toLowerCase());
        }
      } catch (err) {
        setError("An error occurred while fetching station data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStationsData();
  }, []);

  const handleStationClick = async (stationName: string) => {
    setSelectedStation(stationName);
    setStationLoading(true);
    try {
      const res = await fetch(`${API_URL}${stationName.toUpperCase()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ${stationName}: ${res.statusText}`);
      }
      const data = await res.json();
      setStationsData((prevData) => ({
        ...prevData,
        [stationName]: data.data,
      }));

      const worstAirQuality = getWorstAirQuality(data);
      setSelectedAirQuality(worstAirQuality.descriptor.toLowerCase());
    } catch (err) {
      console.error(`Error fetching data for ${stationName}:`, err);
      setError(`Failed to load data for ${stationName}`);
    } finally {
      setStationLoading(false);
    }
  };

  const getWorstAirQuality = (stationResponse: any) => {
    const stationData = stationResponse?.data;
    if (!Array.isArray(stationData) || stationData.length === 0) {
      console.warn("Invalid station data:", stationResponse);
      return { descriptor: "unknown" };
    }

    const hierarchy = ["bueno", "aceptable", "malo", "muy mala", "extremadamente mala"];

    return stationData.reduce((worst, current) => {
      const worstIndex = hierarchy.indexOf(worst.descriptor.toLowerCase());
      const currentIndex = hierarchy.indexOf(current.descriptor.toLowerCase());
      return currentIndex > worstIndex ? current : worst;
    }, { descriptor: "bueno" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          {loading && (
            <div className="flex justify-center items-center my-4">
              <Loader className="animate-spin" />
            </div>
          )}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{selectedStation}</h2>
              {stationLoading ? (
                <div className="flex justify-center items-center my-4">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {stationsData[selectedStation]?.map((value: any, index: number) => (
                      <Card key={index} className={`${getTailwindBackgroundColor(value.descriptor)} p-2`}>
                        <CardHeader className="p-2">
                          <CardTitle className="text-sm">{value.parametro}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                          <div className="text-xs">Valor: {value.valor}</div>
                          <div className="text-xs">Descriptor: {value.descriptor}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {selectedAirQuality && (
                    <Card className={`${getTailwindBackgroundColor(selectedAirQuality)} p-4`}>
                      <CardHeader className="p-2">
                        <CardTitle className="text-lg font-bold">Información de Calidad del Aire</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="text-sm">
                          <strong>IMECAs:</strong> {airQualityInfo[selectedAirQuality].imeca}
                        </div>
                        <div className="text-sm">
                          <strong>Riesgos:</strong> {airQualityInfo[selectedAirQuality].risks}
                        </div>
                        <div className="text-sm mt-2">
                          <strong>Recomendaciones:</strong>
                          <ul className="list-disc list-inside">
                            {airQualityInfo[selectedAirQuality].recommendations.map((rec, index) => (
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
          )}
        </div>

        <div className="w-full lg:w-1/2">
          <MapContainer center={[25.67602, -100.335847]} zoom={10} style={{ height: "655px", width: "100%", borderRadius: 10 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {coordinates.map((station, index) => {
              const stationData = stationsData[station.name];
              const worstAirQuality = getWorstAirQuality({ data: stationData });
              const pinColor = getBackgroundColor(worstAirQuality.descriptor);

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
