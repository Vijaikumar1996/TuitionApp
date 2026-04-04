import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  //baseURL: "http://localhost:7257/api/",
  baseURL: "https://tuitionappapi.azurewebsites.net/api/",

  // timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }

    if (error.response?.status === 403) {
      toast.error("You don’t have permission.");
    }

    if (!error.response) {
      toast.error("Network error.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;