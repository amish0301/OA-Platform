import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isQuestionAdd: false,
  isDeleteQuestion: false,
  isEditTestName: false,
  isEditTestDuration: false,
  isEditTestDescription: false,
  questions: [],
  trace: 0,
  testName: "",
  testDuration: 0,
  categories: [],
  testDescription: "",
  deleteQuestionList: [],
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
    setQuestions: (state, action) => {
      const newQuestion = action.payload;
      state.questions = [...state.questions, newQuestion];
      state.trace = state.trace + 1;
    },
    resetQuestions: (state) => {
      state.questions = initialState.questions;
      state.trace = initialState.trace;
    },

    deleteQuestions: (state, action) => {
      const nums = action.payload;
      state.questions = state.questions.filter((q) => !nums.includes(q.id));

      if (state.questions.length == 0) {
        state.trace = initialState.trace;
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
      if (
        !state.categories.includes(action.payload.toLowerCase()) ||
        state.categories.length == 0
      )
        state.categories.push(action.payload.toLowerCase());
    },

    setTestDescription: (state, action) => {
      state.testDescription = action.payload;
    },

    deleteCategory: (state, action) => {
      if (action.payload == "") state.categories = [];
      state.categories = state.categories.filter((c) => c !== action.payload);
    },

    updateDeleteQuestionList: (state, action) => {
      if (!Array.isArray(state.deleteQuestionList)) {
        state.deleteQuestionList = []; // Ensure it's always an array
      }
      if (!state.deleteQuestionList?.includes(action.payload)) {
        state.deleteQuestionList = [
          ...state.deleteQuestionList,
          action.payload,
        ];
      }
    },

    removeFromDeleteQuestionList: (state, action) => {
      if (!Array.isArray(state.deleteQuestionList)) {
        state.deleteQuestionList = []; // Ensure it's always an array
      }
      state.deleteQuestionList = state.deleteQuestionList.filter(
        (id) => id !== action.payload
      );
    },

    resetAdminState: (state) => (state = initialState),
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
  deleteCategory,
  resetAdminState,
  updateDeleteQuestionList,
  removeFromDeleteQuestionList,
} = adminSlice.actions;
