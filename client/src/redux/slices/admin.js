import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isQuestionAdd: false,
  isEditTestName: false,
  deleteQuestions: [],
  questions: [
    {
      id: null,
      question: "",
      options: [],
      answer: null,
    },
  ],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setIsQuestionAdd: (state, action) => {
      state.isQuestionAdd = action.payload;
    },

    setIsEditTestName: (state, action) => {
      state.isEditTestName = action.payload;
    },
    setDeleteQuestions: (state, action) => {
      state.deleteQuestions = action.payload;
    },

    // might fix needed
    setQuestions: (state, action) => {
      state.questions = [...state.questions, ...action.payload];
    },

    resetQuestions: (state) => {
      state.questions = initialState.questions;
    },

    updateOptions: (state, action) => {
      const { index, value } = action.payload;
      state.questions[index].options = value;
    },
  },
});

export default adminSlice;
export const {
  setIsQuestionAdd,
  setDeleteQuestions,
  setQuestions,
  resetQuestions,
  setIsEditTestName,
  updateOptions,
} = adminSlice.actions;
