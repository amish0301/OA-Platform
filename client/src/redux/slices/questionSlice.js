import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  queue: [], // list of questions
  answers: [], // list of correct answers
  trace: 1, // q. no
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.queue = action.payload;
    },
    setAnswers: (state, action) => {
      state.answers = action.payload;
    },
    moveToNext: (state) => {
      if (state.trace < state.queue.length) {
        return {
          ...state,
          trace: state.trace + 1,
        };
      }
      state.trace = initialState.trace
    },
    moveToPrevious: (state) => {
      if (state.trace > 1) {
        return {
          ...state,
          trace: state.trace - 1,
        };
      }
      state.trace = state.queue.length
    },

    reset: (state) => {
      state.trace = initialState.trace;
    }
  },
});

export default questionSlice;
export const { setQuestions, setAnswers, moveToNext, moveToPrevious, reset } =
  questionSlice.actions;
