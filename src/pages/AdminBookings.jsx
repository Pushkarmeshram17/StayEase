import { useState, useEffect } from "react";
import { Link } from "react-router";
import API_BASE_URL from "../api";

import "./AdminBookings.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([
    {
      id: "SE1001",
      guest: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      hotel: "The Grand Heritage",
      room: "Deluxe Room",
      checkIn: "25 Sep 2026",
      checkOut: "27 Sep 2026",
      guests: 2,
      rooms: 1,
      amount: 8000,
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      id: "SE1002",
      guest: "Priya Patil",
      email: "priya.patil@email.com",
      hotel: "Coastal Breeze Resort",
      room: "Premium Suite",
      checkIn: "28 Sep 2026",
      checkOut: "30 Sep 2026",
      guests: 3,
      rooms: 1,
      amount: 10600,
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      id: "SE1003",
      guest: "Amit Verma",
      email: "amit.verma@email.com",
      hotel: "Urban Nest Hotel",
      room: "Standard Room",
      checkIn: "02 Oct 2026",
      checkOut: "04 Oct 2026",
      guests: 2,
      rooms: 1,
      amount: 5600,
      paymentStatus: "Pending",
      bookingStatus: "Pending",
    },
    {
      id: "SE1004",
      guest: "Sneha Kulkarni",
      email: "sneha.kulkarni@email.com",
      hotel: "Royal Palace",
      room: "Deluxe Room",
      checkIn: "05 Oct 2026",
      checkOut: "08 Oct 2026",
      guests: 2,
      rooms: 1,
      amount: 13800,
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      id: "SE1005",
      guest: "Vikram Joshi",
      email: "vikram.joshi@email.com",
      hotel: "Lakeview Retreat",
      room: "Premium Suite",
      checkIn: "10 Oct 2026",
      checkOut: "12 Oct 2026",
      guests: 4,
      rooms: 1,
      amount: 10400,
      paymentStatus: "Refunded",
      bookingStatus: "Cancelled",
    },
    {
      id: "SE1006",
      guest: "Neha Deshmukh",
      email: "neha.deshmukh@email.com",
      hotel: "Green Valley Resort",
      room: "Deluxe Room",
      checkIn: "15 Oct 2026",
      checkOut: "17 Oct 2026",
      guests: 3,
      rooms: 1,
      amount: 7200,
      paymentStatus: "Paid",
      bookingStatus: "Completed",
    },
  ]);

  const hotels = [
    "All Hotels",
    "The Grand Heritage",
    "Coastal Breeze Resort",
    "Urban Nest Hotel",
    "Royal Palace",
    "Lakeview Retreat",
    "Green Valley Resort",
  ];

  const bookingStatuses = [
    "All Status",
    "Confirmed",
    "Pending",
    "Completed",
    "Cancelled",
  ];

  const paymentStatuses = [
    "All Payments",
    "Paid",
    "Pending",
    "Refunded",
  ];

  const [search, setSearch] = useState("");
  const [hotelFilter, setHotelFilter] =
    useState("All Hotels");
  const [bookingStatusFilter, setBookingStatusFilter] =
    useState("All Status");
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState("All Payments");

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    guest: "",
    email: "",
    hotel: "",
    room: "Standard Room",
    checkIn: "",
    checkOut: "",
    guests: "1",
    rooms: "1",
    amount: "",
    paymentStatus: "Pending",
    bookingStatus: "Pending",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookings`);
        if (res.ok) {
          const data = await res.json();
          if (data.bookings && data.bookings.length > 0) {
            setBookings(data.bookings);
          }
        }
      } catch {
        // Use fallback
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const searchValue = search.toLowerCase();

    const searchMatch =
      booking.id.toLowerCase().includes(searchValue) ||
      booking.guest.toLowerCase().includes(searchValue) ||
      booking.email.toLowerCase().includes(searchValue) ||
      booking.hotel.toLowerCase().includes(searchValue);

    const hotelMatch =
      hotelFilter === "All Hotels" ||
      booking.hotel === hotelFilter;

    const bookingStatusMatch =
      bookingStatusFilter === "All Status" ||
      booking.bookingStatus === bookingStatusFilter;

    const paymentStatusMatch =
      paymentStatusFilter === "All Payments" ||
      booking.paymentStatus === paymentStatusFilter;

    return (
      searchMatch &&
      hotelMatch &&
      bookingStatusMatch &&
      paymentStatusMatch
    );
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddBooking = (event) => {
    event.preventDefault();

    if (
      !formData.guest ||
      !formData.email ||
      !formData.hotel ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.amount
    ) {
      alert("Please fill all required booking details.");
      return;
    }

    const newBooking = {
      id: `SE${1000 + bookings.length + 1}`,
      guest: formData.guest,
      email: formData.email,
      hotel: formData.hotel,
      room: formData.room,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: Number(formData.guests),
      rooms: Number(formData.rooms),
      amount: Number(formData.amount),
      paymentStatus: formData.paymentStatus,
      bookingStatus: formData.bookingStatus,
    };

    setBookings((previous) => [newBooking, ...previous]);

    setFormData({
      guest: "",
      email: "",
      hotel: "",
      room: "Standard Room",
      checkIn: "",
      checkOut: "",
      guests: "1",
      rooms: "1",
      amount: "",
      paymentStatus: "Pending",
      bookingStatus: "Pending",
    });

    setShowForm(false);

    alert("Booking added successfully!");
  };

  const handleStatusChange = (id, newStatus) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              bookingStatus: newStatus,
            }
          : booking
      )
    );
  };

  const handleCancel = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              bookingStatus: "Cancelled",
              paymentStatus:
                booking.paymentStatus === "Paid"
                  ? "Refunded"
                  : booking.paymentStatus,
            }
          : booking
      )
    );
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
  };

  return (
    <main className="admin-bookings-page">
      <section className="admin-bookings-header">
        <div>
          <p className="admin-bookings-label">
            BOOKING MANAGEMENT
          </p>

          <h1>Bookings</h1>

          <p>
            Manage guest reservations, payments and booking
            statuses across StayEase.
          </p>
        </div>

        <Link
          to="/admin"
          className="admin-bookings-back-btn"
        >
          ← Dashboard
        </Link>
      </section>

      <section className="admin-booking-summary">
        <div>
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </div>

        <div>
          <span>Confirmed</span>
          <strong>
            {
              bookings.filter(
                (booking) =>
                  booking.bookingStatus === "Confirmed"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {
              bookings.filter(
                (booking) =>
                  booking.bookingStatus === "Pending"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Cancelled</span>
          <strong>
            {
              bookings.filter(
                (booking) =>
                  booking.bookingStatus === "Cancelled"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Revenue</span>
          <strong>
            ₹
            {bookings
              .filter(
                (booking) =>
                  booking.bookingStatus !== "Cancelled"
              )
              .reduce(
                (total, booking) =>
                  total + booking.amount,
                0
              )
              .toLocaleString("en-IN")}
          </strong>
        </div>
      </section>

      <section className="admin-bookings-toolbar">
        <div className="admin-booking-search">
          <input
            type="text"
            placeholder="Search booking ID, guest, email or hotel..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={hotelFilter}
          onChange={(event) =>
            setHotelFilter(event.target.value)
          }
        >
          {hotels.map((hotel) => (
            <option value={hotel} key={hotel}>
              {hotel}
            </option>
          ))}
        </select>

        <select
          value={bookingStatusFilter}
          onChange={(event) =>
            setBookingStatusFilter(event.target.value)
          }
        >
          {bookingStatuses.map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={paymentStatusFilter}
          onChange={(event) =>
            setPaymentStatusFilter(event.target.value)
          }
        >
          {paymentStatuses.map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="admin-add-booking-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Booking
        </button>
      </section>

      <div className="admin-booking-result">
        Showing <strong>{filteredBookings.length}</strong>{" "}
        of <strong>{bookings.length}</strong> bookings
      </div>

      <section className="admin-booking-table-card">
        <div className="admin-booking-table-wrapper">
          <table className="admin-booking-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Guest</th>
                <th>Hotel / Room</th>
                <th>Stay</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong className="admin-booking-id">
                        {booking.id}
                      </strong>
                    </td>

                    <td>
                      <div className="admin-booking-guest">
                        <strong>{booking.guest}</strong>
                        <span>{booking.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="admin-booking-hotel">
                        <strong>{booking.hotel}</strong>
                        <span>{booking.room}</span>
                      </div>
                    </td>

                    <td>
                      <div className="admin-booking-stay">
                        <strong>
                          {booking.checkIn}
                        </strong>
                        <span>
                          to {booking.checkOut}
                        </span>
                      </div>
                    </td>

                    <td>
                      {booking.guests} Guests
                      <br />
                      {booking.rooms} Room
                    </td>

                    <td className="admin-booking-amount">
                      ₹
                      {booking.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <span
                        className={`admin-payment-status ${booking.paymentStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-booking-status ${booking.bookingStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>

                    <td>
                      <div className="admin-booking-actions">
                        <button
                          type="button"
                          className="admin-booking-view"
                          onClick={() =>
                            handleView(booking)
                          }
                        >
                          View
                        </button>

                        {booking.bookingStatus !==
                          "Cancelled" &&
                          booking.bookingStatus !==
                            "Completed" && (
                            <button
                              type="button"
                              className="admin-booking-cancel"
                              onClick={() =>
                                handleCancel(
                                  booking.id
                                )
                              }
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="admin-booking-empty"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedBooking && (
        <div
          className="admin-booking-modal-overlay"
          onClick={() => setSelectedBooking(null)}
        >
          <section
            className="admin-booking-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-booking-modal-heading">
              <div>
                <p>BOOKING DETAILS</p>
                <h2>{selectedBooking.id}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-booking-detail-grid">
              <div>
                <span>Guest</span>
                <strong>
                  {selectedBooking.guest}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedBooking.email}
                </strong>
              </div>

              <div>
                <span>Hotel</span>
                <strong>
                  {selectedBooking.hotel}
                </strong>
              </div>

              <div>
                <span>Room</span>
                <strong>
                  {selectedBooking.room}
                </strong>
              </div>

              <div>
                <span>Check-in</span>
                <strong>
                  {selectedBooking.checkIn}
                </strong>
              </div>

              <div>
                <span>Check-out</span>
                <strong>
                  {selectedBooking.checkOut}
                </strong>
              </div>

              <div>
                <span>Guests</span>
                <strong>
                  {selectedBooking.guests}
                </strong>
              </div>

              <div>
                <span>Rooms</span>
                <strong>
                  {selectedBooking.rooms}
                </strong>
              </div>

              <div>
                <span>Total Amount</span>
                <strong>
                  ₹
                  {selectedBooking.amount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>
                <strong>
                  {selectedBooking.paymentStatus}
                </strong>
              </div>
            </div>

            <div className="admin-booking-status-control">
              <label>Booking Status</label>

              <select
                value={selectedBooking.bookingStatus}
                onChange={(event) => {
                  const newStatus =
                    event.target.value;

                  handleStatusChange(
                    selectedBooking.id,
                    newStatus
                  );

                  setSelectedBooking({
                    ...selectedBooking,
                    bookingStatus: newStatus,
                  });
                }}
              >
                <option value="Confirmed">
                  Confirmed
                </option>
                <option value="Pending">
                  Pending
                </option>
                <option value="Completed">
                  Completed
                </option>
                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div className="admin-booking-modal-actions">
              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(null)
                }
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {showForm && (
        <div
          className="admin-booking-modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <section
            className="admin-booking-modal admin-add-booking-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-booking-modal-heading">
              <div>
                <p>BOOKING MANAGEMENT</p>
                <h2>Add New Booking</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddBooking}>
              <div className="admin-booking-form-grid">
                <div className="admin-booking-field">
                  <label>Guest Name *</label>
                  <input
                    type="text"
                    name="guest"
                    placeholder="Enter guest name"
                    value={formData.guest}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-booking-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="guest@email.com"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-booking-field">
                  <label>Hotel *</label>
                  <select
                    name="hotel"
                    value={formData.hotel}
                    onChange={handleFormChange}
                  >
                    <option value="">
                      Select Hotel
                    </option>

                    {hotels
                      .filter(
                        (hotel) =>
                          hotel !== "All Hotels"
                      )
                      .map((hotel) => (
                        <option
                          value={hotel}
                          key={hotel}
                        >
                          {hotel}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="admin-booking-field">
                  <label>Room Type</label>
                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleFormChange}
                  >
                    <option value="Standard Room">
                      Standard Room
                    </option>
                    <option value="Deluxe Room">
                      Deluxe Room
                    </option>
                    <option value="Premium Suite">
                      Premium Suite
                    </option>
                  </select>
                </div>

                <div className="admin-booking-field">
                  <label>Check-in *</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-booking-field">
                  <label>Check-out *</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-booking-field">
                  <label>Guests</label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleFormChange}
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">
                      2 Guests
                    </option>
                    <option value="3">
                      3 Guests
                    </option>
                    <option value="4">
                      4 Guests
                    </option>
                    <option value="5">
                      5 Guests
                    </option>
                    <option value="6">
                      6 Guests
                    </option>
                  </select>
                </div>

                <div className="admin-booking-field">
                  <label>Rooms</label>
                  <select
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleFormChange}
                  >
                    <option value="1">1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>
                    <option value="4">4 Rooms</option>
                  </select>
                </div>

                <div className="admin-booking-field">
                  <label>Total Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    min="0"
                    placeholder="e.g. 8000"
                    value={formData.amount}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-booking-field">
                  <label>Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleFormChange}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">
                      Pending
                    </option>
                    <option value="Refunded">
                      Refunded
                    </option>
                  </select>
                </div>

                <div className="admin-booking-field">
                  <label>Booking Status</label>
                  <select
                    name="bookingStatus"
                    value={formData.bookingStatus}
                    onChange={handleFormChange}
                  >
                    <option value="Confirmed">
                      Confirmed
                    </option>
                    <option value="Pending">
                      Pending
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              <div className="admin-booking-modal-actions">
                <button
                  type="button"
                  className="admin-booking-modal-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-booking-modal-submit"
                >
                  Add Booking
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdminBookings;