import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handleLogout } from "../api/auth"; 
import { createAxios } from "../createInstance";
import { loginSuccess } from "../redux/authSlice";
import { handleAddCow } from "../api/handleCow";
import { handleSetGateway } from "../api/handleGateway"; // Import hàm thêm Gateway
import Map from "./Map"; 
import ListAnimal from "./ListAnimal";
import Notification from './Notification';

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
    const [successful, setSuccessful] = useState(false);

    const [nameCow, setNameCow] = useState("");
    const [breedCow, setBreedCow] = useState("");
    const [birthDateCow, setBirthDateCow] = useState("");
    const [weightCow, setWeightCow] = useState("");
    const [genderCow, setGenderCow] = useState("");
    const [statusCow, setStatusCow] = useState("");
    const [openFormGateway, setOpenFormGateway] = useState(false);
    const [gatewayId, setGatewayId] = useState("");
    
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
        setSuccessful(false);
        if (!nameCow) {
            setError("Tên động vật không được để trống!");
            return;
        }
        try {
            const newAnimal = {
                nameCow: nameCow,
                breedCow: breedCow,
                birthDateCow: birthDateCow,    
                weightCow: parseFloat(weightCow),
                genderCow: genderCow,
                statusCow: statusCow,
            };
            const res = await handleAddCow(newAnimal, accessToken, axiosJWT, dispatch, setError);
            if (res) {
                setNameCow("");
                setBreedCow("");
                setBirthDateCow("");
                setWeightCow("");
                setGenderCow("");
                setStatusCow("");
                setSuccessful(true);
                setError("");
            }
        } catch (error) {
            setSuccessful(false);
            setError(error.message || "Thêm động vật thất bại!");
            console.error("Add animal error:", error.message);
        }
    }

    const addGateway = async () => {
        setSuccessful(false);
        if (!gatewayId) {
            setError("ID Gateway không được để trống!");
            return;
        }
        try {
            const res = await handleSetGateway(gatewayId, accessToken, axiosJWT, dispatch, setError);
            if (res) {
                setGatewayId("");
                setSuccessful(true);
                setError("");
            }
        } catch (error) {
            setSuccessful(false);
            setError(error.message || "Thêm Gateway thất bại!");
            console.error("Add gateway error:", error.message);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* NAVIGATION */}
            <nav className="bg-white text-blue-600 p-4 flex justify-between items-center shadow-md">
                <div className="text-4xl font-bold text-sky-500">
                    <Link to="/dashboard">SFarm</Link>
                </div>
                <ul className="flex space-x-2 text-sky-700 font-semibold text-lg">
                    <Link to="/dashboard" className="hover:text-gray-400">Trang chủ</Link>
                    <span>|</span>
                    <Link to="/dashboard" className="hover:text-gray-400">Giới thiệu</Link>
                    <span>|</span>
                    <Link to="/dashboard" className="hover:text-gray-400">Liên hệ</Link>
                </ul>
                <div className="flex space-x-4 items-center">
                    {request && (
                        <p className="text-lg text-sky-700">
                            Xin chào, <span>{request.user.name}</span>
                        </p>
                    )}
                    <button
                        className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white"
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
            
            <Notification /> {/* Thông báo từ WebSocket */}

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
                        >
                            Thêm động vật
                        </button>
                        <button 
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            onClick={() => setOpenFormGateway(true)}
                        >
                            Thêm Gateway
                        </button>
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
                <div className="w-1/2 bg-white p-6 shadow-md rounded-lg overflow-hidden overflow-y-auto max-h-[900px]">
                    <ListAnimal
                        accessToken={accessToken}
                        axiosJWT={axiosJWT}
                        dispatch={dispatch}
                        onSearch={onSearch}
                        searchTerm={searchTerm}
                        setOnSearch={setOnSearch}
                    ></ListAnimal>
                </div>
            </main>

            {/*MODEL THÊM ĐỘNG VẬT*/}
            {openFormAdd && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                    onClick={() => setOpenFormAdd(false)}
                >
                    <div
                    className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSuccessful(false);
                    }}
                    >
                    <h2 className="text-xl font-bold text-center text-blue-600 mb-2">Thêm động vật</h2>
                    <p className="text-center text-gray-600 mb-4 text-sm">
                        Vui lòng điền đầy đủ thông tin động vật cần thêm.
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm" role="alert">
                        {error}
                        </div>
                    )}

                    {!error && successful && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm" role="alert">
                        Thêm động vật thành công!
                        </div>
                    )}

                    {/* Tên động vật */}
                    <div>
                        <label className="font-medium text-gray-700">Tên động vật <span className="text-red-500">*</span></label>
                        <input
                        value={nameCow}
                        onChange={(e) => setNameCow(e.target.value)}
                        type="text"
                        placeholder="Nhập tên động vật"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Giống loài */}
                    <div className="mt-3">
                        <label className="font-medium text-gray-700">Giống loài </label>
                        <input
                        value={breedCow}
                        onChange={(e) => setBreedCow(e.target.value)}
                        type="text"
                        placeholder="Nhập giống loài"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Ngày sinh */}
                    <div className="mt-3">
                        <label className="font-medium text-gray-700">Ngày sinh </label>
                        <input
                        value={birthDateCow}
                        onChange={(e) => setBirthDateCow(e.target.value)}
                        type="date"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Cân nặng */}
                    <div className="mt-3">
                        <label className="font-medium text-gray-700">Cân nặng (kg) </label>
                        <input
                        value={weightCow}
                        onChange={(e) => setWeightCow(e.target.value)}
                        type="number"
                        placeholder="Nhập cân nặng"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Giới tính */}
                    <div className="mt-3">
                        <label className="font-medium text-gray-700">Giới tính </label>
                        <select
                        value={genderCow}
                        onChange={(e) => setGenderCow(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="">Chọn giới tính</option>
                        <option value="M">Đực</option>
                        <option value="F">Cái</option>
                        </select>
                    </div>

                    {/* Trạng thái */}
                    <div className="mt-3">
                        <label className="font-medium text-gray-700">Trạng thái </label>
                        <input
                        value={statusCow}
                        onChange={(e) => setStatusCow(e.target.value)}
                        type="text"
                        placeholder="Nhập trạng thái"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Nút thêm */}
                    <button
                        onClick={addAnimal}
                        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
                    >
                        Thêm động vật
                    </button>

                    {/* Nút đóng */}
                    <button
                        onClick={() => {
                        setOpenFormAdd(false);
                        setError("");
                        setSuccessful("");
                        }}
                        className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition duration-200"
                    >
                        Đóng
                    </button>
                    </div>
                </div>
                )}

            {/*MODEL THÊM GATEWAY*/}
            {openFormGateway && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                    onClick={() => setOpenFormAdd(false)}
                >
                    <div
                    className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSuccessful(false);
                    }}
                    >
                    <h2 className="text-xl font-bold text-center text-blue-600 mb-2">Thêm Gateway</h2>
                    <p className="text-center text-gray-600 mb-4 text-sm">
                        Vui lòng điền ID của Gateway.
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm" role="alert">
                        {error}
                        </div>
                    )}

                    {!error && successful && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm" role="alert">
                        Thêm Gateway thành công!
                        </div>
                    )}

                    <div>
                        <input
                        value={gatewayId}
                        onChange={(e) => setGatewayId(e.target.value)}
                        type="text"
                        placeholder="Nhập ID của Gateway"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Nút thêm */}
                    <button
                        onClick={addGateway}
                        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
                    >
                        Thêm
                    </button>

                    {/* Nút đóng */}
                    <button
                        onClick={() => {
                        setOpenFormGateway(false);
                        setError("");
                        setSuccessful("");
                        }}
                        className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition duration-200"
                    >
                        Đóng
                    </button>
                    </div>
                </div>
            )}
            {/* FOOTER */}
            <footer className="bg-gray-800 text-white p-6 text-center">
                <p>&copy; 2025 SFARM. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;

