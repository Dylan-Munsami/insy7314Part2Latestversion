import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    full_name: "",
    id_number: "",
    account_number: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation hints
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/^[A-Za-z\s]{2,100}$/.test(form.full_name)) {
      setError("Full name must be letters only, 2-100 characters.");
      return;
    }
    if (!/^[0-9]{6,20}$/.test(form.id_number)) {
      setError("ID Number must be 6-20 digits.");
      return;
    }
    if (!/^[0-9]{6,20}$/.test(form.account_number)) {
      setError("Account Number must be 6-20 digits.");
      return;
    }

    try {
      await registerUser(form);
      setSuccess("✅ Registration successful! You can now log in.");
      setForm({ full_name: "", id_number: "", account_number: "", password: "" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="form-card">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <input
          name="id_number"
          placeholder="ID Number (numbers only)"
          value={form.id_number}
          onChange={handleChange}
          required
        />
        <input
          name="account_number"
          placeholder="Account Number (numbers only)"
          value={form.account_number}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 chars, strong)"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
