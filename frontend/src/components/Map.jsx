import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const position = [51.505, -0.09]; // Vị trí mặc định của bản đồ (London)
  const zoom = 13; // Độ zoom

  return (
    <div className="w-full h-200 bg-gray-100 rounded-lg shadow-md p-4">
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} className="h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
