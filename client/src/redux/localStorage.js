import { AUTH_TOKEN, STORAGE_KEY } from "../lib/config";

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY
    , serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(
      STORAGE_KEY
    );
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load state", e);
    return undefined;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN);
  } catch (e) {
    throw e;
  }
};
