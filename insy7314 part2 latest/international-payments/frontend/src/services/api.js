import axios from "axios";

// Use your deployed Render URL here
const API_URL = "https://insy7314part2latestversion.onrender.com/api";

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Export functions to call your backend
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const createPayment = (data, token) =>
  api.post("/payments", data, { headers: { Authorization: `Bearer ${token}` } });
export const getPayments = (token) =>
  api.get("/payments", { headers: { Authorization: `Bearer ${token}` } });

export default api;
