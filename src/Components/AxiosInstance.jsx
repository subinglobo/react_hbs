import axios from "axios";
import { showSessionExpiredAlert } from "./SessionExpired";


const axiosInstance = axios.create({
  baseURL: "http://localhost:8081",
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      showSessionExpiredAlert();
      return Promise.reject("No token found. Redirecting to login...");
    }

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
     showSessionExpiredAlert();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
