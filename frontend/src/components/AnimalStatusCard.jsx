import React from "react";
import { BiWifi, BiWifiOff } from "react-icons/bi";

// Component phụ: Thiết bị kết nối
const DeviceStatus = ({ deviceId }) => (
  <div className="flex flex-col items-center bg-green-200 p-4 rounded-lg w-full border border-green-400 hover:bg-green-300 transition duration-200 ease-in-out">
    <BiWifi className="text-3xl text-green-700 mb-2" />
    <p className="text-sm font-medium text-green-800">Thiết bị ID: {deviceId}</p>
  </div>
);

// Component phụ: Trạng thái hoạt động
const ActivityStatus = ({ status }) => (
  <div className="flex flex-col items-center bg-sky-200 p-4 rounded-lg w-full">
    <h4 className="text-lg font-semibold mb-1">Hoạt động</h4>
    <h2 className="text-xl font-semibold text-green-800">{status}</h2>
  </div>
);

// Component phụ: Mức pin
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

// Component phụ: Mất kết nối
const DisconnectedMessage = () => (
  <div className="flex flex-col items-center bg-red-200 p-4 rounded-lg w-full border border-red-400">
    <BiWifiOff className="text-3xl text-red-700 mb-2" />
    <p className="text-lg font-semibold text-red-800">Mất kết nối với thiết bị</p>
  </div>
);

// Component phụ: Không có thiết bị
const NoDeviceMessage = () => (
  <div className="flex flex-col items-center bg-red-200 p-4 rounded-lg w-full border border-red-400">
    <BiWifiOff className="text-3xl text-red-700 mb-2" />
    <p className="text-lg font-semibold text-red-800">Không có thiết bị</p>
  </div>
);

// Component chính
const AnimalStatusCard = ({ connectDevice, selectedAnimal, activityStatus, batteryPercent }) => {
  if (!selectedAnimal?.haveDevice) {
    return <NoDeviceMessage />;
  }

  if (!connectDevice) {
    return <DisconnectedMessage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <DeviceStatus deviceId={selectedAnimal.deviceId} />
      <ActivityStatus status={activityStatus} />
      <BatteryLevel level={batteryPercent} />
    </div>
  );
};

export default AnimalStatusCard;
