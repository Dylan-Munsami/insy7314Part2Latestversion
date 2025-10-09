import React, { useEffect, useState } from "react";
import { getStaffPayments, verifyPayment } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./StaffDashboard.css"; // ✅ Make sure to import

function StaffDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("staffToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/staff-login");
    const fetchPayments = async () => {
      try {
        const res = await getStaffPayments(token);
        setPayments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch payments.");
      }
    };
    fetchPayments();
  }, [token, navigate]);

  const handleVerify = async (id) => {
    setError("");
    setMessage("");
    try {
      const res = await verifyPayment(id, token);
      setMessage(res.data.message || "Payment verified successfully!");
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, verified: true } : p))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify payment.");
    }
  };

  return (
    <div className="staff-dashboard">
      <h2 className="dashboard-title">Staff Dashboard</h2>

      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}

      <div className="table-container">
        <table className="payments-table">
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
            {payments.map((p) => (
              <tr key={p.id} className={p.verified ? "verified-row" : ""}>
                <td>{p.id}</td>
                <td>{p.amount}</td>
                <td>{p.currency}</td>
                <td>{p.provider}</td>
                <td>{p.payee_account}</td>
                <td>{p.swift_code}</td>
                <td>{p.verified ? "✅" : "❌"}</td>
                <td>
                  {!p.verified && (
                    <button
                      className="verify-btn"
                      onClick={() => handleVerify(p.id)}
                    >
                      Verify & Submit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffDashboard;
