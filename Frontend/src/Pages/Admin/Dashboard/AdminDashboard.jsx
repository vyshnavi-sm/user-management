// src/pages/AdminDashboard/AdminDashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";
import { logout } from "../../../features/auth/authSlice";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");

      setUsers(res.data);

      localStorage.setItem("users_cache", JSON.stringify(res.data));
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedUsers = localStorage.getItem("users_cache");

    if (cachedUsers) {
      setUsers(JSON.parse(cachedUsers));
      setLoading(false);
    }

    fetchUsers();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosInstance.delete(`/users/${id}`);

      // optimistic update
      const updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
      localStorage.setItem("users_cache", JSON.stringify(updatedUsers));

    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ================= EDIT USER =================
  const startEdit = (user) => {
    setEditingUser(user._id);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(`/users/${editingUser}`, formData);

      const updatedUsers = users.map((user) =>
        user._id === editingUser ? { ...user, ...formData } : user
      );

      setUsers(updatedUsers);
      localStorage.setItem("users_cache", JSON.stringify(updatedUsers));

      cancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // ================= FILTER USERS =================
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.role && u.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="admin-wrapper">

      {/* ================= HEADER ================= */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>

        <div className="admin-header-right">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ================= TABLE ================= */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
              </tr>
            ))
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="4" className="loading-text">
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= EDIT MODAL ================= */}
      {editingUser && (
        <div className="edit-modal">
          <form onSubmit={saveEdit}>
            <h3>Edit User</h3>

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <div className="modal-actions">
              <button type="submit" className="save-btn">
                Save
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;