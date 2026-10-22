import { useState, useEffect } from "react";
import { Link } from "react-router";
import API_BASE_URL from "../api";

import "./AdminDashboard.css";

const fallbackStats = [
  {
    label: "Total Hotels",
    value: "6",
    detail: "Properties active",
  },
  {
    label: "Total Rooms",
    value: "6",
    detail: "4 currently available",
  },
  {
    label: "Total Bookings",
    value: "3",
    detail: "All time bookings",
  },
  {
    label: "Registered Users",
    value: "3",
    detail: "Registered travelers",
  },
];

const fallbackRecentBookings = [
  {
    id: "SE1001",
    guest: "Rahul Sharma",
    hotel: "The Grand Heritage",
    room: "Deluxe Room",
    date: "25 Oct 2026",
    amount: "₹8,000",
    status: "Confirmed",
  },
  {
    id: "SE1002",
    guest: "Priya Patil",
    hotel: "Coastal Breeze Resort",
    room: "Premium Suite",
    date: "28 Oct 2026",
    amount: "₹10,600",
    status: "Confirmed",
  },
  {
    id: "SE1003",
    guest: "Amit Verma",
    hotel: "Urban Nest Hotel",
    room: "Standard Room",
    date: "02 Nov 2026",
    amount: "₹5,600",
    status: "Pending",
  },
];

function AdminDashboard() {
  const [stats, setStats] = useState(fallbackStats);
  const [recentBookings, setRecentBookings] = useState(fallbackRecentBookings);
  const [overview, setOverview] = useState({
    availableRooms: 4,
    activeHotels: 6,
    pendingBookings: 1,
    pendingReviews: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
        if (response.ok) {
          const data = await response.json();
          if (data.stats) setStats(data.stats);
          if (data.recentBookings && data.recentBookings.length > 0) {
            setRecentBookings(data.recentBookings);
          }
          if (data.overview) setOverview(data.overview);
        }
      } catch {
        // Fallback
      }
    };

    fetchDashboard();
  }, []);

  return (
    <main className="admin-dashboard">
      {/* Header */}
      <section className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-label">ADMINISTRATION</p>

          <h1>Dashboard</h1>

          <p>
            Welcome back. Here's a live overview of your StayEase platform.
          </p>
        </div>

        <Link to="/admin/hotels" className="admin-primary-btn">
          + Add Hotel
        </Link>
      </section>

      {/* Statistics */}
      <section className="admin-stats-grid">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <div className="admin-stat-top">
              <span>{stat.label}</span>
              <div className="admin-stat-icon">
                {stat.label === "Total Hotels" && "🏨"}
                {stat.label === "Total Rooms" && "🛏️"}
                {stat.label === "Total Bookings" && "📅"}
                {stat.label === "Registered Users" && "👥"}
              </div>
            </div>

            <strong>{stat.value}</strong>

            <p>{stat.detail}</p>
          </article>
        ))}
      </section>

      {/* Main Dashboard Content */}
      <section className="admin-dashboard-grid">
        {/* Recent Bookings */}
        <article className="admin-dashboard-card admin-recent-bookings">
          <div className="admin-card-heading">
            <div>
              <p>BOOKING ACTIVITY</p>
              <h2>Recent Bookings</h2>
            </div>

            <Link to="/admin/bookings">View All</Link>
          </div>

          <div className="admin-booking-table-wrapper">
            <table className="admin-booking-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Guest</th>
                  <th>Hotel</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.id}</strong>
                      <span>{booking.room}</span>
                    </td>

                    <td>{booking.guest}</td>

                    <td>{booking.hotel}</td>

                    <td>{booking.date}</td>

                    <td className="admin-booking-amount">{booking.amount}</td>

                    <td>
                      <span
                        className={`admin-booking-status ${booking.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Quick Actions */}
        <article className="admin-dashboard-card admin-quick-actions">
          <div className="admin-card-heading">
            <div>
              <p>MANAGEMENT</p>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-action-list">
            <Link to="/admin/hotels">
              <div>
                <strong>Manage Hotels</strong>
                <span>Add, edit or remove hotels</span>
              </div>

              <span>→</span>
            </Link>

            <Link to="/admin/rooms">
              <div>
                <strong>Manage Rooms</strong>
                <span>Manage room types and availability</span>
              </div>

              <span>→</span>
            </Link>

            <Link to="/admin/bookings">
              <div>
                <strong>Manage Bookings</strong>
                <span>Review and update reservations</span>
              </div>

              <span>→</span>
            </Link>

            <Link to="/admin/users">
              <div>
                <strong>Manage Users</strong>
                <span>View registered customers</span>
              </div>

              <span>→</span>
            </Link>

            <Link to="/admin/reviews">
              <div>
                <strong>Manage Reviews</strong>
                <span>Review customer feedback</span>
              </div>

              <span>→</span>
            </Link>
          </div>
        </article>
      </section>

      {/* Bottom Overview */}
      <section className="admin-dashboard-card admin-platform-overview">
        <div className="admin-card-heading">
          <div>
            <p>PLATFORM STATUS</p>
            <h2>StayEase Overview</h2>
          </div>
        </div>

        <div className="admin-overview-grid">
          <div>
            <span>Available Rooms</span>
            <strong>{overview.availableRooms}</strong>
            <small>Ready for guests</small>
          </div>

          <div>
            <span>Active Hotels</span>
            <strong>{overview.activeHotels}</strong>
            <small>Live on platform</small>
          </div>

          <div>
            <span>Pending Bookings</span>
            <strong>{overview.pendingBookings}</strong>
            <small>Requires attention</small>
          </div>

          <div>
            <span>Pending Reviews</span>
            <strong>{overview.pendingReviews}</strong>
            <small>Waiting for moderation</small>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;