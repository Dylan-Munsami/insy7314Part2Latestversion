import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const staffToken = localStorage.getItem("staffToken");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("staffToken");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">🌍 SwiftPay</div>
      <div className="nav-links">
        {!token && !staffToken && (
          <>
            <Link className="nav-btn" to="/login">Login</Link>
            <Link className="nav-btn" to="/staff-login">Staff Login</Link>
          </>
        )}
        {token && (
          <>
            <Link className="nav-btn" to="/dashboard">Dashboard</Link>
            <Link className="nav-btn" to="/create-payment">Create Payment</Link>
            <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
          </>
        )}
        {staffToken && (
          <>
            <Link className="nav-btn" to="/staff-dashboard">Staff Dashboard</Link>
            <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
