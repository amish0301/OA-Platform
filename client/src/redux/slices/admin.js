import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isQuestionAdd: false,
  isDeleteQuestion: false,
  isEditTestName: false,
  newQuestion: {
    id: 0,
    question: "",
    options: [],
    answer: null,
  },
  questions: [],
  trace: 0,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setIsQuestionAdd: (state, action) => {
      state.isQuestionAdd = action.payload;
    },
    setIsDeleteQuestion: (state, action) => {
      state.isDeleteQuestion = action.payload;
    },
    setIsEditTestName: (state, action) => {
      state.isEditTestName = action.payload;
    },
    setQuestions: (state) => {
      state.questions = [...state.questions, state.newQuestion];
      state.trace = state.trace + 1;
    },
    resetQuestions: (state) => {
      state.questions = initialState.questions;
      state.trace = initialState.trace;
    },
    setNewQuestion: (state, action) => {
      state.newQuestion = {
        question: action.payload.desc,
        options: action.payload.options,
        answer: action.payload.answer,
        id: action.payload.id,
      };
    },
    resetNewQuestion: (state) => {
      state.newQuestion = initialState.newQuestion;
    },
    deleteQuestions: (state, action) => {
      const nums = action.payload;
      state.questions = state.questions.filter((q) => !nums?.includes(q.id));
    },
  },
});

export default adminSlice;
export const {
  setIsQuestionAdd,
  setQuestions,
  resetQuestions,
  setIsEditTestName,
  resetNewQuestion,
  setNewQuestion,
  setIsDeleteQuestion,
  deleteQuestions,
} = adminSlice.actions;
