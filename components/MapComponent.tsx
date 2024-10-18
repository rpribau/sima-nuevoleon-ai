import { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";

// Define types outside of the component to avoid issues with SSR
type Coordinate = {
  lat: number;
  lon: number;
  name: string;
};

type MapComponentProps = {
  coordinates: Coordinate[];
  stationsData: { [key: string]: { HrAveData: string; Parameter: string; }[] };
  onStationClick: (stationName: string) => void;
};

// Use dynamic import for the actual map component
const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

const MapComponent: React.FC<MapComponentProps> = ({ coordinates, stationsData, onStationClick }) => {
  return <DynamicMap coordinates={coordinates} stationsData={stationsData} onStationClick={onStationClick} />;
};

export default MapComponent;