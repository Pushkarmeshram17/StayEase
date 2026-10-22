import { useState, useEffect } from "react";
import API_BASE_URL from "../api";

import "./AdminRooms.css";

const fallbackRooms = [
  {
    id: "1",
    _id: "1",
    roomNumber: "101",
    hotel: "The Grand Heritage",
    type: "Standard Room",
    capacity: 2,
    price: 3200,
    amenities: "Wi-Fi, TV, AC",
    status: "Available",
  },
  {
    id: "2",
    _id: "2",
    roomNumber: "102",
    hotel: "The Grand Heritage",
    type: "Deluxe Room",
    capacity: 3,
    price: 4000,
    amenities: "Wi-Fi, TV, AC, Balcony",
    status: "Occupied",
  },
  {
    id: "3",
    _id: "3",
    roomNumber: "103",
    hotel: "The Grand Heritage",
    type: "Premium Suite",
    capacity: 4,
    price: 5000,
    amenities: "Wi-Fi, TV, AC, Mini Bar",
    status: "Available",
  },
  {
    id: "4",
    _id: "4",
    roomNumber: "201",
    hotel: "Coastal Breeze Resort",
    type: "Standard Room",
    capacity: 2,
    price: 4500,
    amenities: "Wi-Fi, TV, AC",
    status: "Available",
  },
  {
    id: "5",
    _id: "5",
    roomNumber: "202",
    hotel: "Coastal Breeze Resort",
    type: "Deluxe Room",
    capacity: 3,
    price: 5300,
    amenities: "Wi-Fi, TV, AC, Balcony",
    status: "Maintenance",
  },
  {
    id: "6",
    _id: "6",
    roomNumber: "301",
    hotel: "Urban Nest Hotel",
    type: "Standard Room",
    capacity: 2,
    price: 2800,
    amenities: "Wi-Fi, TV, AC",
    status: "Available",
  },
];

function AdminRooms() {
  const [rooms, setRooms] = useState(fallbackRooms);
  const hotelOptions = [
    "All Hotels",
    "The Grand Heritage",
    "Coastal Breeze Resort",
    "Urban Nest Hotel",
    "Royal Palace",
    "Lakeview Retreat",
    "Green Valley Resort",
  ];

  const roomTypes = [
    "All Types",
    "Standard Room",
    "Deluxe Room",
    "Premium Suite",
  ];

  const roomStatuses = [
    "All Status",
    "Available",
    "Occupied",
    "Maintenance",
  ];

  const [search, setSearch] = useState("");
  const [hotelFilter, setHotelFilter] = useState("All Hotels");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    roomNumber: "",
    hotel: "The Grand Heritage",
    type: "Standard Room",
    capacity: "2",
    price: "",
    amenities: "Wi-Fi, TV, AC",
    status: "Available",
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/rooms`);
        if (res.ok && active) {
          const data = await res.json();
          if (data.rooms && data.rooms.length > 0) {
            setRooms(
              data.rooms.map((r) => ({
                ...r,
                id: r._id || r.id,
                hotel: r.hotelName || r.hotel,
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

  const filteredRooms = rooms.filter((room) => {
    const searchMatch =
      room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      (room.hotel || "").toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase());

    const hotelMatch =
      hotelFilter === "All Hotels" || room.hotel === hotelFilter;

    const typeMatch =
      typeFilter === "All Types" || room.type === typeFilter;

    const statusMatch =
      statusFilter === "All Status" || room.status === statusFilter;

    return searchMatch && hotelMatch && typeMatch && statusMatch;
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddRoom = async (event) => {
    event.preventDefault();

    if (!formData.roomNumber || !formData.hotel || !formData.price) {
      alert("Please fill all required room details.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: formData.roomNumber.trim(),
          hotel: formData.hotel,
          type: formData.type,
          capacity: Number(formData.capacity) || 2,
          price: Number(formData.price),
          amenities: formData.amenities || "Wi-Fi, TV, AC",
          status: formData.status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const created = data.room;
        setRooms((previous) => [
          {
            ...created,
            id: created._id || created.id,
            hotel: created.hotelName || created.hotel,
          },
          ...previous,
        ]);
        alert("Room added successfully!");
      }
    } catch {
      const newRoom = {
        id: Date.now(),
        roomNumber: formData.roomNumber,
        hotel: formData.hotel,
        type: formData.type,
        capacity: Number(formData.capacity) || 2,
        price: Number(formData.price),
        amenities: formData.amenities || "Wi-Fi, TV, AC",
        status: formData.status,
      };
      setRooms((previous) => [newRoom, ...previous]);
    }

    setFormData({
      roomNumber: "",
      hotel: "The Grand Heritage",
      type: "Standard Room",
      capacity: "2",
      price: "",
      amenities: "Wi-Fi, TV, AC",
      status: "Available",
    });

    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/api/rooms/${id}`, { method: "DELETE" });
    } catch {
      // Ignore
    }

    setRooms((previous) =>
      previous.filter((room) => (room._id || room.id) !== id)
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Ignore
    }

    setRooms((previous) =>
      previous.map((room) =>
        (room._id || room.id) === id
          ? { ...room, status: newStatus }
          : room
      )
    );
  };

  return (
    <main className="admin-rooms-page">
      <section className="admin-rooms-header">
        <div>
          <p className="admin-rooms-label">ROOM MANAGEMENT</p>

          <h1>Rooms</h1>

          <p>
            Configure room types, pricing, capacity and track real-time
            occupancy.
          </p>
        </div>

        <button
          type="button"
          className="admin-rooms-add-btn"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? "Close Form" : "+ Add New Room"}
        </button>
      </section>

      {showForm && (
        <section className="admin-room-form-card">
          <div className="admin-room-form-heading">
            <h2>Add New Room</h2>
            <p>
              Assign room numbers to hotels and define capacity and pricing.
            </p>
          </div>

          <form onSubmit={handleAddRoom}>
            <div className="admin-room-form-grid">
              <div className="admin-room-field">
                <label>Room Number *</label>

                <input
                  type="text"
                  name="roomNumber"
                  placeholder="e.g. 101"
                  value={formData.roomNumber}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-room-field">
                <label>Hotel *</label>

                <select
                  name="hotel"
                  value={formData.hotel}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Hotel</option>
                  {hotelOptions
                    .filter((h) => h !== "All Hotels")
                    .map((hotel) => (
                      <option value={hotel} key={hotel}>
                        {hotel}
                      </option>
                    ))}
                </select>
              </div>

              <div className="admin-room-field">
                <label>Room Type</label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  <option value="Standard Room">Standard Room</option>
                  <option value="Deluxe Room">Deluxe Room</option>
                  <option value="Premium Suite">Premium Suite</option>
                </select>
              </div>

              <div className="admin-room-field">
                <label>Guest Capacity</label>

                <select
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4">4 Persons</option>
                  <option value="5">5+ Persons</option>
                </select>
              </div>

              <div className="admin-room-field">
                <label>Price / Night (₹) *</label>

                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 3500"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-room-field">
                <label>Initial Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="admin-room-field full-width">
                <label>Room Amenities</label>

                <input
                  type="text"
                  name="amenities"
                  placeholder="e.g. Wi-Fi, TV, AC, Balcony"
                  value={formData.amenities}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="admin-room-form-actions">
              <button
                type="button"
                className="admin-room-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="admin-room-submit-btn">
                Save Room
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-room-filters">
        <div className="admin-room-search">
          <input
            type="text"
            placeholder="Search by room #, hotel, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-room-select-filters">
          <select
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          >
            {hotelOptions.map((hotel) => (
              <option value={hotel} key={hotel}>
                {hotel}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {roomTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {roomStatuses.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="admin-rooms-table-card">
        <div className="admin-table-heading">
          <h2>All Configured Rooms ({filteredRooms.length})</h2>

          <p>
            Monitor live room readiness, maintenance schedules and occupancy.
          </p>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-rooms-table">
            <thead>
              <tr>
                <th>Room #</th>
                <th>Hotel</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price / Night</th>
                <th>Amenities</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => {
                const rId = room._id || room.id;
                return (
                  <tr key={rId}>
                    <td>
                      <strong>#{room.roomNumber}</strong>
                    </td>

                    <td>{room.hotel}</td>
                    <td>{room.type}</td>
                    <td>{room.capacity} Guests</td>
                    <td>₹{room.price?.toLocaleString("en-IN")}</td>
                    <td>{room.amenities}</td>

                    <td>
                      <select
                        className={`admin-room-status-select ${room.status.toLowerCase()}`}
                        value={room.status}
                        onChange={(e) =>
                          handleStatusChange(rId, e.target.value)
                        }
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>

                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDelete(rId)}
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

export default AdminRooms;