import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isTestSubmitted: false,
  isSubmitting: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsTestSubmitted: (state, action) => {
      state.isTestSubmitted = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export default miscSlice;
export const { setIsMobile, setIsTestSubmitted, setIsSubmitting } =
  miscSlice.actions;
