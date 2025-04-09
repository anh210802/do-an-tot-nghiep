import {
    addCowStart, addCowSuccess, addCowFailure,
} from "../redux/handleCowSlice.js";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

export const handleAddCow = async (cow, accessToken, axiosJWT, dispatch) => {
    dispatch(addCowStart());
    try {
        const res = await axiosJWT.post(`${API_URL}/handle-cow/add-cow`, cow, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(addCowSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(addCowFailure());
        console.error("Add cow error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Lỗi kết nối đến server" };
    }
}
