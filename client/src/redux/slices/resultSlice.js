import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  result: {},
  isLoading: false,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    updateResult: (state, action) => {
      const { questionNo, selected } = action.payload;
      state.result[questionNo] = selected;
    },
    resetResult: (state) => {
      state.result = initialState;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export default resultSlice;
export const { updateResult, resetResult, setIsLoading } = resultSlice.actions;
