import { useState } from "react";
import { Link, useNavigate } from "react-router";
import API_BASE_URL from "../api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
    setServerError("");
  };

  const handleDemoFill = (email, password) => {
    setFormData({ email, password });
    setErrors({});
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Save user session
      localStorage.setItem("stayeaseUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setServerError(
        err.message === "Failed to fetch"
          ? "Cannot connect to server. Please check your backend is running."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-heading">
          <p className="login-label">WELCOME BACK</p>

          <h1>Login to StayEase</h1>

          <p>
            Sign in to manage your bookings and continue your travel journey.
          </p>
        </div>

        {serverError && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
              border: "1px solid #fca5a5",
            }}
          >
            {serverError}
          </div>
        )}

        {/* Quick demo credentials helper */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "18px",
            fontSize: "13px",
            color: "#166534",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span>
            <strong>Quick Demo Access:</strong>
          </span>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() =>
                handleDemoFill("rahul.sharma@email.com", "user123")
              }
              style={{
                fontSize: "12px",
                padding: "3px 8px",
                background: "#dcfce7",
                border: "1px solid #86efac",
                borderRadius: "4px",
                cursor: "pointer",
                color: "#15803d",
              }}
            >
              Traveler Demo (Rahul)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("admin@stayease.com", "admin123")}
              style={{
                fontSize: "12px",
                padding: "3px 8px",
                background: "#fef3c7",
                border: "1px solid #fde047",
                borderRadius: "4px",
                cursor: "pointer",
                color: "#854d0e",
              }}
            >
              Admin Demo
            </button>
          </div>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div
            className={`login-field ${
              errors.email ? "login-field-error" : ""
            }`}
          >
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && <span>{errors.email}</span>}
          </div>

          <div
            className={`login-field ${
              errors.password ? "login-field-error" : ""
            }`}
          >
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && <span>{errors.password}</span>}
          </div>

          <div className="login-form-options">
            <label className="login-remember">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="login-forgot"
              onClick={() =>
                alert(
                  "Demo reminder: Default traveler password is 'user123' and admin is 'admin123'."
                )
              }
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="login-register-link">
          <span>Don't have an account?</span>

          <Link to="/register">Create an account</Link>
        </div>

        <div className="login-admin-link">
          <span>Administrator?</span>

          <Link to="/admin/login">Admin Login</Link>
        </div>
      </section>
    </main>
  );
}

export default Login;