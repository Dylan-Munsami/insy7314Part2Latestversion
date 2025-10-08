import axios from "axios";
import DOMPurify from "dompurify";

const API_URL = "https://insy7314part2latestversion.onrender.com/api"; // backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // required for CSRF & refresh tokens
});

// Interceptor to refresh JWT if expired
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        localStorage.setItem("token", res.data.token);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed", err);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Customer APIs
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const createPayment = (data, token) =>
  api.post("/payments", data, { headers: { Authorization: `Bearer ${token}` } });
export const getPayments = (token) =>
  api.get("/payments", { headers: { Authorization: `Bearer ${token}` } });

// Staff APIs
export const staffLogin = (data) => api.post("/staff/login", data);
export const getStaffPayments = (token) =>
  api.get("/staff/payments", { headers: { Authorization: `Bearer ${token}` } });
export const verifyPayment = (id, token) =>
  api.post(`/staff/verify/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

// Sanitizer for XSS-safe rendering
export const sanitize = (input) => DOMPurify.sanitize(input);

export default api;
