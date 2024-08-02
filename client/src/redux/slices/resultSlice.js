import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  result: {},
  userId: null,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    updateResult: (state, action) => {
      const { questionNo, selected } = action.payload;
      state.result[questionNo] = selected;
    },
    resetResult: (state, action) => {
      state.result = initialState;
    },
  },
});

export default resultSlice;
export const { updateResult, resetResult } = resultSlice.actions;
