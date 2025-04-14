import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    device: {
        isFetching: false,
        error: false,
        success: false,
    },
};

const setDeviceSlice = createSlice({
    name: 'setDevice',
    initialState,
    reducers: {
        setDeviceStart: (state) => {
            state.device.isFetching = true;
        },
        setDeviceSuccess: (state) => {
            state.device.isFetching = false;
            state.device.success = true;
            state.device.error = false;
        },
        setDeviceFailure: (state) => {
            state.device.isFetching = false;
            state.device.error = true;
            state.device.success = false;
        },
    },
});

export const { setDeviceStart, setDeviceSuccess, setDeviceFailure } = setDeviceSlice.actions;
export default setDeviceSlice.reducer;
