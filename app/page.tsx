"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import L from 'leaflet';

const getBackgroundColor = (airQuality: string | undefined) => {
  if (!airQuality) return 'bg-gray-100'; // Default for disconnected or missing data
  switch (airQuality.toLowerCase()) {
    case 'bueno': return 'bg-green-100';
    case 'aceptable': return 'bg-yellow-100';
    case 'malo': return 'bg-orange-100';
    case 'muy mala': return 'bg-red-100';
    case 'extremadamente mala': return 'bg-purple-100';
    default: return 'bg-white';
  }
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

const coordinates = [
  { lat: 25.67602, lon: -100.335847, name: "Centro" },
  { lat: 25.66827, lon: -100.249580, name: "Sureste" },
  { lat: 25.74543, lon: -100.255020, name: "Noreste"},
  { lat: 25.75712, lon: -100.365974, name: "Noroeste" },
  { lat: 25.675674, lon: -100.465018, name: "Suroeste"},
  { lat: 25.783456, lon: -100.585874, name: "Noroeste2" },
  { lat: 25.80194, lon: -100.343056, name: "Norte" },
  { lat: 25.77722, lon: -100.188055, name: "Noreste2" },
  { lat: 25.64611, lon: -100.095555, name: "Sureste2" },
  { lat: 25.66528, lon: -100.412778, name: "Suroeste2" },
  { lat: 25.600874, lon: -99.995298, name: "Sureste3" },
  { lat: 25.729787, lon: -100.310028, name: "Norte2" },
  { lat: 25.575383, lon: -100.249371, name: "Sur" },
  //... other coordinates
];

export default function StationsPage() {
  const [stationsData, setStationsData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const fetchStationData = async (stationName: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/data/${stationName.toLowerCase()}`);
      const data = await res.json();
      if (res.ok) {
        setStationsData(prevData => ({
          ...prevData,
          [stationName]: data
        }));
        setSelectedStation(stationName);
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStationClick = (stationName: string) => {
    if (!stationsData[stationName]) {
      fetchStationData(stationName);
    } else {
      setSelectedStation(stationName);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        {loading && (
          <div className="flex justify-center items-center my-4">
            <Loader className="animate-spin" />
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        {!loading && selectedStation && stationsData[selectedStation] && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedStation}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stationsData[selectedStation] && Array.isArray(stationsData[selectedStation]) && stationsData[selectedStation].map((value, index) => (
                <Card key={index} className={`${getBackgroundColor(value.descriptor)}`}>
                  <CardHeader>
                    <CardTitle>{value.parametro}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      Valor: {value.valor} {/* Asegúrate de que aquí incluyas la medida */}
                    </div>
                    <div>
                      Descriptor: {value.descriptor}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="w-full md:w-1/2 p-4">
        <MapContainer center={[25.67602, -100.335847] as LatLngExpression} zoom={10} style={{ height: "600px", width: "100%", borderRadius: 10 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coordinates.map((station, index) => (
            <Marker
              key={index}
              position={[station.lat, station.lon] as LatLngExpression}
              icon={createCustomIcon(getBackgroundColor(stationsData[station.name]?.worstAirQuality))}
              eventHandlers={{
                click: () => handleStationClick(station.name),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
