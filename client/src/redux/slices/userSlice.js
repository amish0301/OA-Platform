import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
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
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
    removeToken: (state) => {
      state.accessToken = null;
    },
  },
});

export default userSlice;
export const { userExists, userNotExists, setToken } = userSlice.actions;
