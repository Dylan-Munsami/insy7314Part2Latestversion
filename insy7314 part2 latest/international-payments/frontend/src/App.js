import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePayment from "./pages/CreatePayment";
import Dashboard from "./pages/Dashboard";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">🌍 International Bank</div>
      <div className="nav-links">
        <Link className="nav-btn" to="/dashboard">Dashboard</Link>
        <Link className="nav-btn" to="/create-payment">Create Payment</Link>
        <Link className="nav-btn" to="/staff-login">Staff</Link>
        <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-payment" element={<CreatePayment />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
