import React, { useState } from "react";
import { createPayment } from "../services/api";
import { useNavigate } from "react-router-dom";

function CreatePayment() {
  const [form, setForm] = useState({
    amount: "",
    currency: "",
    provider: "SWIFT",
    payee_account: "",
    swift_code: ""
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createPayment(form, token);
      setMessage(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div>
      <h2>Create Payment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <input name="currency" placeholder="Currency (e.g., USD)" value={form.currency} onChange={handleChange} required />
        <input name="provider" placeholder="Provider (e.g., SWIFT)" value={form.provider} onChange={handleChange} required />
        <input name="payee_account" placeholder="Payee Account" value={form.payee_account} onChange={handleChange} required />
        <input name="swift_code" placeholder="SWIFT Code" value={form.swift_code} onChange={handleChange} required />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default CreatePayment;
