import { Link } from "react-router";

import "./HotelCard.css";

function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">

      <div className="hotel-image-container">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="hotel-image"
        />

        <span className="hotel-rating">
          ★ {hotel.rating}
        </span>
      </div>

      <div className="hotel-card-content">

        <p className="hotel-location">
          {hotel.location}
        </p>

        <h3 className="hotel-name">
          {hotel.name}
        </h3>

        <p className="hotel-description">
          {hotel.description}
        </p>

        <div className="hotel-card-bottom">

          <div className="hotel-price">
            <strong>₹{hotel.price}</strong>
            <span>/ night</span>
          </div>

          <Link
            to={`/hotels/${hotel.id || hotel._id}`}
            className="hotel-details-btn"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}

export default HotelCard;