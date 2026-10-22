import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";

import Logo from "./Logo";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("stayeaseUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem("stayeaseUser");
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    localStorage.removeItem("stayeaseUser");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink
          to="/"
          className="logo-link"
          onClick={closeMenu}
        >
          <Logo />
        </NavLink>

        <button
          type="button"
          className="navbar-menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={`navbar-content ${
            menuOpen ? "navbar-content-open" : ""
          }`}
        >
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/hotels"
              onClick={closeMenu}
            >
              Hotels
            </NavLink>

            <NavLink
              to="/bookings"
              onClick={closeMenu}
            >
              My Bookings
            </NavLink>

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className="admin-nav-badge"
                onClick={closeMenu}
              >
                Admin Panel
              </NavLink>
            )}

            {user && (
              <NavLink
                to="/profile"
                onClick={closeMenu}
              >
                Profile
              </NavLink>
            )}
          </nav>

          <div className="nav-actions">
            {user ? (
              <div className="navbar-user-box">
                <NavLink
                  to="/profile"
                  className="navbar-user-info"
                  onClick={closeMenu}
                  title="View Profile"
                >
                  <span className="navbar-avatar">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="navbar-user-name">
                    {user.firstName || "Account"}
                  </span>
                </NavLink>

                <button
                  type="button"
                  className="navbar-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="login-btn"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="register-btn"
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;