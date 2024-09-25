export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
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
    localStorage.removeItem("reduxState");
    localStorage.removeItem("accessToken");
  } catch (e) {
    throw e;
  }
};
