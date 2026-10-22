import { useState, useEffect } from "react";
import { Link } from "react-router";
import API_BASE_URL from "../api";

import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      joined: "12 Aug 2026",
      bookings: 4,
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Patil",
      email: "priya.patil@email.com",
      phone: "+91 98234 56781",
      joined: "18 Aug 2026",
      bookings: 3,
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Verma",
      email: "amit.verma@email.com",
      phone: "+91 97654 32109",
      joined: "24 Aug 2026",
      bookings: 2,
      status: "Active",
    },
    {
      id: 4,
      name: "Sneha Kulkarni",
      email: "sneha.kulkarni@email.com",
      phone: "+91 98987 65432",
      joined: "02 Sep 2026",
      bookings: 5,
      status: "Active",
    },
    {
      id: 5,
      name: "Vikram Joshi",
      email: "vikram.joshi@email.com",
      phone: "+91 96543 21098",
      joined: "07 Sep 2026",
      bookings: 1,
      status: "Inactive",
    },
    {
      id: 6,
      name: "Neha Deshmukh",
      email: "neha.deshmukh@email.com",
      phone: "+91 98123 45670",
      joined: "12 Sep 2026",
      bookings: 6,
      status: "Active",
    },
    {
      id: 7,
      name: "Karan Mehta",
      email: "karan.mehta@email.com",
      phone: "+91 97345 67812",
      joined: "16 Sep 2026",
      bookings: 0,
      status: "Active",
    },
    {
      id: 8,
      name: "Anjali Shah",
      email: "anjali.shah@email.com",
      phone: "+91 98712 34567",
      joined: "20 Sep 2026",
      bookings: 2,
      status: "Inactive",
    },
  ]);

  const userStatuses = [
    "All Status",
    "Active",
    "Inactive",
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users`);
        if (res.ok) {
          const data = await res.json();
          if (data.users && data.users.length > 0) {
            setUsers(data.users);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const searchMatch =
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue) ||
      user.phone.toLowerCase().includes(searchValue);

    const statusMatch =
      statusFilter === "All Status" ||
      user.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddUser = (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone
    ) {
      alert("Please fill all required user details.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      joined: "Today",
      bookings: 0,
      status: formData.status,
    };

    setUsers((previous) => [newUser, ...previous]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "Active",
    });

    setShowForm(false);

    alert("User added successfully!");
  };

  const handleToggleStatus = (id) => {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );

    setSelectedUser((previous) => {
      if (!previous || previous.id !== id) {
        return previous;
      }

      return {
        ...previous,
        status:
          previous.status === "Active"
            ? "Inactive"
            : "Active",
      };
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setUsers((previous) =>
      previous.filter((user) => user.id !== id)
    );

    setSelectedUser(null);
  };

  const handleView = (user) => {
    setSelectedUser(user);
  };

  return (
    <main className="admin-users-page">
      <section className="admin-users-header">
        <div>
          <p className="admin-users-label">
            USER MANAGEMENT
          </p>

          <h1>Users</h1>

          <p>
            Manage registered customers and their account
            activity across StayEase.
          </p>
        </div>

        <Link
          to="/admin"
          className="admin-users-back-btn"
        >
          ← Dashboard
        </Link>
      </section>

      <section className="admin-user-summary">
        <div>
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div>
          <span>Active Users</span>
          <strong>
            {
              users.filter(
                (user) => user.status === "Active"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Inactive Users</span>
          <strong>
            {
              users.filter(
                (user) => user.status === "Inactive"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Total Bookings</span>
          <strong>
            {users.reduce(
              (total, user) =>
                total + user.bookings,
              0
            )}
          </strong>
        </div>
      </section>

      <section className="admin-users-toolbar">
        <div className="admin-user-search">
          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          {userStatuses.map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="admin-add-user-btn"
          onClick={() => setShowForm(true)}
        >
          + Add User
        </button>
      </section>

      <div className="admin-user-result">
        Showing <strong>{filteredUsers.length}</strong>{" "}
        of <strong>{users.length}</strong> users
      </div>

      <section className="admin-user-table-card">
        <div className="admin-user-table-wrapper">
          <table className="admin-user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Bookings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-profile">
                        <div className="admin-user-avatar">
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{user.phone}</td>

                    <td>{user.joined}</td>

                    <td>
                      <strong className="admin-user-bookings">
                        {user.bookings}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`admin-user-status ${user.status.toLowerCase()}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <div className="admin-user-actions">
                        <button
                          type="button"
                          className="admin-user-view"
                          onClick={() =>
                            handleView(user)
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="admin-user-toggle"
                          onClick={() =>
                            handleToggleStatus(
                              user.id
                            )
                          }
                        >
                          {user.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          type="button"
                          className="admin-user-delete"
                          onClick={() =>
                            handleDelete(user.id)
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
                    colSpan="6"
                    className="admin-user-empty"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <div
          className="admin-user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <section
            className="admin-user-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-user-modal-heading">
              <div>
                <p>USER DETAILS</p>
                <h2>{selectedUser.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-user-detail-profile">
              <div className="admin-user-large-avatar">
                {selectedUser.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>

                <span
                  className={`admin-user-status ${selectedUser.status.toLowerCase()}`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="admin-user-detail-grid">
              <div>
                <span>Phone</span>
                <strong>
                  {selectedUser.phone}
                </strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {selectedUser.joined}
                </strong>
              </div>

              <div>
                <span>Total Bookings</span>
                <strong>
                  {selectedUser.bookings}
                </strong>
              </div>

              <div>
                <span>Account Status</span>
                <strong>
                  {selectedUser.status}
                </strong>
              </div>
            </div>

            <div className="admin-user-modal-actions">
              <button
                type="button"
                className="admin-user-modal-toggle"
                onClick={() =>
                  handleToggleStatus(
                    selectedUser.id
                  )
                }
              >
                {selectedUser.status === "Active"
                  ? "Deactivate User"
                  : "Activate User"}
              </button>

              <button
                type="button"
                className="admin-user-modal-delete"
                onClick={() =>
                  handleDelete(selectedUser.id)
                }
              >
                Delete User
              </button>

              <button
                type="button"
                className="admin-user-modal-close"
                onClick={() =>
                  setSelectedUser(null)
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
          className="admin-user-modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <section
            className="admin-user-modal admin-add-user-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-user-modal-heading">
              <div>
                <p>USER MANAGEMENT</p>
                <h2>Add New User</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="admin-user-field">
                <label>Full Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-user-field">
                <label>Email Address *</label>

                <input
                  type="email"
                  name="email"
                  placeholder="user@email.com"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-user-field">
                <label>Phone Number *</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-user-field">
                <label>Account Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="admin-user-modal-actions">
                <button
                  type="button"
                  className="admin-user-modal-close"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-user-modal-submit"
                >
                  Add User
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdminUsers;