import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    addCow: {
        isFetching: false,
        error: false,
        success: false,
    },
    getAllCows: {
        isFetching: false,
        error: false,
        success: false,
    },
    updateCow: {
        isFetching: false,
        error: false,
        success: false,
    },
    deleteCow: {
        isFetching: false,
        error: false,
        success: false,
    },
};

const handleCowSlice = createSlice({
    name : 'handleCow',
    initialState,
    reducers: {
        addCowStart: (state) => {
            state.addCow.isFetching = true;
        },
        addCowSuccess: (state) => {
            state.addCow.isFetching = false;
            state.addCow.success = true;
            state.addCow.error = false;
        },
        addCowFailure: (state) => {
            state.addCow.isFetching = false;
            state.addCow.error = true;
            state.addCow.success = false;
        },
        getAllCowsStart: (state) => {
            state.getAllCows.isFetching = true;
        },
        getAllCowsSuccess: (state) => {
            state.getAllCows.isFetching = false;
            state.getAllCows.success = true;
            state.getAllCows.error = false;
        },
        getAllCowsFailure: (state) => {
            state.getAllCows.isFetching = false;
            state.getAllCows.error = true;
            state.getAllCows.success = false;
        },
        updateCowStart: (state) => {
            state.updateCow.isFetching = true;
        },
        updateCowSuccess: (state) => {
            state.updateCow.isFetching = false;
            state.updateCow.success = true;
            state.updateCow.error = false;
        },
        updateCowFailure: (state) => {
            state.updateCow.isFetching = false;
            state.updateCow.error = true;
            state.updateCow.success = false;
        },
        deleteCowStart: (state) => {
            state.deleteCow.isFetching = true; 
        },
        deleteCowSuccess: (state) => {
            state.deleteCow.isFetching = false; 
            state.deleteCow.success = true; 
            state.deleteCow.error = false; 
        },
        deleteCowFailure: (state) => {
            state.deleteCow.isFetching = false; 
            state.deleteCow.error = true; 
            state.deleteCow.success = false; 
        },
    }
});

export const { 
    addCowStart, addCowSuccess, addCowFailure,
    getAllCowsStart, getAllCowsSuccess, getAllCowsFailure,
    updateCowStart, updateCowSuccess, updateCowFailure,
    deleteCowStart, deleteCowSuccess, deleteCowFailure,
} = handleCowSlice.actions;
export default handleCowSlice.reducer;