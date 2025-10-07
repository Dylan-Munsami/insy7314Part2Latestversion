import React, { useEffect, useState } from "react";
import { getStaffPayments, verifyPayment } from "../services/api";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("staffToken");

  useEffect(() => {
    if (!token) return navigate("/staff-login");

    const fetchPayments = async () => {
      try {
        const res = await getStaffPayments(token);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, [token, navigate]);

  const handleVerify = async (id) => {
    try {
      const res = await verifyPayment(id, token);
      setMessage(res.data.message);
      setPayments((prev) => prev.map(p => p.id === id ? { ...p, verified: true } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto" }}>
      <h2>Staff Dashboard</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <table border="1" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Payee</th>
            <th>SWIFT Code</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.amount}</td>
              <td>{p.currency}</td>
              <td>{p.provider}</td>
              <td>{p.payee_account}</td>
              <td>{p.swift_code}</td>
              <td>{p.verified ? "Yes" : "No"}</td>
              <td>
                {!p.verified && (
                  <button onClick={() => handleVerify(p.id)} style={{ padding: "5px 10px", cursor: "pointer" }}>
                    Verify & Submit to SWIFT
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffDashboard;
