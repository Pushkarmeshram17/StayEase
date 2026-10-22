import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import API_BASE_URL from "../api";

import "./HotelDetails.css";

const fallbackHotels = [
  {
    id: "1",
    _id: "1",
    name: "The Grand Heritage",
    location: "Pune, Maharashtra",
    rating: 4.8,
    reviewsCount: 124,
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    description:
      "A comfortable and elegant hotel in the heart of Pune, offering modern rooms, warm hospitality and convenient access to major city attractions.",
    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "Restaurant",
      "Free Parking",
      "Room Service",
      "Air Conditioning",
    ],
  },
  {
    id: "2",
    _id: "2",
    name: "Coastal Breeze Resort",
    location: "Goa",
    rating: 4.7,
    reviewsCount: 98,
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80",
    description:
      "A relaxing coastal resort designed for travellers looking for peaceful surroundings, comfortable rooms and a memorable Goa experience.",
    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "Beach Access",
      "Restaurant",
      "Free Parking",
      "Spa",
    ],
  },
  {
    id: "3",
    _id: "3",
    name: "Urban Nest Hotel",
    location: "Mumbai, Maharashtra",
    rating: 4.5,
    reviewsCount: 86,
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
    description:
      "A modern city hotel offering practical accommodation, comfortable rooms and easy access to Mumbai's business and entertainment areas.",
    amenities: [
      "Free Wi-Fi",
      "Restaurant",
      "Room Service",
      "Air Conditioning",
      "Parking",
      "24/7 Front Desk",
    ],
  },
  {
    id: "4",
    _id: "4",
    name: "Royal Palace",
    location: "Delhi, India",
    rating: 4.6,
    reviewsCount: 112,
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80",
    description:
      "A premium stay combining traditional elegance with modern facilities, making it suitable for business and leisure travellers.",
    amenities: [
      "Free Wi-Fi",
      "Restaurant",
      "Fitness Center",
      "Room Service",
      "Free Parking",
      "Air Conditioning",
    ],
  },
  {
    id: "5",
    _id: "5",
    name: "Lakeview Retreat",
    location: "Udaipur, Rajasthan",
    rating: 4.9,
    reviewsCount: 156,
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1400&q=80",
    description:
      "A peaceful retreat surrounded by beautiful views, comfortable rooms and relaxing facilities for a premium getaway.",
    amenities: [
      "Free Wi-Fi",
      "Lake View",
      "Swimming Pool",
      "Restaurant",
      "Spa",
      "Room Service",
    ],
  },
  {
    id: "6",
    _id: "6",
    name: "Green Valley Resort",
    location: "Lonavala, Maharashtra",
    rating: 4.4,
    reviewsCount: 74,
    price: 3600,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
    description:
      "A refreshing resort surrounded by greenery, perfect for weekend trips, family stays and relaxing vacations near Lonavala.",
    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "Restaurant",
      "Free Parking",
      "Garden",
      "Room Service",
    ],
  },
];

function HotelDetails() {
  const { hotelId } = useParams();

  const [hotel, setHotel] = useState(() => {
    return (
      fallbackHotels.find(
        (item) => item.id === hotelId || item._id === hotelId
      ) || null
    );
  });

  const [reviews, setReviews] = useState([
    {
      name: "Rahul Sharma",
      rating: 5,
      date: "September 2026",
      comment:
        "Excellent stay. The room was clean, comfortable and the staff was very helpful.",
    },
    {
      name: "Priya Patil",
      rating: 4,
      date: "August 2026",
      comment:
        "Great location and good service. Overall it was a pleasant experience.",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    guest: "",
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchHotelAndReviews = async () => {
      try {
        // Fetch hotel
        const res = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.hotel) {
            setHotel(data.hotel);

            // Fetch reviews for this hotel
            const revRes = await fetch(
              `${API_BASE_URL}/api/reviews?hotel=${encodeURIComponent(
                data.hotel.name
              )}`
            );
            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData.reviews && revData.reviews.length > 0) {
                setReviews(revData.reviews);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback hotel details:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelAndReviews();
  }, [hotelId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.guest.trim() || !newReview.comment.trim()) {
      alert("Please enter your name and comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel?._id || hotel?.id,
          hotelName: hotel?.name,
          guest: newReview.guest.trim(),
          rating: Number(newReview.rating),
          comment: newReview.comment.trim(),
        }),
      });

      if (response.ok) {
        const added = {
          name: newReview.guest.trim(),
          guest: newReview.guest.trim(),
          rating: Number(newReview.rating),
          comment: newReview.comment.trim(),
          date: "Just now",
        };
        setReviews([added, ...reviews]);
        setNewReview({ guest: "", rating: 5, comment: "" });
        setShowReviewForm(false);
        alert("Thank you! Your review has been submitted.");
      }
    } catch {
      alert("Unable to submit review right now. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!hotel && !isLoading) {
    return (
      <main className="hotel-details-page">
        <section className="hotel-not-found">
          <p className="hotel-details-label">STAYEASE</p>
          <h1>Hotel Not Found</h1>
          <p>The hotel you are looking for is not available.</p>
          <Link to="/hotels" className="hotel-back-btn">
            ← Browse Hotels
          </Link>
        </section>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="hotel-details-page">
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p>Loading hotel details...</p>
        </div>
      </main>
    );
  }

  const effectiveId = hotel._id || hotel.id || hotelId;

  return (
    <main className="hotel-details-page">
      <div className="hotel-details-container">
        <Link to="/hotels" className="hotel-details-back">
          ← Back to Hotels
        </Link>

        <section className="hotel-details-top">
          <div className="hotel-details-image">
            <img src={hotel.image} alt={hotel.name} />
          </div>

          <div className="hotel-details-summary">
            <p className="hotel-details-location">{hotel.location}</p>

            <h1>{hotel.name}</h1>

            <div className="hotel-details-rating">
              <span>★</span>
              <strong>{hotel.rating}</strong>
              <span className="hotel-review-count">
                {hotel.reviewsCount || reviews.length} reviews
              </span>
            </div>

            <p className="hotel-details-description">{hotel.description}</p>

            <div className="hotel-details-price">
              <span>Starting from</span>
              <strong>₹{hotel.price?.toLocaleString("en-IN")}</strong>
              <small> / night</small>
            </div>

            <Link
              to={`/book/${effectiveId}`}
              className="hotel-book-now-btn"
            >
              Book This Hotel
            </Link>
          </div>
        </section>

        <section className="hotel-details-section">
          <div className="hotel-section-heading">
            <p>HOTEL FACILITIES</p>
            <h2>Amenities</h2>
          </div>

          <div className="hotel-amenities">
            {(
              hotel.amenities || [
                "Free Wi-Fi",
                "Swimming Pool",
                "Restaurant",
                "Free Parking",
                "Room Service",
                "Air Conditioning",
              ]
            ).map((amenity) => (
              <div className="hotel-amenity" key={amenity}>
                <span>✓</span>
                <strong>{amenity}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="hotel-details-section">
          <div className="hotel-section-heading">
            <p>ROOM OPTIONS</p>
            <h2>Choose Your Room</h2>
          </div>

          <div className="hotel-room-options">
            <article className="hotel-room-card">
              <div>
                <span className="hotel-room-label">COMFORT</span>
                <h3>Standard Room</h3>
                <p>
                  A comfortable room with all essential facilities for a
                  pleasant stay.
                </p>
              </div>

              <div className="hotel-room-bottom">
                <strong>
                  ₹{hotel.price?.toLocaleString("en-IN")}
                  <small> / night</small>
                </strong>

                <Link
                  to={`/book/${effectiveId}?room=Standard%20Room`}
                  className="hotel-room-btn"
                >
                  Select
                </Link>
              </div>
            </article>

            <article className="hotel-room-card">
              <div>
                <span className="hotel-room-label">POPULAR</span>
                <h3>Deluxe Room</h3>
                <p>
                  More space and upgraded facilities for a comfortable premium
                  stay.
                </p>
              </div>

              <div className="hotel-room-bottom">
                <strong>
                  ₹{(hotel.price + 800)?.toLocaleString("en-IN")}
                  <small> / night</small>
                </strong>

                <Link
                  to={`/book/${effectiveId}?room=Deluxe%20Room`}
                  className="hotel-room-btn"
                >
                  Select
                </Link>
              </div>
            </article>

            <article className="hotel-room-card">
              <div>
                <span className="hotel-room-label">PREMIUM</span>
                <h3>Premium Suite</h3>
                <p>
                  Spacious accommodation with an elevated experience for special
                  stays.
                </p>
              </div>

              <div className="hotel-room-bottom">
                <strong>
                  ₹{(hotel.price + 1800)?.toLocaleString("en-IN")}
                  <small> / night</small>
                </strong>

                <Link
                  to={`/book/${effectiveId}?room=Premium%20Suite`}
                  className="hotel-room-btn"
                >
                  Select
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="hotel-details-section">
          <div
            className="hotel-section-heading"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p>GUEST EXPERIENCE</p>
              <h2>Guest Reviews</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                background: "#1f4e5f",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {showReviewForm ? "Cancel Review" : "+ Write a Review"}
            </button>
          </div>

          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                marginBottom: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3 style={{ margin: "0 0 6px 0", fontSize: "16px" }}>
                Write your review for {hotel.name}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={newReview.guest}
                    onChange={(e) =>
                      setNewReview({ ...newReview, guest: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Rating *
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        rating: Number(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value="5">★★★★★ (5 - Excellent)</option>
                    <option value="4">★★★★☆ (4 - Very Good)</option>
                    <option value="3">★★★☆☆ (3 - Average)</option>
                    <option value="2">★★☆☆☆ (2 - Poor)</option>
                    <option value="1">★☆☆☆☆ (1 - Terrible)</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  Comment *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  alignSelf: "flex-start",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          <div className="hotel-reviews-summary">
            <div className="hotel-review-score">
              <strong>{hotel.rating}</strong>
              <div>
                <span>★★★★★</span>
                <small>
                  Based on {hotel.reviewsCount || reviews.length} reviews
                </small>
              </div>
            </div>
          </div>

          <div className="hotel-review-list">
            {reviews.map((review, idx) => (
              <article
                className="hotel-review-card"
                key={review.id || `${review.guest || review.name}-${idx}`}
              >
                <div className="hotel-review-top">
                  <div>
                    <h3>{review.guest || review.name}</h3>
                    <span>{review.date}</span>
                  </div>

                  <strong>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(Math.max(0, 5 - review.rating))}
                  </strong>
                </div>

                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hotel-booking-cta">
          <div>
            <p>READY FOR YOUR STAY?</p>
            <h2>Make your next trip comfortable.</h2>
            <span>Reserve your room at {hotel.name}.</span>
          </div>

          <Link
            to={`/book/${effectiveId}`}
            className="hotel-cta-btn"
          >
            Book Now
          </Link>
        </section>
      </div>
    </main>
  );
}

export default HotelDetails;