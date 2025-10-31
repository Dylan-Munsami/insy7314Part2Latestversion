import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import useHttpsCheck from "../hooks/useHttpsCheck";


function Login() {
  useHttpsCheck(); // Check for HTTPS in production

  const [form, setForm] = useState({ account_number: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: DOMPurify.sanitize(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");

    if (!form.account_number || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await loginUser(form);
      const token = DOMPurify.sanitize(res.data.token);
      localStorage.setItem("token", token);
      setSuccess("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      const msg = DOMPurify.sanitize(err.response?.data?.message || "Invalid credentials.");
      setError(msg);
    }
  };

  return (
    <div className="form-card">
      <h2>Customer Login</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="account_number"
          placeholder="Account Number"
          value={form.account_number}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
