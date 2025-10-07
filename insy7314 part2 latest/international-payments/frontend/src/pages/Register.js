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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side password validation before submitting
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPassword.test(form.password)) {
      setError(
        "Password must have at least 8 characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      await registerUser(form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          placeholder="ID Number"
          value={form.id_number}
          onChange={handleChange}
          required
        />
        <input
          name="account_number"
          placeholder="Account Number"
          value={form.account_number}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Password Strength Warning */}
        {form.password &&
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
            form.password
          ) && (
            <p className="error" style={{ fontSize: "13px", marginTop: "-5px" }}>
              Password must have at least 8 characters, including uppercase,
              lowercase, number, and special character.
            </p>
          )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
