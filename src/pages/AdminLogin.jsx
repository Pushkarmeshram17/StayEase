import { Link, useNavigate } from "react-router";
import { useState } from "react";
import API_BASE_URL from "../api";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail("admin@stayease.com");
    setPassword("admin123");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      if (data.user.role !== "admin") {
        throw new Error(
          "Access denied. You need administrator privileges to enter the Admin Panel."
        );
      }

      localStorage.setItem("stayeaseUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      navigate("/admin");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to server. Check that your backend is running."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-logo">S</div>

          <div>
            <strong>StayEase</strong>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <div className="admin-login-heading">
          <p>ADMINISTRATION</p>

          <h1>Admin Login</h1>

          <span>
            Sign in to manage hotels, rooms, bookings and users.
          </span>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #f87171",
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #fde047",
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "12px",
            color: "#854d0e",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Demo: admin@stayease.com / admin123</span>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: "#ca8a04",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "11px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Fill Demo
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="admin@stayease.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="admin-login-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="admin-login-options">
            <label>
              <input type="checkbox" defaultChecked />
              Remember me
            </label>

            <button
              type="button"
              onClick={() =>
                alert("Demo password for admin is 'admin123'.")
              }
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In to Admin Panel"}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/">
            ← Back to StayEase
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;