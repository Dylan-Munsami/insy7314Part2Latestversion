import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="nav-logo">💳 SwiftPay</h1>
      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/" className="nav-btn">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-btn">Dashboard</Link>
            <Link to="/create-payment" className="nav-btn">Create Payment</Link>
            <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
