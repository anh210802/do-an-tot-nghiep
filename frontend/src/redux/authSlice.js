import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    login: {
        currentUser: null,
        isFetching: false,
        error: false,
    },
    register: {
        isFetching: false,
        error: false,
        success: false,
    },
    logout: {
        isFetching: false,
        error: false,
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailure: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.success = true;
            state.register.error = false;
        },
        registerFailure: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logoutStart: (state) => {
            state.logout.isFetching = true; 
        },
        logoutSuccess: (state) => {
            state.logout.isFetching = false;
            state.login.currentUser = null;
            state.logout.error = false;
        },
        logoutFailure: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },
    },
});

export const { 
        loginStart, 
        loginSuccess, 
        loginFailure,
        registerStart,
        registerSuccess,
        registerFailure,
        logoutStart,
        logoutSuccess,
        logoutFailure,
    } = authSlice.actions;

export default authSlice.reducer;