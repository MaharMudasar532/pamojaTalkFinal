// authenticationSlice for maintaining login logout!

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
};

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;

        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authenticationSlice.actions;
export const selectIsAuthenticated = (state) => state.authentication.isAuthenticated;
export const selectUser = (state) => state.authentication.user;

export default authenticationSlice.reducer;
