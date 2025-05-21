import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode properly

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

// Function to refresh the token
export const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${API_URL}/auth/refresh-token`,
            {}, // <- body rỗng
            { withCredentials: true } // <- đặt đúng chỗ
        );
        return res.data;
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
};


// Function to create a new Axios instance with interceptors for handling token refresh
export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: API_URL,
        withCredentials: true, // <- đảm bảo gửi cookie trong mọi request
    });
    
    // Interceptor to check token expiry before each request
    newInstance.interceptors.request.use(
        async (config) => {
            if (!user?.accessToken) {
                // If the user doesn't have an access token, proceed with the request
                return config;
            }
            
            let date = new Date();
            try {
                const decodedToken = jwtDecode(user.accessToken); // Decode token
                if (decodedToken.exp * 1000 < date.getTime()) { // Check if the token has expired
                    const data = await refreshToken(); // Attempt to refresh the token
                    const refreshUser = {
                        ...user,
                        accessToken: data.accessToken,
                    };
                    dispatch(stateSuccess(refreshUser)); // Update user state with the new token
                    config.headers["token"] = "Bearer " + data.accessToken; // Set the new token in headers
                } else {
                    // If the token is still valid, set the current access token in headers
                    config.headers["token"] = "Bearer " + user.accessToken;
                }
            } catch (error) {
                console.error("Error decoding token:", error.message);
                // In case of error decoding the token, proceed with the current request
                return Promise.reject(error);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return newInstance;
};
