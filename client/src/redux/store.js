import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { loadState, saveState } from "./localStorage";
import questionSlice from "./slices/questionSlice";
import resultSlice from "./slices/resultSlice";
import miscSlice from "./slices/misc";
import adminSlice from "./slices/admin";

const persistedState = loadState();

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    question: questionSlice.reducer,
    [resultSlice.name]: resultSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [adminSlice.name]: adminSlice.reducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
