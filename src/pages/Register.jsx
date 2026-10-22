import { useState } from "react";
import { Link, useNavigate } from "react-router";
import API_BASE_URL from "../api";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          role: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Auto-save user session
      localStorage.setItem("stayeaseUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      alert("Account created successfully! Welcome to StayEase.");
      navigate("/profile");
    } catch (err) {
      setServerError(
        err.message === "Failed to fetch"
          ? "Unable to connect to server. Please ensure the backend is running."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-heading">
          <p className="register-label">JOIN STAYEASE</p>

          <h1>Create your account</h1>

          <p>
            Create an account to book hotels and manage your reservations easily.
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

        <form
          className="register-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="register-name-grid">
            <div
              className={`register-field ${
                errors.firstName ? "register-field-error" : ""
              }`}
            >
              <label htmlFor="firstName">First Name</label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
              />

              {errors.firstName && <span>{errors.firstName}</span>}
            </div>

            <div
              className={`register-field ${
                errors.lastName ? "register-field-error" : ""
              }`}
            >
              <label htmlFor="lastName">Last Name</label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
              />

              {errors.lastName && <span>{errors.lastName}</span>}
            </div>
          </div>

          <div
            className={`register-field ${
              errors.email ? "register-field-error" : ""
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
            className={`register-field ${
              errors.phone ? "register-field-error" : ""
            }`}
          >
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />

            {errors.phone && <span>{errors.phone}</span>}
          </div>

          <div
            className={`register-field ${
              errors.password ? "register-field-error" : ""
            }`}
          >
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && <span>{errors.password}</span>}
          </div>

          <div
            className={`register-field ${
              errors.confirmPassword ? "register-field-error" : ""
            }`}
          >
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <span>{errors.confirmPassword}</span>
            )}
          </div>

          <label className="register-terms">
            <input type="checkbox" required defaultChecked />

            <span>I agree to the StayEase terms and privacy policy.</span>
          </label>

          <button
            type="submit"
            className="register-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="register-login-link">
          <span>Already have an account?</span>

          <Link to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}

export default Register;