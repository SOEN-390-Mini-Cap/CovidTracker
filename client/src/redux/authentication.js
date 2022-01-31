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
                accessToken: action.payload.accessToken,
            };
            state.userData = userData;

            // Right now the app gets the logged in status of the user from the cookies
            // so the user session must be saved in local storage
            // after we refactor to use redux we can enable the "do not remember me" option
            // if (action.payload.rememberMe) {
            //     localStorage.setItem("userData", JSON.stringify(userData));
            // }
            localStorage.setItem("userData", JSON.stringify(userData));
        },
        handleLogout: (state) => {
            state.userData = {};
            localStorage.removeItem("userData");
        },
    },
});

export const { handleLogin, handleLogout } = authSlice.actions;

export default authSlice.reducer;
