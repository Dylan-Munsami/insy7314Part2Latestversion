import React, { useState } from "react";
import { staffLogin } from "../services/api";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import useHttpsCheck from "../hooks/useHttpsCheck";

function StaffLogin() {
  useHttpsCheck(); // Check for HTTPS in production

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: DOMPurify.sanitize(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await staffLogin(form);
      const token = DOMPurify.sanitize(res.data.token);
      localStorage.setItem("staffToken", token);
      navigate("/staff-dashboard");
    } catch (err) {
      const msg = DOMPurify.sanitize(err.response?.data?.message || "Login failed");
      setError(msg);
    }
  };

  return (
    <div className="form-card">
      <h2>Staff Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
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

export default StaffLogin;
