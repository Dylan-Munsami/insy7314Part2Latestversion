import axios from "axios";
import DOMPurify from "dompurify";

const API_URL = "https://insy7314part2latestversion.onrender.com/api"; // backend base URL

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ====================
// Sanitizer for XSS-safe rendering
// ====================
export const sanitize = (input) => DOMPurify.sanitize(input);

// ====================
// Customer APIs
// ====================

// Register new customer
export const registerUser = (data) => api.post("/auth/register", data);

// Customer login
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  // store JWT in localStorage
  if (res.data.token) localStorage.setItem("token", res.data.token);
  return res;
};

// Create new payment (requires JWT)
export const createPayment = (data) => {
  const token = localStorage.getItem("token");
  return api.post("/payments", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get customer payments (requires JWT)
export const getPayments = () => {
  const token = localStorage.getItem("token");
  return api.get("/payments", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ====================
// Staff APIs
// ====================

// Staff login
export const staffLogin = async (data) => {
  const res = await api.post("/staff/login", data);
  // store JWT in localStorage separately for staff
  if (res.data.token) localStorage.setItem("staffToken", res.data.token);
  return res;
};

// Get all payments for staff dashboard
export const getStaffPayments = () => {
  const token = localStorage.getItem("staffToken");
  return api.get("/staff/payments", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Verify a payment (staff)
export const verifyPayment = (id) => {
  const token = localStorage.getItem("staffToken");
  return api.post(`/staff/verify/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default api;
