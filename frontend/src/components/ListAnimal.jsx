import React, { useEffect, useState } from "react";
import { EyeIcon } from '@heroicons/react/outline';
import { handleGetAllCows, handleDeleteCow } from "../api/handleCow.jsx";
import { Icon } from "leaflet";
import { BiWifi, BiWifiOff } from "react-icons/bi";
import AnimalStatusCard from "./AnimalStatusCard";
import { handleSetDevice, handleDeleteDevice } from "../api/handleDevice.jsx";

const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    let d = today.getDate() - birthDate.getDate();
  
    if (m < 0 || (m === 0 && d < 0)) {
      age--;
    }
    if (age <= 0) {
      if (m <= 0) {
        if (d < 0) {
          d = 0;
        }
        return d + " ngày";
      }
      return m + " tháng";
    }
    return age + " năm";
  };


  

const ListAnimal = ({ accessToken, axiosJWT, dispatch, onSearch, searchTerm, setOnSearch }) => {
    const [animalList, setAnimalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [openFixInfoAnimal, setOpenFixInfoAnimal] = useState(false);
    const [connectDevice, setConnectDevice] = useState(true);
    const [activityStatus, setActivityStatus] = useState("Ăn");
    const [openConnectDevice, setOpenConnectDevice] = useState(false);
    const [deviceID, setDeviceID] = useState(null);
    const [errMsgDevice, setErrMsgDevice] = useState(null);

    useEffect(() => {
        const fetchCows = async () => {
            const cows = await handleGetAllCows(accessToken, axiosJWT, dispatch);
            setAnimalList(cows || []);
            setLoading(false);
            setConnectDevice(cows.length > 0); 
            setActivityStatus(cows.length > 0 ? "Hoạt động" : "Ngủ");
            if (selectedAnimal) {
                setConnectDevice(selectedAnimal.haveDevice);
            }
            setDeviceID(cows.deviceId);
            setErrMsgDevice(null);
            setOpenConnectDevice(false);
            setOpenFixInfoAnimal(false);
        };
        fetchCows();
    }, [accessToken, axiosJWT, dispatch, selectedAnimal]);

    const filteredAnimals = animalList.filter((Cow) =>
        Cow.nameCow.toLowerCase().includes(searchTerm.toLowerCase())
        || Cow.idCow.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAnimal = (animal) => {
        setSelectedAnimal(animal);
        setOnSearch(true);
        setOpenFixInfoAnimal(false);
    };

    const handleDelete = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa động vật này không?")) {
            const updatedList = animalList.filter((a) => a.idCow !== selectedAnimal.idCow);
            handleDeleteCow(selectedAnimal.idCow, accessToken, axiosJWT, dispatch);
            setAnimalList(updatedList);
            setSelectedAnimal(null);
            setOnSearch(false);
        }
    };    

    if (loading) {
        return <div className="text-center">Đang tải dữ liệu...</div>;
    }

    const fixconnectDevice = () => {
        handleSetDevice(selectedAnimal.idCow, deviceID, accessToken, axiosJWT, dispatch, setErrMsgDevice);
        setOpenConnectDevice(false);
        setConnectDevice(true);
        setSelectedAnimal(null);
    }

    const deleteDevice = () => {
        handleDeleteDevice(selectedAnimal.idCow, accessToken, axiosJWT, dispatch, setErrMsgDevice);
        setOpenConnectDevice(false);
        setConnectDevice(false);
        setSelectedAnimal(null);
        setDeviceID(null);
    }

    return (
        <div>
            {!onSearch ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4">
                    <thead>
                        <tr className="bg-sky-100">
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">ID</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Tên</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Trạng thái</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Kết nối</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAnimals.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    Không tìm thấy động vật nào.
                                </td>
                            </tr>
                        ) : (
                            filteredAnimals.map((animal) => (
                                <tr key={animal.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{animal.idCow}</td>
                                    <td className="py-3 px-6">{animal.nameCow}</td>
                                    <td className="py-3 px-6">{animal.statusCow}</td>
                                    <td className="py-3 px-6">
                                        {animal.haveDevice ? (
                                            <BiWifi className="text-green-500" size={24} />
                                        ) : (
                                            <BiWifiOff className="text-red-500" size={24} />
                                        )}
                                    </td>    
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => handleSelectAnimal(animal)}
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <div className="space-x-2 mb-4 flex items-center gap-2 border-b pb-4">
                        <button
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => {
                                setOnSearch(false);
                                setSelectedAnimal(null);
                            }}
                        >
                            Quay lại
                        </button>

                        <button
                            className="bg-amber-500 text-white px-5 py-2 rounded-lg hover:bg-amber-600"
                            onClick={() => setOpenFixInfoAnimal(true)}
                        >
                            Cập nhật thông tin
                        </button>

                        <button 
                            className="bg-sky-800 text-white px-5 py-2 rounded-lg hover:bg-sky-900"
                            onClick={() => setOpenConnectDevice(true)}
                        >
                            Đổi thiết bị
                        </button>

                        <button
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Xóa
                        </button>
                    </div>

                    {selectedAnimal && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-center">Thông tin động vật</h2>
                            <div className="flex flex-col md:flex-row gap-4">
                                <table className="md:w-2/3 bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                                    <tbody>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-6 font-semibold">Tên:</td>
                                            <td className="py-3 px-6">{selectedAnimal.nameCow}</td>
                                        </tr>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-6 font-semibold">Giống:</td>
                                            <td className="py-3 px-6">{selectedAnimal.breedCow}</td>
                                        </tr>
                                        <tr className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-6 font-semibold">Ngày sinh:</td>
                                        <td className="py-3 px-6">
                                            {selectedAnimal.birthDateCow &&
                                            new Date(selectedAnimal.birthDateCow).toLocaleDateString('vi-VN')} - {calculateAge(selectedAnimal.birthDateCow)} tuổi 
                                        </td>
                                        </tr>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-6 font-semibold">Giới tính:</td>
                                            {selectedAnimal.genderCow === "M" ? (
                                                <td className="py-3 px-6">Đực</td>
                                            ) : selectedAnimal.genderCow === "F" ? (
                                                <td className="py-3 px-6">Cái</td>
                                            ) : (
                                                <td className="py-3 px-6">Chưa có thông tin</td>
                                            )}
                                        </tr>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-6 font-semibold">Trạng thái:</td>
                                            <td className="py-3 px-6">{selectedAnimal.statusCow}</td>
                                        </tr>   
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-6 font-semibold">Ngày tạo:</td>
                                            <td className="py-3 px-6">
                                                {selectedAnimal.createdAt
                                                ? new Date(selectedAnimal.createdAt).toLocaleDateString('vi-VN')
                                                : 'Chưa có thông tin'}
                                            </td>
                                        </tr>
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-6 font-semibold">ID thiết bị:</td>
                                            <td className="py-3 px-6">
                                                {selectedAnimal.deviceId || "Chưa có thiết bị"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="md:w-1/3 bg-white p-6 shadow-md rounded-lg overflow-hidden">
                                    <AnimalStatusCard
                                        connectDevice={connectDevice}
                                        selectedAnimal={selectedAnimal}
                                        activityStatus={activityStatus}
                                        batteryPercent={80}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {openFixInfoAnimal && (
                    <div className="mt-4 p-6 bg-white rounded-xl shadow-md">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">✏️ Thay đổi thông tin động vật</h4>

                        <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên động vật</label>
                            <input
                            type="text"
                            placeholder="Tên động vật"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            defaultValue={selectedAnimal.nameCow}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giống loài</label>
                            <input
                            type="text"
                            placeholder="Giống loài"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            defaultValue={selectedAnimal.breedCow}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            defaultValue={selectedAnimal.birthDateCow}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                            <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            defaultValue={selectedAnimal.genderCow}
                            >
                            <option value="M">Đực</option>
                            <option value="F">Cái</option>
                            <option value="U">Chưa xác định</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <input
                            type="text"
                            placeholder="Trạng thái"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            defaultValue={selectedAnimal.statusCow}
                            />
                        </div>
                        </form>

                        <div className="mt-6 flex justify-end space-x-3">
                        <button
                            className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400"
                            onClick={() => setOpenFixInfoAnimal(false)}
                        >
                            Đóng
                        </button>
                        <button
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                            onClick={() => setOpenFixInfoAnimal(false)} // Có thể thay bằng hàm handleSave()
                        >
                            Lưu thay đổi
                        </button>
                        </div>
                    </div>
                    )}


                    {openConnectDevice && (
                    <div className="mt-4 p-6 bg-white rounded-xl shadow-md">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">🔗 Kết nối thiết bị</h4>

                        <div className="mb-4">
                        <p className="text-gray-600">
                            <span className="font-medium">Thiết bị hiện tại:</span>{" "}
                            {selectedAnimal.deviceId || <span className="italic text-gray-400">Chưa có thiết bị</span>}
                        </p>
                        {selectedAnimal.deviceId && (
                            <button
                            className="mt-2 text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
                            onClick={() => deleteDevice()}
                            >
                            Xóa thiết bị
                            </button>
                        )}
                        {errMsgDevice && <p className="mt-2 text-sm text-red-500">{errMsgDevice}</p>}
                        </div>

                        <div className="mb-4">
                        <label htmlFor="deviceId" className="block text-gray-700 mb-1 font-medium">
                            Nhập ID thiết bị mới:
                        </label>
                        <input
                            type="text"
                            id="deviceId"
                            value={deviceID}
                            onChange={(e) => setDeviceID(e.target.value)}
                            placeholder="ID thiết bị"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        </div>

                        <div className="flex justify-end space-x-3">
                        <button
                            className="px-5 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                            onClick={() => setOpenConnectDevice(false)}
                        >
                            Đóng
                        </button>
                        <button
                            className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                            onClick={() => fixconnectDevice(selectedAnimal.deviceId)}
                        >
                            Kết nối
                        </button>
                        </div>
                    </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListAnimal;