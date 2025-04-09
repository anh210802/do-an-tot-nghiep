import axios from "axios";
import { 
    loginStart, loginSuccess, loginFailure, 
    registerStart, registerSuccess, registerFailure, 
    logoutStart, logoutSuccess, logoutFailure 
} from "../redux/authSlice.js";


// 📌 Lấy API URL từ biến môi trường
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

// 🟢 Hàm đăng nhập
export const handleLogin = async (user, dispatch, navigate, setError) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${API_URL}/auth/login`, user, {
            withCredentials: true,
        });

        if (res.data.message === "User not found") {
            setError("Tài khoản không tồn tại");
            dispatch(loginFailure());
            return;
        } else if (res.data.message === "Invalid password for user password") {
            setError("Mật khẩu không đúng");
            dispatch(loginFailure());
            return;
        }

        dispatch(loginSuccess(res.data));
        navigate("/dashboard");
        return res.data;
    } catch (error) {
        dispatch(loginFailure());
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
        console.error("Login error:", errMsg);
    }
};


// 🟢 Hàm đăng ký
export const handleRegister = async (user, dispatch, navigate, setError) => {
    dispatch(registerStart());
    try {
        const res = await axios.post(`${API_URL}/auth/register`, user, {
            withCredentials: true,
        });
        if (res.data.message === "Username already exists") {
            setError("Tài khoản đã tồn tại");
            dispatch(registerFailure());
            return;
        } 
        dispatch(registerSuccess(res.data));
        navigate("/");
    } catch (error) {
        dispatch(registerFailure());
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
        console.error("Register error:", error.response?.data || error.message);
    }
};

// 🟢 Hàm đăng xuất
export const handleLogout = async (dispatch, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        if (!accessToken) {
            throw new Error("Access token is missing");
        }
        await axiosJWT.post(`${API_URL}/auth/logout`, {}, {
            headers: { token: `Bearer ${accessToken}` },
        }, {
            withCredentials: true,
        });
        dispatch(logoutSuccess());
        navigate("/");
    } catch (error) {
        dispatch(logoutFailure());
        console.error("Logout error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
};


