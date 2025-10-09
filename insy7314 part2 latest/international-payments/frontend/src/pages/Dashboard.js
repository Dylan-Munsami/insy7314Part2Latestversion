import React, { useEffect, useState } from "react";
import { getPayments, sanitize } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchPayments = async () => {
      try {
        const res = await getPayments(token);
        // sanitize before rendering
        const sanitizedPayments = res.data.map(p => ({
          ...p,
          payee_account: sanitize(p.payee_account),
          swift_code: sanitize(p.swift_code),
        }));
        setPayments(sanitizedPayments);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPayments();
  }, [token, navigate]);

  return (
    <div className="dashboard">
      <h2>Your Payment History</h2>
      <button onClick={() => navigate("/create-payment")} className="primary-btn">
        + Create Payment
      </button>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Payee</th>
            <th>SWIFT</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.amount}</td>
              <td>{p.currency}</td>
              <td>{p.provider}</td>
              <td>{p.payee_account}</td>
              <td>{p.swift_code}</td>
              <td>{p.verified ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
