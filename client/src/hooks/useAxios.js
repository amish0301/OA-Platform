import axios from "axios";
import store from "../redux/store";
import { setToken, userNotExists } from "../redux/slices/userSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const accessToken = state.user.accessToken;

    if (accessToken) {
      const currentTime = Date.now() / 1000;
      const decodedToken = await parseJwt(accessToken);

      if (decodedToken.exp < currentTime) {
        try {
          const res = await axiosInstance.post("/auth/refresh-token");
          const newToken = res.data.accessToken;

          // redux update
          store.dispatch(setToken(newToken));
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          console.error("Failed to refresh token:", error);
          store.dispatch(setToken(null));
          store.dispatch(userNotExists());
          toast.error("Session expired, please login again");
          // Redirect to login page or handle as needed
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  async (err) => {
    return Promise.reject(err);
  }
);

async function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    return {};
  }
}

export default axiosInstance;
