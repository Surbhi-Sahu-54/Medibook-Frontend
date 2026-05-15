import axios from "axios";

// Axios instance configured for MediBook Spring Boot API Gateway
const api = axios.create({
  baseURL: "http://localhost:8085",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;