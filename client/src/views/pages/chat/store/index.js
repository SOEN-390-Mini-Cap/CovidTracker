// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getUserProfile = createAsyncThunk('appChat/getTasks', async () => {
  const response = await axios.get('/apps/chat/users/profile-user')
  console.log("getuserprofile", JSON.stringify(response.data))
  return response.data
})

export const getChatContacts = createAsyncThunk('appChat/getChatContacts', async () => {
  const response = await axios.get('/apps/chat/chats-and-contacts')
  console.log("getchatcontacts", JSON.stringify(response.data))
  return response.data
})

export const selectChat = createAsyncThunk('appChat/selectChat', async (id, { dispatch }) => {
  const response = await axios.get('/apps/chat/get-chat', { id })
  console.log("selectchat", JSON.stringify(response.data))
  await dispatch(getChatContacts())
  return response.data
})

export const sendMsg = createAsyncThunk('appChat/sendMsg', async (obj, { dispatch }) => {
  const response = await axios.post('/apps/chat/send-msg', { obj })
  console.log("send message", JSON.stringify(response.data))
  await dispatch(selectChat(obj.contact.id))
  return response.data
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: [],
    contacts: [],
    userProfile: {},
    selectedUser: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload
      })
      .addCase(getChatContacts.fulfilled, (state, action) => {
        state.chats = action.payload.chatsContacts
        state.contacts = action.payload.contacts
      })
      .addCase(selectChat.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
  }
})

export default appChatSlice.reducer
