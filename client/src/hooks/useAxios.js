import axios from "axios";
import { SERVER_URI } from "../lib/config";
import { clearLocalStorage } from "../redux/localStorage";
import { resetUserState } from "../redux/slices/userSlice";
import store from "../redux/store"; // Import your redux store

class TokenRefreshManager {
  isRefreshing = false;
  refreshSubscribers = [];

  subscribeTokenRefresh(cb) {
    this.refreshSubscribers.push(cb);
  }

  onRefreshed = (newToken) => {
    this.refreshSubscribers.forEach((cb) => cb(newToken));
    this.refreshSubscribers = [];
  };
}

const tokenManager = new TokenRefreshManager();

const axiosInstance = axios.create({
  baseURL: SERVER_URI,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
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
    const originalRequest = error.config;
    const { status } = error.response || {};

    if (status === 401 && !originalRequest._retry) {
      if (tokenManager.isRefreshing) {
        return new Promise((resolve) => {
          tokenManager.subscribeTokenRefresh((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      tokenManager.isRefreshing = true;

      try {
        const response = await axios.post(
          `${SERVER_URI}/auth/refresh-token`,
          {
            refreshToken: store.getState().user?.refreshToken,
          },
          { withCredentials: true }
        );
        const newAccessToken = response.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          tokenManager.isRefreshing = false;
          tokenManager.onRefreshed(newAccessToken);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        return handleAuthError(refreshError);
      } finally {
        tokenManager.isRefreshing = false;
      }
    }

    if (status == 403) {
      return handleAuthError(error);
    }

    return Promise.reject(error);
  }
);

function handleAuthError(error) {
  tokenManager.isRefreshing = false;
  store.dispatch(resetUserState());
  clearLocalStorage();
  return Promise.reject("Authentication failed. Please log in again.");
}

export default axiosInstance;
