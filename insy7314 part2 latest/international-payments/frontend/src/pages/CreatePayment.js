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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createPayment(form, token);
      setMessage(res.data.message);
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
        <input name="amount" type="number" step="0.01" placeholder="Amount" onChange={handleChange} required />
        <input name="currency" placeholder="Currency (USD, EUR)" onChange={handleChange} required />
        <input name="provider" placeholder="Provider" value={form.provider} onChange={handleChange} required />
        <input name="payee_account" placeholder="Payee Account" onChange={handleChange} required />
        <input name="swift_code" placeholder="SWIFT Code" onChange={handleChange} required />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default CreatePayment;