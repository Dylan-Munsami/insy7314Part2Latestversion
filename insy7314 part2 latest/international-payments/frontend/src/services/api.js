import axios from "axios";
import DOMPurify from "dompurify";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // needed for CSRF cookies
});

// Sanitize data before sending
function sanitizeData(data) {
  const clean = {};
  for (let key in data) {
    if (typeof data[key] === "string") {
      clean[key] = DOMPurify.sanitize(data[key]);
    } else {
      clean[key] = data[key];
    }
  }
  return clean;
}

// Customer APIs
export const loginUser = (data) => api.post("/auth/login", sanitizeData(data));
export const createPayment = (data, token) =>
  api.post("/payments", sanitizeData(data), { headers: { Authorization: `Bearer ${token}` } });
export const getPayments = (token) =>
  api.get("/payments", { headers: { Authorization: `Bearer ${token}` } });

// Staff APIs
export const staffLogin = (data) => api.post("/staff/login", sanitizeData(data));
export const getStaffPayments = (token) =>
  api.get("/staff/payments", { headers: { Authorization: `Bearer ${token}` } });
export const verifyPayment = (id, token) =>
  api.post(`/staff/verify/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export default api;
