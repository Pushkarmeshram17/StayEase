import { useState, useEffect } from "react";
import { Link } from "react-router";
import API_BASE_URL from "../api";

import "./Bookings.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        let query = "";
        const saved = localStorage.getItem("stayeaseUser");
        if (saved) {
          const u = JSON.parse(saved);
          if (u.email) {
            query = `?email=${encodeURIComponent(u.email)}`;
          }
        }

        const res = await fetch(`${API_BASE_URL}/api/bookings${query}`);
        if (res.ok && active) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch {
        // Fallback
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking ${bookingId}?`
    );
    if (!confirmCancel) return;

    setCancellingId(bookingId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingStatus: "Cancelled" }),
        }
      );

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId || b.bookingId === bookingId
              ? { ...b, status: "Cancelled", bookingStatus: "Cancelled" }
              : b
          )
        );
        alert(`Booking ${bookingId} has been cancelled.`);
      } else {
        alert("Failed to cancel booking.");
      }
    } catch {
      alert("Error contacting server. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="bookings-page">
      <section className="bookings-heading">
        <p className="bookings-label">YOUR TRIPS</p>

        <h1>My Bookings</h1>

        <p>View and manage your StayEase hotel reservations.</p>
      </section>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>Loading your reservations...</p>
        </div>
      ) : (
        <section className="bookings-list">
          {bookings.length > 0 ? (
            bookings.map((booking) => {
              const bId = booking.id || booking.bookingId;
              const isCancelled =
                booking.status === "Cancelled" ||
                booking.bookingStatus === "Cancelled";

              return (
                <article className="booking-item" key={bId}>
                  <div className="booking-image">
                    <img
                      src={
                        booking.image ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={booking.hotel || booking.hotelName}
                    />
                  </div>

                  <div className="booking-information">
                    <div className="booking-top">
                      <div>
                        <p className="booking-location">
                          {booking.location || "India"}
                        </p>

                        <h2>{booking.hotel || booking.hotelName}</h2>
                      </div>

                      <span
                        className={`booking-status ${
                          isCancelled
                            ? "cancelled"
                            : (booking.status || "").toLowerCase()
                        }`}
                        style={{
                          background: isCancelled ? "#fee2e2" : undefined,
                          color: isCancelled ? "#b91c1c" : undefined,
                        }}
                      >
                        {booking.status || booking.bookingStatus || "Confirmed"}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div>
                        <span>Booking ID</span>
                        <strong>{bId}</strong>
                      </div>

                      <div>
                        <span>Room</span>
                        <strong>{booking.room}</strong>
                      </div>

                      <div>
                        <span>Check-in</span>
                        <strong>{booking.checkIn}</strong>
                      </div>

                      <div>
                        <span>Check-out</span>
                        <strong>{booking.checkOut}</strong>
                      </div>

                      <div>
                        <span>Guests</span>
                        <strong>{booking.guests}</strong>
                      </div>

                      <div>
                        <span>Rooms</span>
                        <strong>{booking.rooms}</strong>
                      </div>
                    </div>

                    <div className="booking-bottom">
                      <div className="booking-total">
                        <span>Total Amount</span>
                        <strong>₹{booking.amount?.toLocaleString("en-IN")}</strong>
                      </div>

                      <div className="booking-actions">
                        <Link to="/hotels" className="booking-secondary-btn">
                          Browse Hotels
                        </Link>

                        {!isCancelled && (
                          <button
                            type="button"
                            className="booking-cancel-btn"
                            disabled={cancellingId === bId}
                            onClick={() => handleCancelBooking(bId)}
                          >
                            {cancellingId === bId
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="no-bookings">
              <h2>No bookings yet</h2>
              <p>You haven't made any hotel reservations yet.</p>

              <Link to="/hotels" className="browse-hotels-btn">
                Explore Hotels
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Bookings;