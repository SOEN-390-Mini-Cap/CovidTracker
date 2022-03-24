// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

export const getUserProfile = createAsyncThunk("appChat/getTasks", async () => {
    const response = JSON.parse(
        '{"id":11,"avatar":"/static/media/avatar-s-11.1d46cc62.jpg","fullName":"John Doe","role":"admin","about":"Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.","status":"online","settings":{"isTwoStepAuthVerificationEnabled":true,"isNotificationsOn":false}}',
    );
    console.log("getuserprofile", JSON.stringify(response));
    return response;
});

export const getChatContacts = createAsyncThunk("appChat/getChatContacts", async () => {
    const response = JSON.parse(
        '{"chatsContacts":[{"id":1,"fullName":"Felecia Rower","role":"Frontend Developer","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-2.d21f2121.jpg","status":"offline","chat":{"id":1,"unseenMsgs":0,"lastMessage":{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}}},{"id":2,"fullName":"Adalberto Granzin","role":"UI/UX Designer","about":"Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.","avatar":"/static/media/avatar-s-1.d383013d.jpg","status":"busy","chat":{"id":2,"unseenMsgs":1,"lastMessage":{"message":"I will purchase it for sure. 👍","time":"2022-03-23T00:12:52.007Z","senderId":1}}}],"contacts":[{"id":1,"fullName":"Felecia Rower","role":"Frontend Developer","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-2.d21f2121.jpg","status":"offline","chat":{"id":1,"unseenMsgs":0,"lastMessage":{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}}},{"id":2,"fullName":"Adalberto Granzin","role":"UI/UX Designer","about":"Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.","avatar":"/static/media/avatar-s-1.d383013d.jpg","status":"busy","chat":{"id":2,"unseenMsgs":1,"lastMessage":{"message":"I will purchase it for sure. 👍","time":"2022-03-23T00:12:52.007Z","senderId":1}}},{"id":3,"fullName":"Joaquina Weisenborn","role":"Town planner","about":"Soufflé soufflé caramels sweet roll. Jelly lollipop sesame snaps bear claw jelly beans sugar plum sugar plum.","avatar":"/static/media/avatar-s-3.c1d416e5.jpg","status":"busy"},{"id":4,"fullName":"Verla Morgano","role":"Data scientist","about":"Chupa chups candy canes chocolate bar marshmallow liquorice muffin. Lemon drops oat cake tart liquorice tart cookie. Jelly-o cookie tootsie roll halvah.","avatar":"/static/media/avatar-s-4.a649af23.jpg","status":"online"},{"id":5,"fullName":"Margot Henschke","role":"Dietitian","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-5.301316d5.jpg","status":"busy"},{"id":6,"fullName":"Sal Piggee","role":"Marketing executive","about":"Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.","avatar":"/static/media/avatar-s-6.974f64da.jpg","status":"online"},{"id":7,"fullName":"Miguel Guelff","role":"Special educational needs teacher","about":"Biscuit powder oat cake donut brownie ice cream I love soufflé. I love tootsie roll I love powder tootsie roll.","avatar":"/static/media/avatar-s-7.ba3f6823.jpg","status":"online"},{"id":8,"fullName":"Mauro Elenbaas","role":"Advertising copywriter","about":"Bear claw ice cream lollipop gingerbread carrot cake. Brownie gummi bears chocolate muffin croissant jelly I love marzipan wafer.","avatar":"/static/media/avatar-s-8.e9b18971.jpg","status":"away"},{"id":9,"fullName":"Bridgett Omohundro","role":"Designer, television/film set","about":"Gummies gummi bears I love candy icing apple pie I love marzipan bear claw. I love tart biscuit I love candy canes pudding chupa chups liquorice croissant.","avatar":"/static/media/avatar-s-9.e2785e7a.jpg","status":"offline"},{"id":10,"fullName":"Zenia Jacobs","role":"Building surveyor","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-10.79a4ca26.jpg","status":"away"}],"profileUser":{"id":11,"avatar":"/static/media/avatar-s-11.1d46cc62.jpg","fullName":"John Doe","status":"online"}}',
    );
    console.log("getchatcontacts", JSON.stringify(response));
    return response;
});

export const selectChat = createAsyncThunk("appChat/selectChat", async (id, { dispatch }) => {
    const response = JSON.parse(
        '{"chat":{"id":1,"userId":1,"unseenMsgs":0,"chat":[{"message":"Hi","time":"Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)","senderId":11},{"message":"Hello. How can I help You?","time":"Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)","senderId":2},{"message":"Can I get details of my last transaction I made last month?","time":"Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)","senderId":11},{"message":"We need to check if we can provide you such information.","time":"Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)","senderId":2},{"message":"I will inform you as I get update on this.","time":"Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)","senderId":2},{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}]},"contact":{"id":1,"fullName":"Felecia Rower","role":"Frontend Developer","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-2.d21f2121.jpg","status":"offline","chat":{"id":1,"unseenMsgs":0,"lastMessage":{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}}}}',
    );
    console.log("selectchat", JSON.stringify(response));
    await dispatch(getChatContacts());
    return response;
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
        contacts: [],
        userProfile: {},
        selectedUser: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.userProfile = action.payload;
            })
            .addCase(getChatContacts.fulfilled, (state, action) => {
                state.chats = action.payload.chatsContacts;
                state.contacts = action.payload.contacts;
            })
            .addCase(selectChat.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            });
    },
});

export default appChatSlice.reducer;
