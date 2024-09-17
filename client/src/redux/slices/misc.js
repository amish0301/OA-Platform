import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isLoading: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export default miscSlice;
export const { setIsMobile, setIsLoading } =
  miscSlice.actions;
