
import React, { useEffect, useState } from "react";
import { getStaffPayments, verifyPayment } from "../services/api";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("staffToken");
  const navigate = useNavigate();

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
      setPayments(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Staff Dashboard</h2>
      {message && <p className="success">{message}</p>}
      <table>
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
              <td>{p.verified ? "✅" : "❌"}</td>
              <td>
                {!p.verified && <button onClick={() => handleVerify(p.id)}>Verify & Submit</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffDashboard;
//staffdashboard.js
