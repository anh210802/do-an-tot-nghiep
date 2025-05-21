import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';

const wsUrl = import.meta.env.VITE_WSS_URL || "ws://localhost:8081/ws";

const FitBoundsOnce = ({ positions }) => {
  const map = useMap();
  const hasFitBounds = useRef(false); // lưu trạng thái đã fit chưa

  useEffect(() => {
    if (!hasFitBounds.current && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
      hasFitBounds.current = true;  // đánh dấu đã fitBounds rồi
    }
  }, [positions, map]);

  return null;
};

const Map = () => {
  const [devices, setDevices] = useState([]);  // Track multiple devices

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (import.meta.env.DEV) {
        console.log("Connected to WebSocket server.");
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.request === "gps_data") {
          setDevices((prevDevices) => {
            // Check if the device already exists in the list, and update its position.
            const deviceIndex = prevDevices.findIndex(device => device.id === data.device_id);
            if (deviceIndex !== -1) {
              // Update the existing device's position
              const updatedDevices = [...prevDevices];
              updatedDevices[deviceIndex] = { ...updatedDevices[deviceIndex], position: [data.latitude, data.longitude] };
              return updatedDevices;
            } else {
              // Add new device if it's not already in the list
              return [...prevDevices, { id: data.device_id, position: [data.latitude, data.longitude] }];
            }
          });
        }
      } catch (err) {
        console.error("Lỗi parse dữ liệu WebSocket:", err);
      }
    };

    return () => {
      ws.close();  // Clean up WebSocket connection
    };
  }, []);  // Empty dependency array to run only once when component mounts

  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg shadow-md p-4">
      <MapContainer
        center={[14.0583, 108.2772]} // trung tâm Việt Nam
        zoom={6}
        scrollWheelZoom={false}
        className="h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Fit bounds một lần khi có thiết bị */}
        <FitBoundsOnce positions={devices.map(device => device.position)} />

        {devices.map((device) => (
          <Marker key={device.id} position={device.position}>
            <Popup>
              Device ID: {device.id} <br />
              Latitude: {device.position[0]} <br />
              Longitude: {device.position[1]}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
