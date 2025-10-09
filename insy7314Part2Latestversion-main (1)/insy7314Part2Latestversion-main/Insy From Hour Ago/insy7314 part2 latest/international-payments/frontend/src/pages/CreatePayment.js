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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Frontend validation
    if (!form.amount || form.amount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!/^[A-Z]{3}$/.test(form.currency)) {
      setError("Currency must be a 3-letter code, e.g., USD or EUR.");
      return;
    }
    if (!/^[A-Za-z\s]{3,50}$/.test(form.provider)) {
      setError("Provider name should be 3-50 letters.");
      return;
    }
    if (!/^[0-9]{6,30}$/.test(form.payee_account)) {
      setError("Payee Account must be 6-30 digits.");
      return;
    }
    if (!/^[A-Z0-9]{8,11}$/.test(form.swift_code)) {
      setError("SWIFT Code must be 8-11 characters (letters & numbers).");
      return;
    }

try {
  const response = await createPayment(form, token); // rename res -> response
  setMessage(response.data.message);
  setTimeout(() => navigate("/dashboard"), 1200);
} catch (err) {
  setError(err.response?.data?.message || "Payment failed");

    }
  };

  return (
    <div className="form-card">
      <h2>Create International Payment</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          name="currency"
          placeholder="Currency (USD, EUR)"
          value={form.currency}
          onChange={handleChange}
          required
        />
        <input
          name="provider"
          placeholder="Provider (e.g., SWIFT)"
          value={form.provider}
          onChange={handleChange}
          required
        />
        <input
          name="payee_account"
          placeholder="Payee Account (6-30 digits)"
          value={form.payee_account}
          onChange={handleChange}
          required
        />
        <input
          name="swift_code"
          placeholder="SWIFT Code (8-11 letters/numbers)"
          value={form.swift_code}
          onChange={handleChange}
          required
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default CreatePayment;
