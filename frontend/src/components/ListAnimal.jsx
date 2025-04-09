import React, { useEffect, useState } from "react";
import { EyeIcon } from '@heroicons/react/outline'; // chỉ khi bạn đã cài heroicons

const sampleAnimalData = [
    { id: 1, name: "Ngọc", breed: "Bò sữa", age: "2 tuổi", status: "Khỏe mạnh", action: "Đứng", location: "Vị trí 1", deviceID: "123456", device_battery: "80%" },
    { id: 2, name: "Hà", breed: "Chó", age: "1 tuổi", status: "Khỏe mạnh", action: "Ngồi", location: "Vị trí 2", deviceID: "654321", device_battery: "60%" },
    { id: 3, name: "Bình", breed: "Mèo", age: "3 tuổi", status: "Khỏe mạnh", action: "Nằm", location: "Vị trí 3", deviceID: "789012", device_battery: "40%" },
    { id: 4, name: "Thảo", breed: "Gà", age: "6 tháng", status: "Khỏe mạnh", action: "Bay", location: "Vị trí 4", deviceID: "345678", device_battery: "20%" },
    { id: 5, name: "Tú", breed: "Cừu", age: "4 tuổi", status: "Khỏe mạnh", action: "Đi bộ", location: "Vị trí 5", deviceID: "901234", device_battery: "50%" },
    { id: 6, name: "Lan", breed: "Bò thịt", age: "5 tuổi", status: "Khỏe mạnh", action: "Đứng", location: "Vị trí 6", deviceID: "567890", device_battery: "30%" },
    { id: 7, name: "Mai", breed: "Ngựa", age: "7 tuổi", status: "Khỏe mạnh", action: "Chạy", location: "Vị trí 7", deviceID: "123789", device_battery: "10%" },
    { id: 8, name: "Hương", breed: "Lợn", age: "2 tuổi", status: "Khỏe mạnh", action: "Nằm", location: "Vị trí 8", deviceID: "456123", device_battery: "90%" },
];

const ListAnimal = ({ onSearch, searchTerm, setOnSearch }) => {
    const [animalList, setAnimalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [openFixInfoAnimal, setOpenFixInfoAnimal] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setAnimalList(sampleAnimalData);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredAnimals = animalList.filter((animal) =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAnimal = (animal) => {
        setSelectedAnimal(animal);
        setOnSearch(true);
        setOpenFixInfoAnimal(false);
    };

    const handleDelete = () => {
        const updatedList = animalList.filter((a) => a.id !== selectedAnimal.id);
        setAnimalList(updatedList);
        setSelectedAnimal(null);
        setOnSearch(false);
    };

    if (loading) {
        return <div className="text-center">Đang tải dữ liệu...</div>;
    }

    return (
        <div>
            {!onSearch ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-sky-100">
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Tên</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Giống</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Tuổi</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Trạng thái</th>
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
                                    <td className="py-3 px-6">{animal.name}</td>
                                    <td className="py-3 px-6">{animal.breed}</td>
                                    <td className="py-3 px-6">{animal.age}</td>
                                    <td className="py-3 px-6">{animal.status}</td>
                                    <td className="py-3 px-6">
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
                <div className="bg-white p-6 shadow-md rounded-lg overflow-hidden">
                    <div className="space-x-2 mb-4">
                        <button
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            onClick={() => {
                                setOnSearch(false);
                                setSelectedAnimal(null);
                            }}
                        >
                            Quay lại
                        </button>

                        <button 
                            className="bg-amber-500 text-white px-5 py-2 rounded-lg hover:bg-amber-600 transition-all"
                            onClick={() => {
                                setOpenFixInfoAnimal(true);
                            }}
                        >
                            Thay đổi
                        </button>

                        <button
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
                            onClick={handleDelete}
                        >
                            Xóa
                        </button>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Thông tin động vật</h3>

                    {selectedAnimal && (
                        <ul className="space-y-2 text-lg font-semibold">
                            <li>Tên: {selectedAnimal.name}</li>
                            <li>Giống: {selectedAnimal.breed}</li>
                            <li>Tuổi: {selectedAnimal.age}</li>
                            <li>Trạng thái: {selectedAnimal.status}</li>
                            <li>Hành động: {selectedAnimal.action}</li>
                            <li>ID thiết bị: {selectedAnimal.deviceID}</li>
                            <li>
                                Pin thiết bị: {selectedAnimal.device_battery}
                                {parseInt(selectedAnimal.device_battery) < 20 && (
                                    <span className="ml-2 text-red-500">⚠️ Yếu</span>
                                )}
                            </li>
                            <li>Vị trí: {selectedAnimal.location}</li>
                        </ul>
                    )}

                    {openFixInfoAnimal && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <h4 className="text-lg font-semibold mb-2">Thay đổi thông tin động vật</h4>
                            <form className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Tên động vật"
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    defaultValue={selectedAnimal.name}
                                />
                                <input
                                    type="text"
                                    placeholder="Giống động vật"
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    defaultValue={selectedAnimal.breed}
                                />
                                <input
                                    type="text"
                                    placeholder="Tuổi động vật"
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    defaultValue={selectedAnimal.age}
                                />
                                <input
                                    type="text"
                                    placeholder="Trạng thái động vật"
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                    defaultValue={selectedAnimal.status}
                                />
                            </form>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                                    onClick={() => setOpenFixInfoAnimal(false)}
                                >
                                    Lưu thay đổi
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
