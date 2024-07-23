import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null
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
      state.token = action.payload
    },
    removeToken: (state) => {
      state.token = null
    }
  },
});

export default userSlice;
export const { userExists, userNotExists, setToken } = userSlice.actions;
