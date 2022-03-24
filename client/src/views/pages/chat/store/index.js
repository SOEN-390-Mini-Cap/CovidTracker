import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getChatContacts = createAsyncThunk("appChat/getChatContacts", async ({ token }) => {
    const response = await axios.get(`http://localhost:8080/messages/chats`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("getchatcontacts", JSON.stringify(response.data));
    return response.data;
});

export const selectChat = createAsyncThunk("appChat/selectChat", async ({ token, id }, { dispatch }) => {
    const response = await axios.get(`http://localhost:8080/messages?userId=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("selectChat", JSON.stringify(response.data));
    await dispatch(getChatContacts({ token }));
    return response.data;
});

export const sendMsg = createAsyncThunk("appChat/sendMsg", async (obj, { dispatch }) => {
    const response = await axios.post("/apps/chat/send-msg", { obj });
    console.log("send message", JSON.stringify(response.data));
    await dispatch(selectChat("", obj.contact.id));
    return response.data;
});

export const appChatSlice = createSlice({
    name: "appChat",
    initialState: {
        chats: [],
        selectedUser: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getChatContacts.fulfilled, (state, action) => {
                state.chats = action.payload.chats;
            })
            .addCase(selectChat.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            });
    },
});

export default appChatSlice.reducer;
