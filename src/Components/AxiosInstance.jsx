import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081", // your backend URL
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    console.log("token::", token);

    if (token) {
      config.headers = config.headers || {}; // make sure headers exists
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("config::", config); // this should now show full config
    return config;
  },
  (error) => {
    // In case request setup fails
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

