import { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import { Link, useNavigate } from "react-router";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "India",
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // Load the logged-in user's profile from the backend.
  useEffect(() => {
    const loadProfile = async () => {
      const savedUser = localStorage.getItem("stayeaseUser");

      if (!savedUser) {
        setApiError("Please log in to view your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const user = JSON.parse(savedUser);

        if (!user.id) {
          setApiError(
            "User information is missing. Please log in again."
          );
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/users/${user.id}/profile`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load your profile."
          );
        }

        const userProfile = {
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          email: result.user.email || "",
          phone: result.user.phone || "",
          city: result.user.city || "",
          country: result.user.country || "India",
        };

        setProfile(userProfile);
        setOriginalProfile(userProfile);
      } catch (error) {
        setApiError(
          error.message === "Failed to fetch"
            ? "Cannot connect to the backend. Make sure your backend server is running."
            : error.message || "Unable to load your profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Update the form as the user types.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setApiError("");
    setSavedMessage("");
  };

  // Save updated profile information to the backend.
  const handleSave = async (event) => {
    event.preventDefault();

    if (
      !profile.firstName.trim() ||
      !profile.lastName.trim() ||
      !profile.phone.trim()
    ) {
      setApiError(
        "Please fill in your first name, last name, and phone number."
      );
      return;
    }

    const savedUser = localStorage.getItem("stayeaseUser");

    if (!savedUser) {
      setApiError("Your session was not found. Please log in again.");
      return;
    }

    setIsSaving(true);
    setApiError("");
    setSavedMessage("");

    try {
      const user = JSON.parse(savedUser);

      if (!user.id) {
        throw new Error("User ID is missing. Please log in again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/users/${user.id}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: profile.firstName.trim(),
            lastName: profile.lastName.trim(),
            phone: profile.phone.trim(),
            city: profile.city.trim(),
            country: profile.country.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to update your profile."
        );
      }

      const updatedProfile = {
        firstName: result.user.firstName || "",
        lastName: result.user.lastName || "",
        email: result.user.email || "",
        phone: result.user.phone || "",
        city: result.user.city || "",
        country: result.user.country || "India",
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);

      // Keep the saved user information synchronized.
      localStorage.setItem(
        "stayeaseUser",
        JSON.stringify({
          ...user,
          ...result.user,
          id: result.user._id || result.user.id || user.id,
        })
      );

      setIsEditing(false);
      setSavedMessage("Profile updated successfully.");
    } catch (error) {
      setApiError(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that the server is running."
          : error.message || "Unable to save your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Discard unsaved edits.
  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }

    setIsEditing(false);
    setApiError("");
    setSavedMessage("");
  };

  // Clear the saved login session and return to login.
  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("stayeaseUser");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <p>Loading your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <section className="profile-heading">
          <div>
            <p className="profile-label">ACCOUNT</p>
            <h1>My Profile</h1>
            <p>
              Manage your personal information and StayEase
              account preferences.
            </p>
          </div>

          <Link to="/" className="profile-home-btn">
            ← Home
          </Link>
        </section>

        {savedMessage && (
          <div
            className="profile-success-message"
            role="status"
          >
            ✓ {savedMessage}
          </div>
        )}

        {apiError && (
          <div
            className="profile-error-message"
            role="alert"
          >
            {apiError}
          </div>
        )}

        <section className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              {profile.firstName.charAt(0).toUpperCase()}
              {profile.lastName.charAt(0).toUpperCase()}
            </div>

            <h2>
              {profile.firstName} {profile.lastName}
            </h2>

            <p>{profile.email}</p>

            <div className="profile-sidebar-links">
              <a
                href="#personal-information"
                className="profile-sidebar-link active"
              >
                Personal Information
              </a>

              <Link
                to="/bookings"
                className="profile-sidebar-link"
              >
                My Bookings
              </Link>

              <Link
                to="/hotels"
                className="profile-sidebar-link"
              >
                Explore Hotels
              </Link>
            </div>

            <button
              type="button"
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </aside>

          <section
            className="profile-content"
            id="personal-information"
          >
            <div className="profile-content-heading">
              <div>
                <p>PERSONAL INFORMATION</p>
                <h2>Profile Details</h2>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="profile-edit-btn"
                  onClick={() => {
                    setIsEditing(true);
                    setSavedMessage("");
                    setApiError("");
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form
              className="profile-form"
              onSubmit={handleSave}
            >
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-btn"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </section>
        </section>

        <section className="profile-booking-card">
          <div>
            <p>YOUR TRAVEL ACTIVITY</p>
            <h2>Manage your StayEase bookings</h2>
            <span>
              View upcoming reservations, booking details,
              and previous hotel stays.
            </span>
          </div>

          <Link
            to="/bookings"
            className="profile-booking-btn"
          >
            View My Bookings
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Profile;
