import axios from "axios";
import store from "../redux/store"; // Import your redux store
import { setToken, userNotExists } from "../redux/slices/userSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.map((cb) => cb(newToken));
  refreshSubscribers = [];
};

// if user logged in through Oauth then we're storing tokens in redux state
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().user?.accessToken;
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
    const {
      config,
      response: { status },
    } = error;
    const state = store.getState();
    const dispatch = store.dispatch;

    if (status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            config.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(config));
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URI}/auth/refresh-token`,
            {
              refreshToken: state.user.user.refreshToken,
            },
            { withCredentials: true }
          );
          
          const newAccessToken = response.data?.accessToken;

          dispatch(setToken(newAccessToken)); // -store.dispatch
          localStorage.setItem("accessToken", newAccessToken);

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;

          isRefreshing = false;
          onRefreshed(newAccessToken);
          resolve(axiosInstance(config));
        } catch (err) {
          isRefreshing = false;
          dispatch(setToken(null));
          dispatch(userNotExists());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("reduxState");
          reject('Token Expired Login Again');
        }
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;