import axios from "axios";

const API_URL = "https://insy7314part2latestversion.onrender.com/api"; // backend base URL

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

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

export default api;
