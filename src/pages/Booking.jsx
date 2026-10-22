import { useParams, useSearchParams, Link } from "react-router";
import { useState, useEffect } from "react";
import API_BASE_URL from "../api";

import "./Booking.css";

const fallbackHotels = [
  {
    id: 1,
    _id: "1",
    name: "The Grand Heritage",
    location: "Pune, Maharashtra",
    rating: 4.8,
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    _id: "2",
    name: "Coastal Breeze Resort",
    location: "Goa, India",
    rating: 4.7,
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    _id: "3",
    name: "Urban Nest Hotel",
    location: "Mumbai, Maharashtra",
    rating: 4.5,
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    _id: "4",
    name: "Royal Palace",
    location: "Delhi, India",
    rating: 4.6,
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    _id: "5",
    name: "Lakeview Retreat",
    location: "Udaipur, Rajasthan",
    rating: 4.9,
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    _id: "6",
    name: "Green Valley Resort",
    location: "Lonavala, Maharashtra",
    rating: 4.4,
    price: 3600,
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=80",
  },
];

function Booking() {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const requestedRoom = searchParams.get("room") || "Deluxe Room";

  const [hotel, setHotel] = useState(() => {
    return (
      fallbackHotels.find(
        (item) =>
          String(item.id) === String(hotelId) ||
          String(item._id) === String(hotelId)
      ) || null
    );
  });

  const [roomType, setRoomType] = useState(requestedRoom);
  const [rooms, setRooms] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [currentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("stayeaseUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [userId] = useState(currentUser?.id || currentUser?._id || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Fetch live hotel if possible
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.hotel) {
            setHotel(data.hotel);
          }
        }
      } catch {
        // Use fallback
      }
    };
    fetchHotel();
  }, [hotelId]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const roomPrices = {
    "Standard Room": hotel ? hotel.price : 0,
    "Deluxe Room": hotel ? hotel.price + 800 : 0,
    "Premium Suite": hotel ? hotel.price + 1800 : 0,
  };

  const currentRoomPrice = roomPrices[roomType] || (hotel ? hotel.price : 0);
  const totalPrice = currentRoomPrice * Number(rooms);

  const handleCheckInChange = (event) => {
    const selectedDate = event.target.value;
    setCheckIn(selectedDate);
    if (checkOut && checkOut < selectedDate) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (event) => {
    const selectedDate = event.target.value;
    setCheckOut(selectedDate);
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (
      !checkIn ||
      !checkOut ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (checkIn < todayDate) {
      alert("Check-in date cannot be in the past.");
      return;
    }

    if (checkOut < todayDate) {
      alert("Check-out date cannot be in the past.");
      return;
    }

    if (checkOut < checkIn) {
      alert("Check-out date cannot be earlier than check-in date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel?._id || hotel?.id,
          hotelName: hotel?.name,
          location: hotel?.location,
          roomType,
          rooms: Number(rooms),
          guests: Number(guests),
          checkIn,
          checkOut,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          amount: totalPrice,
          image: hotel?.image,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to confirm booking.");
      }

      setConfirmedBookingData(data.booking);
      setBookingConfirmed(true);
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hotel) {
    return (
      <main className="booking-not-found">
        <p className="booking-label">STAYEASE</p>
        <h1>Hotel Not Found</h1>
        <p>We could not find the hotel you selected.</p>
        <Link to="/hotels" className="back-hotels-btn">
          ← Back to Hotels
        </Link>
      </main>
    );
  }

  if (bookingConfirmed) {
    const b = confirmedBookingData || {
      id: "SE1001",
      hotel: hotel.name,
      room: roomType,
      guests,
      amount: totalPrice,
    };

    return (
      <main className="booking-success-page">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <p className="booking-label">BOOKING CONFIRMED</p>

          <h1>Your stay is confirmed!</h1>

          <p className="success-message">
            Thank you, {firstName}. Your reservation (ID:{" "}
            <strong>{b.id || b.bookingId}</strong>) for{" "}
            <strong>{hotel.name}</strong> has been successfully booked in our
            database.
          </p>

          <div className="confirmation-details">
            <div>
              <span>Booking ID</span>
              <strong>{b.id || b.bookingId}</strong>
            </div>

            <div>
              <span>Hotel</span>
              <strong>{hotel.name}</strong>
            </div>

            <div>
              <span>Room</span>
              <strong>{roomType}</strong>
            </div>

            <div>
              <span>Dates</span>
              <strong>
                {checkIn} → {checkOut}
              </strong>
            </div>

            <div>
              <span>Guests / Rooms</span>
              <strong>
                {guests} Guests, {rooms} Room(s)
              </strong>
            </div>

            <div>
              <span>Total Paid</span>
              <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/bookings" className="primary-success-btn">
              View My Bookings
            </Link>

            <Link to="/hotels" className="secondary-success-btn">
              Explore More Hotels
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <section className="booking-heading">
        <p className="booking-label">COMPLETE YOUR BOOKING</p>

        <h1>Reserve Your Stay</h1>

        <p>
          Enter your details and review your reservation before confirming.
        </p>
      </section>

      <form className="booking-layout" onSubmit={handleBooking}>
        <div className="booking-form">
          <section className="booking-section">
            <h2>Your Stay</h2>

            <div className="selected-hotel">
              <img src={hotel.image} alt={hotel.name} />

              <div className="selected-hotel-info">
                <p>{hotel.location}</p>
                <h3>{hotel.name}</h3>
                <span>★ {hotel.rating} rating</span>
              </div>
            </div>
          </section>

          <section className="booking-section">
            <h2>Select Your Room</h2>

            <div className="room-options">
              <label
                className={`room-option ${
                  roomType === "Standard Room" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="room"
                  value="Standard Room"
                  checked={roomType === "Standard Room"}
                  onChange={(e) => setRoomType(e.target.value)}
                />

                <div>
                  <strong>Standard Room</strong>
                  <span>Comfortable room with essential amenities</span>
                </div>

                <strong>₹{hotel.price?.toLocaleString("en-IN")}</strong>
              </label>

              <label
                className={`room-option ${
                  roomType === "Deluxe Room" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="room"
                  value="Deluxe Room"
                  checked={roomType === "Deluxe Room"}
                  onChange={(e) => setRoomType(e.target.value)}
                />

                <div>
                  <strong>Deluxe Room</strong>
                  <span>Spacious room with premium facilities</span>
                </div>

                <strong>
                  ₹{(hotel.price + 800)?.toLocaleString("en-IN")}
                </strong>
              </label>

              <label
                className={`room-option ${
                  roomType === "Premium Suite" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="room"
                  value="Premium Suite"
                  checked={roomType === "Premium Suite"}
                  onChange={(e) => setRoomType(e.target.value)}
                />

                <div>
                  <strong>Premium Suite</strong>
                  <span>Luxury suite with additional living space</span>
                </div>

                <strong>
                  ₹{(hotel.price + 1800)?.toLocaleString("en-IN")}
                </strong>
              </label>
            </div>
          </section>

          <section className="booking-section">
            <h2>Stay Details</h2>

            <div className="form-grid">
              <div className="form-field">
                <label>Check-in *</label>

                <input
                  type="date"
                  value={checkIn}
                  min={todayDate}
                  onChange={handleCheckInChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Check-out *</label>

                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || todayDate}
                  onChange={handleCheckOutChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Number of Rooms</label>

                <select
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                </select>
              </div>

              <div className="form-field">
                <label>Guests</label>

                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                </select>
              </div>
            </div>
          </section>

          <section className="booking-section">
            <h2>Guest Information</h2>

            <div className="form-grid">
              <div className="form-field">
                <label>First Name *</label>

                <input
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Last Name *</label>

                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Email Address *</label>

                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Phone Number *</label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="booking-summary">
          <h2>Booking Summary</h2>

          <div className="summary-hotel">
            <img src={hotel.image} alt={hotel.name} />

            <div>
              <strong>{hotel.name}</strong>
              <span>{hotel.location}</span>
            </div>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Room</span>
            <strong>{roomType}</strong>
          </div>

          <div className="summary-row">
            <span>Rooms</span>
            <strong>{rooms}</strong>
          </div>

          <div className="summary-row">
            <span>Guests</span>
            <strong>{guests}</strong>
          </div>

          <div className="summary-row">
            <span>Check-in</span>
            <strong>{checkIn || "Not selected"}</strong>
          </div>

          <div className="summary-row">
            <span>Check-out</span>
            <strong>{checkOut || "Not selected"}</strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-price">
            <span>Total Amount</span>
            <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
          </div>

          <button
            type="submit"
            className="confirm-booking-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>

          <p className="secure-booking">
            🔒 Your booking information is securely handled.
          </p>
        </aside>
      </form>
    </main>
  );
}

export default Booking;