import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    setDevice: {
        isFetching: false,
        error: false,
        success: false,
    },
    deleteDevice: {
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
            state.setDevice.isFetching = true;
        },
        setDeviceSuccess: (state) => {
            state.setDevice.isFetching = false;
            state.setDevice.success = true;
            state.setDevice.error = false;
        },
        setDeviceFailure: (state) => {
            state.setDevice.isFetching = false;
            state.setDevice.error = true;
            state.setDevice.success = false;
        },
        deleteDeviceStart: (state) => {
            state.deleteDevice.isFetching = true;
        },
        deleteDeviceSuccess: (state) => {
            state.deleteDevice.isFetching = false;
            state.deleteDevice.success = true;
            state.deleteDevice.error = false;
        },
        deleteDeviceFailure: (state) => {
            state.deleteDevice.isFetching = false;
            state.deleteDevice.error = true;
            state.deleteDevice.success = false;
        },
    },
});

export const { 
    setDeviceStart, 
    setDeviceSuccess, 
    setDeviceFailure,
    deleteDeviceStart,
    deleteDeviceSuccess,
    deleteDeviceFailure } = setDeviceSlice.actions;
export default setDeviceSlice.reducer;
