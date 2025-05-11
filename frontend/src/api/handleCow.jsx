import {
    addCowStart, addCowSuccess, addCowFailure,
    getAllCowsFailure, getAllCowsStart, getAllCowsSuccess,
    deleteCowStart, deleteCowSuccess, deleteCowFailure,
} from "../redux/handleCowSlice.js";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

export const handleAddCow = async (cow, accessToken, axiosJWT, dispatch, setError) => {
    dispatch(addCowStart());
    try {
        const res = await axiosJWT.post(`${API_URL}/handle-cow/add-cow`, cow, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(addCowSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(addCowFailure());
        const errMsg = error.response?.data?.message || "Lỗi kết nối đến server";
        setError(errMsg);
        console.error("Add cow error:", error.response?.data || error.message);
        
    }
}

export const handleGetAllCows = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getAllCowsStart());
    try {
        const res = await axiosJWT.get(`${API_URL}/handle-cow/get-all-cows`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getAllCowsSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(getAllCowsFailure());
        console.error("Get all cows error:", error.response?.data || error.message);
    }
}

export const handleDeleteCow = async (id, accessToken, axiosJWT, dispatch) => {
    dispatch(deleteCowStart());
    try {
        const res = await axiosJWT.delete(`${API_URL}/handle-cow/delete-cow/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteCowSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(deleteCowFailure());
        console.error("Delete cow error:", error.response?.data || error.message);
    }
}

export const handleUpdateCow = async (id, cow, accessToken, axiosJWT, dispatch) => {
    dispatch(addCowStart());
    try {
        const res = await axiosJWT.put(`${API_URL}/handle-cow/update-cow/${id}`, cow, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(addCowSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(addCowFailure());
        console.error("Update cow error:", error.response?.data || error.message);
    }
}

