import React, { useEffect, useState } from "react";
import { getStaffPayments, verifyPayment, sanitize } from "../services/api";
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
        const sanitized = res.data.map(p => ({
          ...p,
          payee_account: sanitize(p.payee_account),
          swift_code: sanitize(p.swift_code),
        }));
        setPayments(sanitized);
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
      setPayments(payments.map(p => p.id === id ? { ...p, verified: true } : p));
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
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Payee</th>
            <th>SWIFT</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.amount}</td>
              <td>{p.currency}</td>
              <td>{p.provider}</td>
              <td>{p.payee_account}</td>
              <td>{p.swift_code}</td>
              <td>{p.verified ? "✅" : "❌"}</td>
              <td>
                {!p.verified && <button onClick={() => handleVerify(p.id)}>Verify</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffDashboard;
