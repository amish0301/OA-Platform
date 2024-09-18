import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  queue: [], // list of questions
  answers: [], // list of correct answers
  trace: 0, // q. no
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
      if (state.trace < state.queue.length - 1) {
        return {
          ...state,
          trace: state.trace + 1,
        };
      }
      return {
        ...state,
        trace: 0,
      };
    },
    moveToPrevious: (state) => {
      if (state.trace > 0) {
        return {
          ...state,
          trace: state.trace - 1,
        };
      }
      return {
        ...state,
        trace: state.queue.length - 1,
      };
    },

    reset: (state) => {
      state.trace = 0;
    }
  },
});

export default questionSlice;
export const { setQuestions, setAnswers, moveToNext, moveToPrevious, reset } =
  questionSlice.actions;
