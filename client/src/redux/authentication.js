import { createSlice } from "@reduxjs/toolkit";

const initialUser = () => {
    const item = window.localStorage.getItem("userData");
    //** Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : {};
};

export const authSlice = createSlice({
    name: "authentication",
    initialState: {
        userData: initialUser(),
    },
    reducers: {
        handleLogin: (state, action) => {
            const userData = {
                user: {
                    ...action.payload.user,
                },
                token: action.payload.token,
            };

            state.userData = userData;

            if (action.payload.rememberMe) {
                localStorage.setItem("userData", JSON.stringify(userData));
            }
        },
        handleLogout: (state) => {
            state.userData = {};
            localStorage.removeItem("userData");
        },
        handleProfile: (state, action) => {
            state.userData = {
                ...state.userData,
                user: {
                    ...state.userData.user,
                    ...action.payload.user,
                },
            };
        },
    },
});

export const { handleLogin, handleLogout, handleProfile } = authSlice.actions;

export default authSlice.reducer;
