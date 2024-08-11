import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { loadState, saveState } from "./localStorage";
import questionSlice from "./slices/questionSlice";
import resultSlice from "./slices/resultSlice";

const persistedState = loadState();

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    question: questionSlice.reducer,
    result: resultSlice.reducer,
  },
  preloadedState: {
    user: persistedState?.user || null,
    question: persistedState?.question || null,
    result: persistedState?.result || null,
  },
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
