"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Import Leaflet's CSS
import { Loader } from 'lucide-react';  // Spinner for loading state
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';  // Import Card components from Shadcn

// Import the default marker icon
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const coordinates = [
  { lat: 25.67602, lon: -100.335847, name: "Centro", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=CENTRO' },
  { lat: 25.66827, lon: -100.249580, name: "Sureste", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=SURESTE' },
  { lat: 25.74543, lon: -100.255020, name: "Noreste", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=NORESTE' },
  { lat: 25.75712, lon: -100.365974, name: "Noroeste", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=NOROESTE' },
  { lat: 25.675674, lon: -100.465018, name: "Suroeste", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=SUROESTE' },
  { lat: 25.783456, lon: -100.585874, name: "Noroeste2", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=GARCIA' },
  { lat: 25.80194, lon: -100.343056, name: "Norte", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=NORTE' },
  { lat: 25.77722, lon: -100.188055, name: "Noreste2", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=NORESTE2' },
  { lat: 25.64611, lon: -100.095555, name: "Sureste2", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=SURESTE2' },
  { lat: 25.66528, lon: -100.412778, name: "Suroeste2", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=[SAN%20Pedro]' },
  { lat: 25.600874, lon: -99.995298, name: "Sureste3", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=SURESTE3' },
  { lat: 25.729787, lon: -100.310028, name: "Norte2", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=NORTE2' },
  { lat: 25.575383, lon: -100.249371, name: "Sur", dataUrl: 'http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=SUR' },
  // (futuras estaciones aqui)
];

export default function StationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (dataUrl: string) => {
    setLoading(true);
    setData(null);  // Clear old data
    setError(null);

    try {
      const res = await fetch(`/api/stations?dataUrl=${encodeURIComponent(dataUrl)}`);
      const result = await res.json();

      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Side: Cards */}
      <div className="w-full md:w-1/2 p-4">
        {loading && (
          <div className="flex justify-center items-center my-4">
            <Loader className="animate-spin" />
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((entry: string[], index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{entry[0]}</CardTitle>  {/* Pollutant Name */}
                </CardHeader>
                <CardContent>
                  <p>Concentration: {entry[1]}</p>  {/* Concentration */}
                  <p>Air Quality: {entry[2]}</p>   {/* Air Quality */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Map */}
      <div className="w-full md:w-1/2 p-4">
        <MapContainer center={[25.67602, -100.335847] as LatLngExpression} zoom={10} style={{ height: "600px", width: "100%", borderRadius: 10}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coordinates.map((station, index) => (
            <Marker 
              key={index} 
              position={[station.lat, station.lon] as LatLngExpression} 
              eventHandlers={{
                click: () => fetchData(station.dataUrl),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
