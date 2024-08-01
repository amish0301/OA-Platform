import axios from "axios";
import store from "../redux/store"; // Import your redux store
import { setToken, userNotExists } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  headers: {
    "Authorization" : `Bearer ${localStorage.getItem("accessToken")}`
  }
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.map((cb) => cb(newToken));
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.user.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response: { status } } = error;
    const state = store.getState();
    const dispatch = store.dispatch;

    if (status === 401 && !config._retry) {
      console.log('refreshing token');
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(config));
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const response = await axiosInstance.post('/auth/refresh-token');
          const newAccessToken = response.data.accessToken;

          store.dispatch(setToken(newAccessToken));
          localStorage.setItem("accessToken", newAccessToken);

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          config.headers.Authorization = `Bearer ${newAccessToken}`;

          isRefreshing = false;
          onRefreshed(newAccessToken);
          resolve(axiosInstance(config));
        } catch (err) {
          isRefreshing = false;
          dispatch(setToken(null));
          dispatch(userNotExists());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("reduxState");
          toast.error("Session expired, please login again");
          reject(err);
        }
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
