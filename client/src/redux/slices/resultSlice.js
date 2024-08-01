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
      return {
        ...state,
        result: {
          ...state.result,
          [questionNo]: selected,
        }
      };
    },
  },
});

export default resultSlice;
export const { updateResult } = resultSlice.actions;
