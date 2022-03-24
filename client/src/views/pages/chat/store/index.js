import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getChatContacts = createAsyncThunk("appChat/getChatContacts", async () => {
    // return chats / chatsContacts
    // const response = JSON.parse(
    //     '{"chats":[{"id":1,"fullName":"Felecia Rower","role":"Frontend Developer","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-2.d21f2121.jpg","status":"offline","chat":{"id":1,"unseenMsgs":0,"lastMessage":{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}}},{"id":2,"fullName":"Adalberto Granzin","role":"UI/UX Designer","about":"Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.","avatar":"/static/media/avatar-s-1.d383013d.jpg","status":"busy","chat":{"id":2,"unseenMsgs":1,"lastMessage":{"message":"I will purchase it for sure. 👍","time":"2022-03-23T00:12:52.007Z","senderId":1}}}]}',
    // );
    const response = await axios.get(`http://localhost:8080/messages/chats`, {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0ODA4NTkzNH0.qqp9-HLgr3WDii9Bo26YVc7x2t5DLtWhBEJh7WQoE00`,
        },
    });
    console.log("getchatcontacts", JSON.stringify(response.data));
    return response.data;
});

export const selectChat = createAsyncThunk("appChat/selectChat", async (id, { dispatch }) => {
    // const response = JSON.parse(
    //     '{"chat":{"id":1,"userId":1,"unseenMsgs":0,"chat":[{"message":"Hi","time":"Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)","senderId":11},{"message":"Hello. How can I help You?","time":"Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)","senderId":2},{"message":"Can I get details of my last transaction I made last month?","time":"Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)","senderId":11},{"message":"We need to check if we can provide you such information.","time":"Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)","senderId":2},{"message":"I will inform you as I get update on this.","time":"Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)","senderId":2},{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}]},"contact":{"id":1,"fullName":"Felecia Rower","role":"Frontend Developer","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-2.d21f2121.jpg","status":"offline","chat":{"id":1,"unseenMsgs":0,"lastMessage":{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}}}}',
    // );

    const response = await axios.get(`http://localhost:8080/messages?userId=${id}`, {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0ODA4NTkzNH0.qqp9-HLgr3WDii9Bo26YVc7x2t5DLtWhBEJh7WQoE00`,
        },
    });

    console.log("selectChat", JSON.stringify(response.data));
    await dispatch(getChatContacts());
    return response.data;
});

export const sendMsg = createAsyncThunk("appChat/sendMsg", async (obj, { dispatch }) => {
    const response = await axios.post("/apps/chat/send-msg", { obj });
    console.log("send message", JSON.stringify(response.data));
    await dispatch(selectChat(obj.contact.id));
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
