import {
    setDeviceStart, setDeviceSuccess, setDeviceFailure,
    deleteDeviceStart, deleteDeviceSuccess, deleteDeviceFailure
} from '../redux/handleDevice.js';

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

export const handleSetDevice = async (cowId, deviceID, accessToken, axiosJWT, dispatch, setError) => {
    dispatch(setDeviceStart());
    try {
        const res = await axiosJWT.post(`${API_URL}/handle-device/set-device`, { cowId, deviceID }, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.message === "Không tìm thấy động vật") {
            setError("Không tìm thấy động vật");
            dispatch(setDeviceFailure());
            return;
        } else if (res.data.message === "Thiết bị đã được sử dụng") {
            setError("Thiết bị đã được sử dụng");
            dispatch(setDeviceFailure());
            return;
        }
        dispatch(setDeviceSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(setDeviceFailure());
        console.error("Set device error:", error.response?.data || error.message);
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
    }
}

export const handleDeleteDevice = async (cowId, accessToken, axiosJWT, dispatch, setError) => {
    dispatch(deleteDeviceStart());
    try {
        const res = await axiosJWT.post(`${API_URL}/handle-device/delete-device`, { cowId }, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.message === "Không tìm thấy động vật") {
            setError("Không tìm thấy động vật");
            dispatch(deleteDeviceFailure());
            return;
        } else if (res.data.message === "Động vật không có thiết bị") {
            setError("Động vật không có thiết bị");
            dispatch(deleteDeviceFailure());
            return;
        }
        dispatch(deleteDeviceSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(deleteDeviceFailure());
        console.error("Delete device error:", error.response?.data || error.message);
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
    }
}


