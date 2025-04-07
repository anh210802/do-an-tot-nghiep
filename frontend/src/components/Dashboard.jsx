import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { handleLogout } from "../api/auth"; 
import { createAxios } from "../createInstance";
import { loginSuccess } from "../redux/authSlice";
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


    useEffect(() => {
        if (!request) {
            navigate("/"); 
        }
    }, [request, navigate]);
    
    useEffect(() => {
        if (searchTerm.trim() !== "") {
            setOnSearch(false);
        } else {
            setOnSearch(false);
        }
    }, [searchTerm]);
    

    const logout = async () => {
        handleLogout(dispatch, navigate, accessToken, axiosJWT);
    };

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

            {openFormAdd && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setOpenFormAdd(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-96 z-60 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-blue-600 text-center">Thêm động vật</h2>
                        {/* Form to add animal */}
                        <button
                            onClick={() => setOpenFormAdd(false)}
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

