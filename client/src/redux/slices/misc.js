import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isLoading: false,
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
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
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
export const {
  setIsMobile,
  setIsLoading,
  setIsTestSubmitted,
  setIsSubmitting,
} = miscSlice.actions;
