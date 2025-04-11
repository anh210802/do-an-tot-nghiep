import React, { useEffect, useState } from "react";
import { EyeIcon } from '@heroicons/react/outline';
import { handleGetAllCows } from "../api/handleCow.jsx";

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

    useEffect(() => {
        const fetchCows = async () => {
            const cows = await handleGetAllCows(accessToken, axiosJWT, dispatch);
            setAnimalList(cows || []);
            setLoading(false);
        };

        fetchCows();
    }, [accessToken, axiosJWT, dispatch]);

    const filteredAnimals = animalList.filter((Cow) =>
        Cow.nameCow.toLowerCase().includes(searchTerm.toLowerCase())
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
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4">
                    <thead>
                        <tr className="bg-sky-100">
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Tên</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Giống</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Tuổi</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Cân nặng</th>
                            <th className="py-3 px-6 text-left font-semibold text-gray-700">Giới tính</th>
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
                                    <td className="py-3 px-6">{animal.nameCow}</td>
                                    <td className="py-3 px-6">{animal.breedCow}</td>
                                    <td className="py-3 px-6">
                                        {animal.birthDateCow ? `${calculateAge(animal.birthDateCow)} tuổi` : ""}
                                    </td>
                                    <td className="py-3 px-6 text-center">{animal.weightCow}</td>
                                    {animal.genderCow === "M" ? (
                                        <td className="py-3 px-6 text-center">Đực</td>
                                    ) : animal.genderCow === "F" ? (
                                        <td className="py-3 px-6 text-center">Cái</td>  
                                    ) : (
                                        <td className="py-3 px-6 text-center"></td>
                                    )}
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
                    <div className="space-x-2 mb-4">
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
                            Thay đổi
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
                            <h3 className="text-xl font-semibold mb-4">Thông tin động vật</h3>
                            <ul className="space-y-2 text-lg font-semibold">
                                <li>Tên: {selectedAnimal.nameCow}</li>
                                <li>Giống: {selectedAnimal.breedCow}</li>
                                <li>Tuổi: {selectedAnimal.ageCow}</li>
                                <li>Hành động: {}</li>
                                <li>ID thiết bị: {}</li>
                                <li>
                                    Pin thiết bị: {}
                                    {parseInt() < 20 && (
                                        <span className="ml-2 text-red-500">⚠️ Yếu</span>
                                    )}
                                </li>
                                <li>Vị trí: {}</li>
                            </ul>
                        </div>
                    )}

                    {openFixInfoAnimal && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <h4 className="text-lg font-semibold mb-2">Thay đổi thông tin</h4>
                            <form className="space-y-2">
                                <input type="text" placeholder="Tên động vật" className="w-full px-4 py-2 border rounded" defaultValue={selectedAnimal.nameCow} />
                                <input type="text" placeholder="Giống loài" className="w-full px-4 py-2 border rounded" defaultValue={selectedAnimal.breedCow} />
                                <input type="text" placeholder="Tuổi" className="w-full px-4 py-2 border rounded" defaultValue={selectedAnimal.ageCow} />
                                <input type="text" placeholder="Trạng thái" className="w-full px-4 py-2 border rounded" defaultValue={null} />
                            </form>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
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