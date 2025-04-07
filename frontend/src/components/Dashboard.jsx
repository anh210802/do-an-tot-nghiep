import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { handleLogout } from "../api/auth"; 
import { createAxios } from "../createInstance";
import { loginSuccess } from "../redux/authSlice";
import Map from "./Map"; 

// test
import ListAnimal from "./ListAnimal";

const Dashboard = () => {
    const request = useSelector((state) => state.auth.login?.currentUser);
    const accessToken = request?.accessToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(request, dispatch, loginSuccess);


    const [searchTerm, setSearchTerm] = useState("");
    const [onSearch, setOnSearch] = useState(false);


    useEffect(() => {
        if (!request) {
            navigate("/"); 
        }
    }, [dispatch, request, navigate]);

    const logout = async () => {
        handleLogout(dispatch, navigate, accessToken, axiosJWT);
    };

    const search = () => {
        if (searchTerm) {
            setOnSearch(true);
        } else {
            setOnSearch(false);
        }
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
                        {/* <button
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            onClick={search}
                        >
                            Tìm kiếm
                        </button> */}
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all">Thêm động vật</button>
                        {onSearch && (
                            <div className="flex space-x-4">
                                <button className="bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700 transition-all">Cập nhật thông tin</button>
                                <button className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all">Xóa động vật</button>
                            </div>
                        )}
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
                
                {/* {!onSearch ? (
                    <div className="w-1/2 bg-white p-6 shadow-md rounded-lg overflow-hidden">
                        <h3 className="text-xl font-semibold mb-4 text-sky-700">Danh sách động vật</h3>
                        <ListAnimal onSearch={onSearch} searchTerm={searchTerm} />
                    </div>
                ) : (
                    <div className="w-1/2 bg-white p-6 shadow-md rounded-lg overflow-hidden">
                        <button
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all mb-4"
                            onClick={() => {
                                setOnSearch(false);
                                setSearchTerm("");
                            }}
                            
                        >
                            <ChevronLeftIcon className="h-5 w-5 mr-2" />
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Thông tin động vật</h3>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold">Tên: {nameAnimal}</p>
                            <p className="text-lg font-semibold">Giống: {breedAnimal}</p>
                            <p className="text-lg font-semibold">Tuổi: {ageAnimal}</p>
                            <p className="text-lg font-semibold">Trạng thái: {statusAnimal}</p>
                            <p className="text-lg font-semibold">Vị trí: {locationAnimal}</p>
                            <div className="flex space-x-4 mt-4">
                                <button className="bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700 transition-all">Cập nhật</button>
                                <button className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all">Xóa</button>
                            </div>
                        </div>
                    </div>
                )} */}
            </main>

            {/* FOOTER */}
            <footer className="bg-gray-800 text-white p-6 text-center">
                <p>&copy; 2024 Afsmart. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;

