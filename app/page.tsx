"use client"

import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

const coordinates = [
  {"lat": 25.67602, "lon": -100.335847, "name": "Centro"},
  {"lat": 25.66827, "lon": -100.249580, "name": "Sureste"},
  {"lat": 25.74543, "lon": -100.255020, "name": "Noreste"},
  {"lat": 25.75712, "lon": -100.365974, "name": "Noroeste"},
  {"lat": 25.675674, "lon": -100.465018, "name": "Suroeste"},
  {"lat": 25.783456, "lon": -100.585874, "name": "Noroeste2"},
  {"lat": 25.80194, "lon": -100.343056, "name": "Norte"},
  {"lat": 25.77722, "lon": -100.188055, "name": "Noreste2"},
  {"lat": 25.64611, "lon": -100.095555, "name": "Sureste2"},
  {"lat": 25.66528, "lon": -100.412778, "name": "Suroeste2"},
  {"lat": 25.600874, "lon": -99.995298, "name": "Sureste3"},
  {"lat": 25.729787, "lon": -100.310028, "name": "Norte2"},
  {"lat": 25.575383, "lon": -100.249371, "name": "Sur"},
]

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Calidad del aire en el Area Metropolitana de Monterrey</h2>
        <h2 className="text-lg font-bold mb-2">Ultima actualizacion: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/:\d{2}/, ':00')}</h2>
        
        {selectedLocation ? (
          <p className="text-lg">{selectedLocation}</p>
        ) : (
          <p className="text-lg text-gray-500">Haz click en uno de los marcadores en el mapa.</p>
        )}
      </div>
      <div className="w-1/2 ml-auto p-4 bg-gray-100 ">
        <MapContainer
          center={[25.6866, -100.3161]}
          zoom={10}
          style={{ height: '70%', width: '100%' }}
          className='bg-gray-100 rounded-lg'
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coordinates.map((coord, index) => (
            <Marker
              key={index}
              position={[coord.lat, coord.lon]}
              eventHandlers={{
                click: () => setSelectedLocation(coord.name),
              }}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>

  )
}