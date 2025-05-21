import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    setGateway: {
        isFetching: false,
        error: false,
        success: false,
    },
    getAllGateway:{
        isFetching: false,
        error: false,
        success: false,
    },
    deleteGateway: {
        isFetching: false,
        error: false,
        success: false,
    },
};

const handleGatewaySlice = createSlice({
    name: 'handleGateway',
    initialState,
    reducers: {
        setGatewayStart: (state) => {
            state.setGateway.isFetching = true;
        },
        setGatewaySuccess: (state) => {
            state.setGateway.isFetching = false;
            state.setGateway.success = true;
            state.setGateway.error = false;
        },
        setGatewayFailure: (state) => {
            state.setGateway.isFetching = false;
            state.setGateway.error = true;
            state.setGateway.success = false;
        },
        getAllGatewayStart: (state) => {
            state.getAllGateway.isFetching = true;
        },
        getAllGatewaySuccess: (state) => {
            state.getAllGateway.isFetching = false;
            state.getAllGateway.success = true;
            state.getAllGateway.error = false;
        },
        getAllGatewayFailure: (state) => {
            state.getAllGateway.isFetching = false;
            state.getAllGateway.error = true;
            state.getAllGateway.success = false;
        },
        deleteGatewayStart: (state) => {
            state.deleteGateway.isFetching = true;
        },
        deleteGatewaySuccess: (state) => {
            state.deleteGateway.isFetching = false;
            state.deleteGateway.success = true;
            state.deleteGateway.error = false;
        },
        deleteGatewayFailure: (state) => {
            state.deleteGateway.isFetching = false;
            state.deleteGateway.error = true;
            state.deleteGateway.success = false;
        },
    },
});

export const { 
    setGatewayStart, 
    setGatewaySuccess, 
    setGatewayFailure,
    getAllGatewayStart,
    getAllGatewaySuccess,
    getAllGatewayFailure,
    deleteGatewayStart,
    deleteGatewaySuccess,
    deleteGatewayFailure } = handleGatewaySlice.actions;
export default handleGatewaySlice.reducer;