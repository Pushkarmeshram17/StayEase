import { useState, useEffect } from "react";
import { Link } from "react-router";
import API_BASE_URL from "../api";

import "./AdminReviews.css";

function AdminReviews() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      guest: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      hotel: "The Grand Heritage",
      rating: 5,
      title: "Excellent stay and service",
      comment:
        "The room was clean, spacious and comfortable. The staff was very helpful and the overall experience was excellent.",
      date: "26 Sep 2026",
      status: "Published",
    },
    {
      id: 2,
      guest: "Priya Patil",
      email: "priya.patil@email.com",
      hotel: "Coastal Breeze Resort",
      rating: 4,
      title: "Beautiful location",
      comment:
        "The resort has a beautiful location and good facilities. Food was also nice, although service could be slightly faster.",
      date: "30 Sep 2026",
      status: "Published",
    },
    {
      id: 3,
      guest: "Amit Verma",
      email: "amit.verma@email.com",
      hotel: "Urban Nest Hotel",
      rating: 3,
      title: "Good but needs improvement",
      comment:
        "The hotel was decent for the price, but the room maintenance and check-in experience could be improved.",
      date: "04 Oct 2026",
      status: "Pending",
    },
    {
      id: 4,
      guest: "Sneha Kulkarni",
      email: "sneha.kulkarni@email.com",
      hotel: "Royal Palace",
      rating: 5,
      title: "Wonderful experience",
      comment:
        "Everything was well managed. The room was comfortable and the hotel staff was very professional.",
      date: "08 Oct 2026",
      status: "Published",
    },
    {
      id: 5,
      guest: "Vikram Joshi",
      email: "vikram.joshi@email.com",
      hotel: "Lakeview Retreat",
      rating: 2,
      title: "Not as expected",
      comment:
        "The location was nice, but the room did not match the expectations and some facilities were unavailable.",
      date: "12 Oct 2026",
      status: "Hidden",
    },
    {
      id: 6,
      guest: "Neha Deshmukh",
      email: "neha.deshmukh@email.com",
      hotel: "Green Valley Resort",
      rating: 4,
      title: "Peaceful resort",
      comment:
        "A peaceful place for a short trip. Rooms were comfortable and the staff was friendly.",
      date: "17 Oct 2026",
      status: "Published",
    },
  ]);

  const ratingFilters = [
    "All Ratings",
    "5 Stars",
    "4 Stars",
    "3 Stars",
    "2 Stars",
    "1 Star",
  ];

  const statusFilters = [
    "All Status",
    "Published",
    "Pending",
    "Hidden",
  ];

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] =
    useState("All Ratings");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [selectedReview, setSelectedReview] =
    useState(null);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    guest: "",
    email: "",
    hotel: "",
    rating: "5",
    title: "",
    comment: "",
    status: "Pending",
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const searchValue = search.toLowerCase();

    const searchMatch =
      review.guest.toLowerCase().includes(searchValue) ||
      review.email.toLowerCase().includes(searchValue) ||
      review.hotel.toLowerCase().includes(searchValue) ||
      review.title.toLowerCase().includes(searchValue) ||
      review.comment.toLowerCase().includes(searchValue);

    const ratingMatch =
      ratingFilter === "All Ratings" ||
      review.rating ===
        Number(ratingFilter.charAt(0));

    const statusMatch =
      statusFilter === "All Status" ||
      review.status === statusFilter;

    return searchMatch && ratingMatch && statusMatch;
  });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddReview = (event) => {
    event.preventDefault();

    if (
      !formData.guest ||
      !formData.email ||
      !formData.hotel ||
      !formData.title ||
      !formData.comment
    ) {
      alert("Please fill all required review details.");
      return;
    }

    const newReview = {
      id: Date.now(),
      guest: formData.guest,
      email: formData.email,
      hotel: formData.hotel,
      rating: Number(formData.rating),
      title: formData.title,
      comment: formData.comment,
      date: "Today",
      status: formData.status,
    };

    setReviews((previous) => [
      newReview,
      ...previous,
    ]);

    setFormData({
      guest: "",
      email: "",
      hotel: "",
      rating: "5",
      title: "",
      comment: "",
      status: "Pending",
    });

    setShowForm(false);

    alert("Review added successfully!");
  };

  const handleStatusChange = (id, newStatus) => {
    setReviews((previous) =>
      previous.map((review) =>
        review.id === id
          ? {
              ...review,
              status: newStatus,
            }
          : review
      )
    );

    setSelectedReview((previous) => {
      if (!previous || previous.id !== id) {
        return previous;
      }

      return {
        ...previous,
        status: newStatus,
      };
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    setReviews((previous) =>
      previous.filter((review) => review.id !== id)
    );

    setSelectedReview(null);
  };

  const handleView = (review) => {
    setSelectedReview(review);
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <main className="admin-reviews-page">
      <section className="admin-reviews-header">
        <div>
          <p className="admin-reviews-label">
            REVIEW MANAGEMENT
          </p>

          <h1>Reviews</h1>

          <p>
            Review and manage customer feedback across
            StayEase hotels.
          </p>
        </div>

        <Link
          to="/admin"
          className="admin-reviews-back-btn"
        >
          ← Dashboard
        </Link>
      </section>

      <section className="admin-review-summary">
        <div>
          <span>Total Reviews</span>
          <strong>{reviews.length}</strong>
        </div>

        <div>
          <span>Published</span>
          <strong>
            {
              reviews.filter(
                (review) =>
                  review.status === "Published"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {
              reviews.filter(
                (review) =>
                  review.status === "Pending"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Hidden</span>
          <strong>
            {
              reviews.filter(
                (review) =>
                  review.status === "Hidden"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Average Rating</span>
          <strong>★ {averageRating}</strong>
        </div>
      </section>

      <section className="admin-reviews-toolbar">
        <div className="admin-review-search">
          <input
            type="text"
            placeholder="Search guest, hotel or review..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={ratingFilter}
          onChange={(event) =>
            setRatingFilter(event.target.value)
          }
        >
          {ratingFilters.map((rating) => (
            <option value={rating} key={rating}>
              {rating}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          {statusFilters.map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="admin-add-review-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Review
        </button>
      </section>

      <div className="admin-review-result">
        Showing <strong>{filteredReviews.length}</strong>{" "}
        of <strong>{reviews.length}</strong> reviews
      </div>

      <section className="admin-review-table-card">
        <div className="admin-review-table-wrapper">
          <table className="admin-review-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Hotel</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <div className="admin-review-guest">
                        <div className="admin-review-avatar">
                          {review.guest
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {review.guest}
                          </strong>

                          <span>
                            {review.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong className="admin-review-hotel">
                        {review.hotel}
                      </strong>
                    </td>

                    <td>
                      <span className="admin-review-stars">
                        {renderStars(review.rating)}
                      </span>

                      <small>
                        {review.rating}/5
                      </small>
                    </td>

                    <td>
                      <div className="admin-review-content">
                        <strong>
                          {review.title}
                        </strong>

                        <span>
                          {review.comment}
                        </span>
                      </div>
                    </td>

                    <td>{review.date}</td>

                    <td>
                      <span
                        className={`admin-review-status ${review.status.toLowerCase()}`}
                      >
                        {review.status}
                      </span>
                    </td>

                    <td>
                      <div className="admin-review-actions">
                        <button
                          type="button"
                          className="admin-review-view"
                          onClick={() =>
                            handleView(review)
                          }
                        >
                          View
                        </button>

                        {review.status !==
                          "Published" && (
                          <button
                            type="button"
                            className="admin-review-publish"
                            onClick={() =>
                              handleStatusChange(
                                review.id,
                                "Published"
                              )
                            }
                          >
                            Publish
                          </button>
                        )}

                        {review.status ===
                          "Published" && (
                          <button
                            type="button"
                            className="admin-review-hide"
                            onClick={() =>
                              handleStatusChange(
                                review.id,
                                "Hidden"
                              )
                            }
                          >
                            Hide
                          </button>
                        )}

                        <button
                          type="button"
                          className="admin-review-delete"
                          onClick={() =>
                            handleDelete(review.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="admin-review-empty"
                  >
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedReview && (
        <div
          className="admin-review-modal-overlay"
          onClick={() => setSelectedReview(null)}
        >
          <section
            className="admin-review-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-review-modal-heading">
              <div>
                <p>REVIEW DETAILS</p>
                <h2>{selectedReview.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-review-detail-profile">
              <div className="admin-review-large-avatar">
                {selectedReview.guest
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h3>{selectedReview.guest}</h3>

                <p>{selectedReview.email}</p>

                <strong>
                  {selectedReview.hotel}
                </strong>
              </div>
            </div>

            <div className="admin-review-detail-rating">
              <span>
                {renderStars(selectedReview.rating)}
              </span>

              <strong>
                {selectedReview.rating}/5
              </strong>
            </div>

            <div className="admin-review-full-content">
              <span>Customer Review</span>

              <h3>{selectedReview.title}</h3>

              <p>{selectedReview.comment}</p>
            </div>

            <div className="admin-review-detail-info">
              <div>
                <span>Date</span>
                <strong>
                  {selectedReview.date}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedReview.status}
                </strong>
              </div>
            </div>

            <div className="admin-review-modal-actions">
              {selectedReview.status !==
                "Published" && (
                <button
                  type="button"
                  className="admin-review-modal-publish"
                  onClick={() =>
                    handleStatusChange(
                      selectedReview.id,
                      "Published"
                    )
                  }
                >
                  Publish Review
                </button>
              )}

              {selectedReview.status ===
                "Published" && (
                <button
                  type="button"
                  className="admin-review-modal-hide"
                  onClick={() =>
                    handleStatusChange(
                      selectedReview.id,
                      "Hidden"
                    )
                  }
                >
                  Hide Review
                </button>
              )}

              <button
                type="button"
                className="admin-review-modal-delete"
                onClick={() =>
                  handleDelete(selectedReview.id)
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="admin-review-modal-close"
                onClick={() =>
                  setSelectedReview(null)
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
          className="admin-review-modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <section
            className="admin-review-modal admin-add-review-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-review-modal-heading">
              <div>
                <p>REVIEW MANAGEMENT</p>
                <h2>Add New Review</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddReview}>
              <div className="admin-review-form-grid">
                <div className="admin-review-field">
                  <label>Guest Name *</label>

                  <input
                    type="text"
                    name="guest"
                    placeholder="Enter guest name"
                    value={formData.guest}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-review-field">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="guest@email.com"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-review-field">
                  <label>Hotel *</label>

                  <input
                    type="text"
                    name="hotel"
                    placeholder="Enter hotel name"
                    value={formData.hotel}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-review-field">
                  <label>Rating</label>

                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleFormChange}
                  >
                    <option value="5">
                      5 Stars
                    </option>

                    <option value="4">
                      4 Stars
                    </option>

                    <option value="3">
                      3 Stars
                    </option>

                    <option value="2">
                      2 Stars
                    </option>

                    <option value="1">
                      1 Star
                    </option>
                  </select>
                </div>
              </div>

              <div className="admin-review-field">
                <label>Review Title *</label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter review title"
                  value={formData.title}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-review-field">
                <label>Review *</label>

                <textarea
                  name="comment"
                  placeholder="Write customer review..."
                  value={formData.comment}
                  onChange={handleFormChange}
                  rows="5"
                />
              </div>

              <div className="admin-review-field">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Published">
                    Published
                  </option>

                  <option value="Hidden">
                    Hidden
                  </option>
                </select>
              </div>

              <div className="admin-review-modal-actions">
                <button
                  type="button"
                  className="admin-review-modal-close"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-review-modal-submit"
                >
                  Add Review
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdminReviews;