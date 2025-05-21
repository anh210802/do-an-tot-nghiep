import React from "react";
import { BiWifi, BiWifiOff } from "react-icons/bi";
import { useState, useEffect } from "react";

const wsUrl = import.meta.env.VITE_WSS_URL || "ws://localhost:8081/ws";

const DeviceStatus = ({ deviceId }) => {
  const [findDevice, setFindDevice] = useState(false);
  return (
    <button 
    className="flex flex-col items-center bg-green-200 p-4 rounded-lg w-full border border-green-400 hover:bg-green-300 transition duration-200 ease-in-out"
    onClick={() => {
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        if (import.meta.env.DEV) {
          console.log("Connected to WebSocket server.");
        }
        if (findDevice === false) {
          ws.send(JSON.stringify({ request: "find_device", device_id: deviceId, find_state: "on" }));
          setFindDevice(true);
        } else {
          ws.send(JSON.stringify({ request: "find_device", device_id: deviceId, find_state: "off" }));
          setFindDevice(false);
        }
      };
    }}
    >
      <BiWifi className="text-3xl text-green-700 mb-2" />
      <p className="text-sm font-medium text-green-800">Thiết bị ID: {deviceId}</p>
    </button>
  );
};

const ActivityStatus = ({ deviceId }) => {
  const [action, setAction] = useState(null);

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
        if (data.request === "info_data" && data.device_id === deviceId) {
          if (data.state === "Standing") {
            setAction("Đang đứng");
          }
          else if (data.state === "Lying") {
            setAction("Đang nằm");
          }
          else if (data.state === "Feeding") {
            setAction("Đang ăn");
          }
        }
      } catch (err) {
        console.error("Lỗi parse dữ liệu WebSocket:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [deviceId]);

  return (
    <div className="flex flex-col items-center bg-sky-200 p-4 rounded-lg w-full">
      <h4 className="text-lg font-semibold mb-1">Hoạt động</h4>
      <h2 className="text-xl font-semibold text-green-800">
        {action || "Đang tải..."}
      </h2>
    </div>
  );
};

const BatteryLevel = ({ level }) => {
  const batteryColor =
    level > 60 ? "text-green-700" : level > 30 ? "text-yellow-700" : "text-red-700";

  return (
    <div className="flex flex-col items-center bg-yellow-200 p-4 rounded-lg w-full">
      <h4 className="text-lg font-semibold mb-1">Thời lượng pin</h4>
      <h2 className={`text-xl font-semibold ${batteryColor}`}>{level}%</h2>
    </div>
  );
};

const DisconnectedMessage = () => (
  <div className="flex flex-col items-center bg-red-200 p-4 rounded-lg w-full border border-red-400">
    <BiWifiOff className="text-3xl text-red-700 mb-2" />
    <p className="text-lg font-semibold text-red-800">Mất kết nối với thiết bị</p>
  </div>
);

const NoDeviceMessage = () => (
  <div className="flex flex-col items-center bg-red-200 p-4 rounded-lg w-full border border-red-400">
    <BiWifiOff className="text-3xl text-red-700 mb-2" />
    <p className="text-lg font-semibold text-red-800">Không có thiết bị</p>
  </div>
);

const AnimalStatusCard = ({ connectDevice, selectedAnimal, batteryPercent }) => {
  if (!selectedAnimal?.haveDevice) {
    return <NoDeviceMessage />;
  }

  if (!connectDevice) {
    return <DisconnectedMessage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <DeviceStatus deviceId={selectedAnimal.deviceId} />
      <ActivityStatus deviceId={selectedAnimal.deviceId} />
      <BatteryLevel level={batteryPercent} />
    </div>
  );
};

export default AnimalStatusCard;
