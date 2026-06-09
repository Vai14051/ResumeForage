import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User{
    id:string;
    name:string;
    email:string;
}

interface Authstate{
    user:User | null;
    accesstoken:string | null;
    isAuthenticated :boolean
}
const storedUser = localStorage.getItem("user");
const initialState:Authstate={
    user: storedUser ? JSON.parse(storedUser) : null,
    accesstoken:localStorage.getItem("access_token"),
    isAuthenticated:!!localStorage.getItem("access_token")
}


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>
    ) => {
      const { user, accessToken } = action.payload;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
      state.accesstoken = accessToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      state.user = null;
      state.accesstoken = null;
      state.isAuthenticated = false;
    },
  },
});

export const {setAuth,logout} = authSlice.actions
export default authSlice.reducer;