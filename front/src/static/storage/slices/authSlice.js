import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authorised: false,
    role:"user",
    is_active: true,
    login: "",
    password: "",
    username: "",
    token: "",
  },
  reducers: {
    set_login(state, action) {
      state.login = action.payload
    },
    set_password(state, action) {
      state.password = action.payload
    },
    set_token(state, action){
      state.token = action.payload
    },
    get_token(state){
      return state.token
    },
    set_role_and_activity(state, action) {
      state.role = action.payload["role"]
      state.is_active = action.payload["is_active"]
    },
    login(state, action) {
      state.authorised = true
      state.role = action.payload
    },

    logout(state) {
      state.authorised = false
      state.token = ""
    }
  },
});

export const { set_login, set_password, login, logout, set_token, get_token } = authSlice.actions;
export default authSlice.reducer;  // default export!