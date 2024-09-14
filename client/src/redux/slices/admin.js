import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isQuestionAdd: false,
  isDeleteQuestion: false,
  isEditTestName: false,
  isEditTestDuration: false,
  isEditTestDescription: false,
  newQuestion: {
    id: 0,
    question: "",
    options: [],
    answer: null,
  },
  questions: [],
  trace: 0,
  testName: "",
  testDuration: 0,
  categories: [],
  testDescription: "",
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
      state.questions = state.questions.filter((q) => !nums.includes(q.id));

      // reset trace if no questions
      if (state.questions.length == 0) {
        state.trace = 0;
      }
    },

    resetQuestionCnt: (state) => {
      state.trace = initialState.trace;
    },

    setTestName: (state, action) => {
      state.testName = action.payload;
    },

    setIsEditTestDuration: (state, action) => {
      state.isEditTestDuration = action.payload;
    },
    setIsEditTestDescription: (state, action) => {
      state.isEditTestDescription = action.payload;
    },
    setTestDuration: (state, action) => {
      state.testDuration = action.payload;
    },

    setCategory: (state, action) => {
      state.categories = action.payload;
    },

    setTestDescription: (state, action) => {
      state.testDescription = action.payload;
    },

    resetAdminState: (state) => state = initialState
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
  resetQuestionCnt,
  setTestName,
  setTestDuration,
  setIsEditTestDuration,
  setIsEditTestDescription,
  setCategory,
  setTestDescription,
  resetAdminState
} = adminSlice.actions;
