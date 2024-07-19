import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  loader: false,
  isAdmin: false,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await axios.get("http://localhost:8080/auth/user", {
    withCredentials: true,
  });
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader
    },
    userNotExists: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice;
export const { userExists, userNotExists } = userSlice.actions;
