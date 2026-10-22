import { useState, useEffect } from "react";
import { Link } from "react-router";
import API_BASE_URL from "../api";

import "./AdminHotels.css";

const fallbackHotels = [
  {
    id: "1",
    _id: "1",
    name: "The Grand Heritage",
    location: "Pune, Maharashtra",
    rooms: 32,
    roomsCount: 32,
    rating: 4.8,
    price: 3200,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    _id: "2",
    name: "Coastal Breeze Resort",
    location: "Goa",
    rooms: 45,
    roomsCount: 45,
    rating: 4.7,
    price: 4500,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    _id: "3",
    name: "Urban Nest Hotel",
    location: "Mumbai, Maharashtra",
    rooms: 28,
    roomsCount: 28,
    rating: 4.5,
    price: 2800,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    _id: "4",
    name: "Royal Palace",
    location: "Delhi",
    rooms: 38,
    roomsCount: 38,
    rating: 4.6,
    price: 3800,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    _id: "5",
    name: "Lakeview Retreat",
    location: "Udaipur, Rajasthan",
    rooms: 24,
    roomsCount: 24,
    rating: 4.9,
    price: 5200,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    _id: "6",
    name: "Green Valley Resort",
    location: "Lonavala, Maharashtra",
    rooms: 19,
    roomsCount: 19,
    rating: 4.4,
    price: 3600,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80",
  },
];

function AdminHotels() {
  const [hotels, setHotels] = useState(fallbackHotels);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rooms: "",
    price: "",
    rating: "",
    status: "Active",
    image: "",
  });

  const cities = [
    "All",
    "Pune",
    "Goa",
    "Mumbai",
    "Delhi",
    "Udaipur",
    "Lonavala",
  ];

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hotels`);
        if (response.ok && active) {
          const data = await response.json();
          if (data.hotels && data.hotels.length > 0) {
            setHotels(
              data.hotels.map((h) => ({
                ...h,
                id: h._id || h.id,
                rooms: h.roomsCount || h.rooms || 20,
              }))
            );
          }
        }
      } catch {
        // Fallback
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const searchMatch =
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase());

    const cityMatch =
      cityFilter === "All" ||
      hotel.location.toLowerCase().includes(cityFilter.toLowerCase());

    const statusMatch =
      statusFilter === "All" || hotel.status === statusFilter;

    return searchMatch && cityMatch && statusMatch;
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddHotel = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.location ||
      !formData.rooms ||
      !formData.price
    ) {
      alert("Please fill all required hotel details.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          location: formData.location.trim(),
          roomsCount: Number(formData.rooms),
          price: Number(formData.price),
          rating: Number(formData.rating) || 4.5,
          status: formData.status,
          image:
            formData.image ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const created = data.hotel;
        setHotels((previous) => [
          {
            ...created,
            id: created._id || created.id,
            rooms: created.roomsCount || Number(formData.rooms),
          },
          ...previous,
        ]);
        alert("Hotel added successfully to database!");
      } else {
        alert("Unable to save hotel to server.");
      }
    } catch {
      // Offline fallback
      const newHotel = {
        id: Date.now(),
        name: formData.name,
        location: formData.location,
        rooms: Number(formData.rooms),
        rating: Number(formData.rating) || 0,
        price: Number(formData.price),
        status: formData.status,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      };
      setHotels((previous) => [newHotel, ...previous]);
    }

    setFormData({
      name: "",
      location: "",
      rooms: "",
      price: "",
      rating: "",
      status: "Active",
      image: "",
    });

    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hotel?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/api/hotels/${id}`, { method: "DELETE" });
    } catch {
      // Ignore
    }

    setHotels((previous) =>
      previous.filter((hotel) => (hotel._id || hotel.id) !== id)
    );
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      await fetch(`${API_BASE_URL}/api/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Ignore
    }

    setHotels((previous) =>
      previous.map((hotel) =>
        (hotel._id || hotel.id) === id
          ? { ...hotel, status: newStatus }
          : hotel
      )
    );
  };

  return (
    <main className="admin-hotels-page">
      <section className="admin-hotels-header">
        <div>
          <p className="admin-hotels-label">HOTEL MANAGEMENT</p>

          <h1>Hotels</h1>

          <p>
            Manage and monitor listed properties on the StayEase platform.
          </p>
        </div>

        <button
          type="button"
          className="admin-hotels-add-btn"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? "Close Form" : "+ Add New Hotel"}
        </button>
      </section>

      {showForm && (
        <section className="admin-hotel-form-card">
          <div className="admin-hotel-form-heading">
            <h2>Add New Hotel</h2>
            <p>Enter the property information below to add it to StayEase.</p>
          </div>

          <form onSubmit={handleAddHotel}>
            <div className="admin-hotel-form-grid">
              <div className="admin-hotel-field">
                <label>Hotel Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. The Grand Heritage"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-hotel-field">
                <label>Location *</label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Pune, Maharashtra"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-hotel-field">
                <label>Total Rooms *</label>

                <input
                  type="number"
                  name="rooms"
                  placeholder="e.g. 30"
                  value={formData.rooms}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-hotel-field">
                <label>Starting Price (₹) *</label>

                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 3200"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-hotel-field">
                <label>Rating</label>

                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  name="rating"
                  placeholder="e.g. 4.8"
                  value={formData.rating}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-hotel-field">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="admin-hotel-field full-width">
                <label>Image URL</label>

                <input
                  type="text"
                  name="image"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="admin-hotel-form-actions">
              <button
                type="button"
                className="admin-hotel-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="admin-hotel-submit-btn">
                Save Hotel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-hotel-filters">
        <div className="admin-hotel-search">
          <input
            type="text"
            placeholder="Search hotel by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-hotel-select-filters">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {cities.map((city) => (
              <option value={city} key={city}>
                {city === "All" ? "All Locations" : city}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </section>

      <section className="admin-hotels-table-card">
        <div className="admin-table-heading">
          <h2>All Listed Hotels ({filteredHotels.length})</h2>

          <p>
            Showing registered properties and current operational status.
          </p>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-hotels-table">
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Location</th>
                <th>Rooms</th>
                <th>Price / Night</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredHotels.map((hotel) => {
                const hId = hotel._id || hotel.id;
                return (
                  <tr key={hId}>
                    <td>
                      <div className="admin-hotel-cell">
                        <img src={hotel.image} alt={hotel.name} />
                        <div>
                          <strong>{hotel.name}</strong>
                          <Link
                            to={`/hotels/${hId}`}
                            className="admin-hotel-preview"
                            target="_blank"
                          >
                            View Page ↗
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td>{hotel.location}</td>
                    <td>{hotel.rooms || hotel.roomsCount || 20}</td>
                    <td>₹{hotel.price?.toLocaleString("en-IN")}</td>
                    <td>★ {hotel.rating}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(hId, hotel.status)}
                        className={`admin-status-badge ${hotel.status.toLowerCase()}`}
                        title="Click to toggle status"
                        style={{ border: "none", cursor: "pointer" }}
                      >
                        {hotel.status}
                      </button>
                    </td>

                    <td>
                      <div className="admin-row-actions">
                        <Link
                          to={`/hotels/${hId}`}
                          className="admin-view-btn"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDelete(hId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminHotels;