import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handleLogout } from "../api/auth"; 
import { createAxios } from "../createInstance";
import { loginSuccess } from "../redux/authSlice";
import { handleAddCow } from "../api/handleCow";
import Map from "./Map"; 
import ListAnimal from "./ListAnimal";



const Dashboard = () => {
    const request = useSelector((state) => state.auth.login?.currentUser);
    const accessToken = request?.accessToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(request, dispatch, loginSuccess);


    const [searchTerm, setSearchTerm] = useState("");
    const [onSearch, setOnSearch] = useState(false);
    const [openFormAdd, setOpenFormAdd] = useState(false);
    const [error, setError] = useState("");
    const [successful, setSuccessful] = useState("");

    const [nameCow, setNameCow] = useState("");
    const [breedCow, setBreedCow] = useState("");
    const [birthDateCow, setBirthDateCow] = useState("");
    const [weightCow, setWeightCow] = useState("");
    const [genderCow, setGenderCow] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setOnSearch(false);
        if (!request) {
            navigate("/"); 
        }
    }, [request, navigate, searchTerm]);

    const logout = async () => {
        handleLogout(dispatch, navigate, accessToken, axiosJWT);
    };

    const addAnimal = async (e) => {
        e.preventDefault();
        if (!nameCow && !breedCow && !birthDateCow && !weightCow && !genderCow) {
            setError("Vui lòng điền đầy đủ thông tin!");
            setSuccessful(false);
            return;
        }
        try {
            const newAnimal = {
                nameCow: nameCow,
                breedCow: breedCow,
                birthDateCow: birthDateCow,    
                weightCow: parseFloat(weightCow),
                genderCow: genderCow,
            };
            setIsLoading(true);
            setError("");
            const res = await handleAddCow(newAnimal, accessToken, axiosJWT, dispatch);
            if (res) {
                setIsLoading(false);
                setOpenFormAdd(false);
                setNameCow("");
                setBreedCow("");
                setBirthDateCow("");
                setWeightCow("");
                setGenderCow("");
                setSuccessful("Thêm động vật thành công!");
                setError(false);
            }
        } catch (error) {
            setIsLoading(false);
            setSuccessful(false);
            setError(error.message || "Thêm động vật thất bại!");
            console.error("Add animal error:", error.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* NAVIGATION */}
            <nav className="bg-white shadow-lg p-5 flex justify-between items-center border-b border-gray-300">
                <div className="text-4xl font-extrabold text-sky-600">
                    <Link to="/dashboard">SFarm</Link>
                </div>
                <ul className="flex space-x-6 text-lg font-medium text-sky-600">
                    <li><Link to="/dashboard" className="hover:text-blue-500">Trang chủ</Link></li>
                    <li><Link to="/dashboard" className="hover:text-blue-500">Giới thiệu</Link></li>
                    <li><Link to="/dashboard" className="hover:text-blue-500">Liên hệ</Link></li>
                </ul>
                <div className="flex space-x-4 items-center">
                    {request && (
                        <p className="text-lg text-sky-700">
                            Xin chào, <span>{request.user.name}</span>
                        </p>
                    )}
                    <button
                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
                        onClick={logout}
                    >
                        Đăng xuất
                    </button>
                </div>
            </nav>

            {/* HEADER */}
            <header className="bg-sky-600 text-white text-3xl font-bold p-5 text-center">
                Hệ thống giám sát hoạt động của động vật
            </header>

            {/* SEARCH AND BUTTONS */}
            <div className="bg-white p-6 shadow-md rounded-xl mx-6 mt-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 w-2/3">
                        <input
                            type="search"
                            placeholder="Tìm kiếm bò ..."
                            className="border border-gray-300 rounded-full px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button 
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all"
                            onClick={() => setOpenFormAdd(true)}
                        >Thêm động vật</button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="flex justify-between p-6 space-x-6">
                {/* ANIMAL LOCATION */}
                <div className="w-1/2 bg-white p-6 shadow-md rounded-lg overflow-hidden">
                    <h3 className="text-xl font-semibold mb-4 text-sky-700">Vị trí của động vật</h3>
                    <Map />
                </div>

                {/* ANIMAL LIST OR DETAILS */}
                <div className="w-1/2 bg-white p-6 shadow-md rounded-lg overflow-hidden">
                    <ListAnimal onSearch={onSearch} searchTerm={searchTerm} setOnSearch={setOnSearch} />
                </div>
            </main>

            {/*MODEL THÊM ĐỘNG VẬT*/}
            {openFormAdd && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setOpenFormAdd(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-96 z-60 relative"
                        onClick={(e) => {e.stopPropagation(); e.setError(""); e.setSuccessful("");}}
                    >
                        <h2 className="text-xl font-bold text-blue-600 text-center">Thêm động vật</h2>
                        <p className="text-center text-gray-500 mb-4">Nhập thông tin động vật</p>
                        {/* Form to add animal */}
                        {isLoading && (
                            <div className="flex justify-center items-center mb-4">
                                <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4.93 4.93a10 10 0 0 1 14.14 14.14A10 10 0 0 1 4.93 4.93z"></path>
                                </svg>
                            </div>
                        )}
                        {isLoading && <p className="text-center text-gray-500 mb-4">Đang xử lý...</p>}
                        {!isLoading && successful && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span className="block sm:inline">{successful}</span>
                            </div>
                        )
}
                        {successful && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span className="block sm:inline">{successful}</span>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <input
                            value={nameCow}
                            onChange={(e) => setNameCow(e.target.value)}
                            type="text"
                            placeholder="Tên động vật"
                            className="w-full p-2 border rounded mt-3"
                        />
                        <input
                            value={breedCow}
                            onChange={(e) => setBreedCow(e.target.value)}
                            type="text"
                            placeholder="Giống loài"
                            className="w-full p-2 border rounded mt-3"
                        />
                        <input
                            value={birthDateCow}
                            onChange={(e) => setBirthDateCow(e.target.value)}
                            type="date"
                            placeholder="Ngày sinh"
                            className="w-full p-2 border rounded mt-3"
                        />
                        <input
                            value={weightCow}
                            onChange={(e) => setWeightCow(e.target.value)}
                            type="number"
                            placeholder="Cân nặng (kg)"
                            className="w-full p-2 border rounded mt-3"
                        />
                        <select
                            value={genderCow}
                            onChange={(e) => setGenderCow(e.target.value)}
                            className="w-full p-2 border rounded mt-3"
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="M">Đực</option>
                            <option value="F">Cái</option>
                        </select>
                        <button
                            onClick={addAnimal}
                            className="w-full bg-blue-600 text-white p-2 rounded mt-3"
                        >
                            Thêm động vật
                        </button>
                        <button
                            onClick={() => {setOpenFormAdd(false); setError(""); setSuccessful("");}}
                            className="w-full bg-red-500 text-white p-2 rounded mt-3"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}


            {/* FOOTER */}
            <footer className="bg-gray-800 text-white p-6 text-center">
                <p>&copy; 2024 Afsmart. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;

