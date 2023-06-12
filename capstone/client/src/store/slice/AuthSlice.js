import { createSlice } from "@reduxjs/toolkit";
import { loginReducer, logoutReducer } from "../reducers/AuthReducer";

const initialState = {
  isLoggedIn: false,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: logoutReducer,
    login: loginReducer,
  },
});
const AuthReducer = AuthSlice.reducer;

export const { login, logout } = AuthSlice.actions;
export default AuthReducer;
