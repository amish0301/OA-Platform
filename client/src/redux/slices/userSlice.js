import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  refreshToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    userNotExists: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    removeToken: (state) => {
      state.refreshToken = null;
    },
    resetUserState: (state) => {
      state = initialState;
    }
  },
});

export const { userExists, userNotExists, setToken, removeToken, resetUserState } = userSlice.actions;
export default userSlice;
