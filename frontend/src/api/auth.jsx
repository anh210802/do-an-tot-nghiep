import axios from "axios";
import { 
    loginStart, loginSuccess, loginFailure, 
    registerStart, registerSuccess, registerFailure, 
    logoutStart, logoutSuccess, logoutFailure 
} from "../redux/authSlice.js";


// 📌 Lấy API URL từ biến môi trường
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

// 🟢 Hàm đăng nhập
export const handleLogin = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${API_URL}/auth/login`, user);
        dispatch(loginSuccess(res.data));
        navigate("/dashboard");
    } catch (error) {
        dispatch(loginFailure());
        console.error("Login error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
};

// 🟢 Hàm đăng ký
export const handleRegister = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post(`${API_URL}/auth/register`, user);
        dispatch(registerSuccess(res.data));
        navigate("/");
    } catch (error) {
        dispatch(registerFailure());
        console.error("Register error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
};

// 🟢 Hàm đăng xuất
export const handleLogout = async (dispatch, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post(`${API_URL}/auth/logout`, {}, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logoutSuccess());
        navigate("/");
    } catch (error) {
        dispatch(logoutFailure());
        console.error("Logout error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
};


