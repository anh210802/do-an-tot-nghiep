import {
    setGatewayStart, 
    setGatewaySuccess, 
    setGatewayFailure,
    getAllGatewayStart,
    getAllGatewaySuccess,
    getAllGatewayFailure,
    deleteGatewayStart,
    deleteGatewaySuccess,
    deleteGatewayFailure 
} from '../redux/handleGatewaySlice';

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

export const handleSetGateway = async (gatewayId, accessToken, axiosJWT, dispatch, setError) => {
    dispatch(setGatewayStart());
    try {
        const res = await axiosJWT.post(`${API_URL}/handle-gateway/set-gateway`, { gatewayId }, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.message === "Thiết bị đã được sử dụng") {
            setError("Thiết bị đã được sử dụng");
            dispatch(setGatewayFailure());
            return;
        }
        dispatch(setGatewaySuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(setGatewayFailure());
        console.error("Set gateway error:", error.response?.data || error.message);
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
    }
}

export const handleGetAllGateway = async (accessToken, axiosJWT, dispatch, setError) => {
    dispatch(getAllGatewayStart());
    try {
        const res = await axiosJWT.get(`${API_URL}/handle-gateway/get-all-gateway`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getAllGatewaySuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(getAllGatewayFailure());
        console.error("Get all gateway error:", error.response?.data || error.message);
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
    }
}

export const handleDeleteGateway = async (gatewayId, accessToken, axiosJWT, dispatch, setError) => {
    dispatch(deleteGatewayStart());
    try {
        const res = await axiosJWT.post(`${API_URL}/handle-gateway/delete-gateway`, { gatewayId }, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.message === "Không tìm thấy thiết bị") {
            setError("Không tìm thấy thiết bị");
            dispatch(deleteGatewayFailure());
            return;
        } else if (res.data.message === "Thiết bị không có thiết bị") {
            setError("Thiết bị không có thiết bị");
            dispatch(deleteGatewayFailure());
            return;
        }
        dispatch(deleteGatewaySuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(deleteGatewayFailure());
        console.error("Delete gateway error:", error.response?.data || error.message);
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
    }
}
