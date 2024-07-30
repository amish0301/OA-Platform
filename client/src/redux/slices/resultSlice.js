import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  result: [],
  userId: null,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResult: (state, action) => {
      state.result.push(action.payload);
    },
    updateResult: (state, action) => {
      const { trace, check } = action.payload;
      state.result.fill(check, trace, trace + 1);
    },
  },
});

export default resultSlice;
export const { setResult, updateResult } = resultSlice.actions;
