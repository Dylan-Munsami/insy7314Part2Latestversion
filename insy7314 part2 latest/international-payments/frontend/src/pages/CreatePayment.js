import React, { useState } from "react";
import { createPayment } from "../services/api";
import { useNavigate } from "react-router-dom";

function CreatePayment() {
  const [form, setForm] = useState({
    amount: "",
    currency: "",
    provider: "SWIFT",
    payee_account: "",
    swift_code: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await createPayment(form, token);
      setMessage(res.data.message || "Payment created successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  return (
    <div className="form-card">
      <h2>Create International Payment</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Amount */}
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          min="0.01"
          onChange={handleChange}
          required
        />

        {/* Currency */}
        <input
          name="currency"
          placeholder="Currency (USD, EUR, ZAR)"
          pattern="[A-Z]{3}"
          title="3 uppercase letters (e.g., USD, EUR, ZAR)"
          onChange={handleChange}
          required
        />

        {/* Provider (read-only) */}
        <input
          name="provider"
          placeholder="Provider"
          value={form.provider}
          readOnly
          required
        />

        {/* Payee Account */}
        <input
          name="payee_account"
          placeholder="Payee Account"
          pattern="[0-9]{6,30}"
          title="6-30 digit account number"
          onChange={handleChange}
          required
        />

        {/* SWIFT Code */}
        <input
          name="swift_code"
          placeholder="SWIFT Code"
          pattern="[A-Z0-9]{8,11}"
          title="8-11 uppercase letters or numbers (e.g., ABCDZAJJ)"
          onChange={handleChange}
          required
        />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default CreatePayment;
