import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChats, getMessages, postMessage } from "../../../../services/api";

export const getChatContacts = createAsyncThunk("appChat/getChatContacts", async ({ token }) => {
    return await getChats(token);
});

export const selectChat = createAsyncThunk("appChat/selectChat", async ({ token, id }, { dispatch }) => {
    const response = await getMessages(token, id);

    await dispatch(getChatContacts({ token }));
    return response;
});

export const sendMsg = createAsyncThunk("appChat/sendMsg", async ({ token, to, body, isPriority }, { dispatch }) => {
    await postMessage(token, {
        to,
        body,
        isPriority,
    });
    await dispatch(selectChat({ token, id: to }));
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
