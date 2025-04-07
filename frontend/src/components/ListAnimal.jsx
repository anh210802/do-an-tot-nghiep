import React, { useEffect, useState } from "react";

// Sample data (replace with API call if needed)
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

    // States for animal details when clicked on an animal for detailed view
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    useEffect(() => {
        // Simulating an API call (or you can replace this with actual data fetching)
        setTimeout(() => {
            setAnimalList(sampleAnimalData);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    const filteredAnimals = animalList.filter((animal) =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle animal selection to show detailed view
    const handleSelectAnimal = (animal) => {
        setSelectedAnimal(animal);
        setOnSearch(true); // Set onSearch to true to show the detailed view
    };

    return (
        <div>
            {!onSearch ? (
                <div>
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
                            {filteredAnimals.map((animal) => (
                                <tr key={animal.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{animal.name}</td>
                                    <td className="py-3 px-6">{animal.breed}</td>
                                    <td className="py-3 px-6">{animal.age}</td>
                                    <td className="py-3 px-6">{animal.status}</td>
                                    <td className="py-3 px-6">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => handleSelectAnimal(animal)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white p-6 shadow-md rounded-lg overflow-hidden">
                    <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all mb-4"
                        onClick={() => {
                            setOnSearch(false); // Set onSearch to false to go back to the list
                            setSelectedAnimal(null); // Clear the selected animal
                        }}
                    >
                        Quay lại
                    </button>
                    <h3 className="text-xl font-semibold mb-4">Thông tin động vật</h3>
                    {selectedAnimal && (
                        
                        <>
                            <p className="text-lg font-semibold">Tên: {selectedAnimal.name}</p>
                            <p className="text-lg font-semibold">Giống: {selectedAnimal.breed}</p>
                            <p className="text-lg font-semibold">Tuổi: {selectedAnimal.age}</p>
                            <p className="text-lg font-semibold">Trạng thái: {selectedAnimal.status}</p>
                            <p className="text-lg font-semibold">Hành động: {selectedAnimal.action}</p>
                            <p className="text-lg font-semibold">ID thiết bị: {selectedAnimal.deviceID}</p>
                            <p className="text-lg font-semibold">Pin thiết bị: {selectedAnimal.device_battery}</p>
                            <p className="text-lg font-semibold">Vị trí: {selectedAnimal.location}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListAnimal;
