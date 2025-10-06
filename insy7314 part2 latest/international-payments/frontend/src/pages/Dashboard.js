import React, { useEffect, useState } from "react";
import { getPayments } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

useEffect(() => {
  const fetchData = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await getPayments(token);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchData();
}, [token, navigate]);


  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => navigate("/create-payment")}>Create Payment</button>
      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Payee</th>
            <th>SWIFT Code</th>
            <th>Verified</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.amount}</td>
              <td>{p.currency}</td>
              <td>{p.provider}</td>
              <td>{p.payee_account}</td>
              <td>{p.swift_code}</td>
              <td>{p.verified ? "Yes" : "No"}</td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
