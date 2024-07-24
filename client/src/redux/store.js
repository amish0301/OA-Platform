import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { loadState, saveState } from "./localStorage";

const persistedState = loadState();

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  preloadedState: {
    user: persistedState?.user || undefined,
  }
});

store.subscribe(() => {
  saveState({
    user: store.getState().user
  });
});

export default store;
