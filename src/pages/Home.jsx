import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Guests");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) {
      params.append("search", destination.trim());
    }
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">YOUR NEXT STAY STARTS HERE</p>

          <h1>
            Find a place where
            <br />
            you feel at home.
          </h1>

          <p className="hero-description">
            Discover comfortable hotels, compare rooms and book your perfect stay
            with ease.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-field">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Where are you going? (e.g. Pune, Goa)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5+ Guests</option>
              </select>
            </div>

            <button type="submit" className="search-btn">
              Search Hotels
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2>Popular destinations</h2>
          </div>

          <Link to="/hotels" className="view-btn">
            View all
          </Link>
        </div>

        <div className="destination-grid">
          <Link
            to="/hotels?city=Pune"
            className="destination-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="destination-image pune">
              <span>Pune</span>
            </div>
            <p>120+ properties</p>
          </Link>

          <Link
            to="/hotels?city=Mumbai"
            className="destination-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="destination-image mumbai">
              <span>Mumbai</span>
            </div>
            <p>250+ properties</p>
          </Link>

          <Link
            to="/hotels?city=Goa"
            className="destination-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="destination-image goa">
              <span>Goa</span>
            </div>
            <p>180+ properties</p>
          </Link>

          <Link
            to="/hotels?city=Delhi"
            className="destination-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="destination-image delhi">
              <span>Delhi</span>
            </div>
            <p>220+ properties</p>
          </Link>
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <p className="section-label">OUR PICKS</p>
            <h2>Featured stays</h2>
          </div>

          <Link to="/hotels" className="view-btn">
            Explore hotels
          </Link>
        </div>

        <div className="hotel-grid">
          <Link
            to="/hotels"
            className="hotel-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="hotel-image hotel-one">
              <span className="hotel-badge">Popular</span>
            </div>

            <div className="hotel-info">
              <div className="hotel-location">Pune, Maharashtra</div>

              <h3>The Grand Heritage</h3>

              <p className="hotel-description">
                Comfortable rooms with modern amenities and a relaxing
                atmosphere.
              </p>

              <div className="hotel-bottom">
                <span className="rating">★ 4.8</span>

                <span className="price">
                  ₹3,200 <small>/ night</small>
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/hotels"
            className="hotel-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="hotel-image hotel-two">
              <span className="hotel-badge">Top Rated</span>
            </div>

            <div className="hotel-info">
              <div className="hotel-location">Goa, India</div>

              <h3>Coastal Breeze Resort</h3>

              <p className="hotel-description">
                A peaceful resort experience near the beach with premium
                facilities.
              </p>

              <div className="hotel-bottom">
                <span className="rating">★ 4.9</span>

                <span className="price">
                  ₹4,500 <small>/ night</small>
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/hotels"
            className="hotel-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="hotel-image hotel-three">
              <span className="hotel-badge">Best Value</span>
            </div>

            <div className="hotel-info">
              <div className="hotel-location">Mumbai, Maharashtra</div>

              <h3>Urban Nest Hotel</h3>

              <p className="hotel-description">
                Stylish rooms designed for business and leisure travelers.
              </p>

              <div className="hotel-bottom">
                <span className="rating">★ 4.7</span>

                <span className="price">
                  ₹2,800 <small>/ night</small>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="why-section">
        <div className="why-content">
          <div className="why-heading">
            <p className="section-label">WHY STAYEASE</p>

            <h2>
              Everything you need
              <br />
              for a better stay.
            </h2>

            <p>
              We make finding and booking your next hotel simple, transparent and
              convenient.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Verified stays</h3>
              <p>
                Browse properties with reliable information and genuine guest
                reviews.
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon">₹</div>
              <h3>Fair prices</h3>
              <p>
                Compare rooms and choose accommodation that fits your budget.
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon">↻</div>
              <h3>Easy booking</h3>
              <p>
                Simple booking and cancellation management from one place.
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon">24</div>
              <h3>Always available</h3>
              <p>
                Access your bookings and hotel information whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="section-label">READY TO TRAVEL?</p>

          <h2>
            Your perfect stay
            <br />
            is just a search away.
          </h2>

          <Link to="/hotels" className="cta-btn">
            Explore Hotels
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;