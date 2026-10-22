import { Link } from "react-router";
import Logo from "./Logo";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <Logo />
            </Link>
            <p className="footer-tagline">
              Find and book luxury, boutique, and budget-friendly stays across
              India. Experience effortless booking with StayEase.
            </p>
            <div className="footer-contacts">
              <span>📍 Mumbai • Pune • Goa • Delhi • Udaipur</span>
              <span>📞 +91 1800-STAY-EASE</span>
              <span>✉️ support@stayease.com</span>
            </div>
          </div>

          <div className="footer-links-group">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/hotels">Browse Hotels</Link>
              </li>
              <li>
                <Link to="/bookings">My Bookings</Link>
              </li>
              <li>
                <Link to="/profile">My Account</Link>
              </li>
              <li>
                <Link to="/admin/login">Admin Portal</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h3>Top Destinations</h3>
            <ul>
              <li>
                <Link to="/hotels?city=Goa">Goa Beach Resorts</Link>
              </li>
              <li>
                <Link to="/hotels?city=Pune">Pune City Stays</Link>
              </li>
              <li>
                <Link to="/hotels?city=Mumbai">Mumbai Luxury Hotels</Link>
              </li>
              <li>
                <Link to="/hotels?city=Udaipur">Udaipur Palace Retreats</Link>
              </li>
              <li>
                <Link to="/hotels?city=Delhi">Delhi Heritage Stays</Link>
              </li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3>Stay in the Loop</h3>
            <p>
              Subscribe for exclusive hotel discounts, seasonal member deals,
              and curated travel guides.
            </p>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to StayEase offers!");
                e.target.reset();
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} StayEase Technologies Pvt Ltd. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </a>
            <span>•</span>
            <a href="#safety" onClick={(e) => e.preventDefault()}>
              Guest Safety
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
