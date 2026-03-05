// src/pages/Profile/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { logout } from "../../features/auth/authSlice";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!token && !storedToken) {
      dispatch(logout());
      navigate("/"); 
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        setUser(res.data);
        setName(res.data.name);
      } catch (err) {
        console.log("Profile fetch error:", err.response?.data || err.message);
        setError("Failed to load profile. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, dispatch, navigate]);

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/users/me", { name, email: user.email });

      if (image) {
        const formData = new FormData();
        formData.append("profileImage", image);

        await axiosInstance.put("/users/me/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const updated = await axiosInstance.get("/users/me");
      setUser(updated.data);
      setEditMode(false);
      setImage(null);
    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "20px" }}>Loading...</h2>;
  if (error) return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>{error}</h3>
      <button onClick={() => { dispatch(logout()); navigate("/"); }}>Go to Login</button>
    </div>
  );
  if (!user) return null;

  return (
    <div className="profile-wrapper">
      <nav className="navbar">
        <h2 className="logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          RoyalSpace
        </h2>
        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar">
              {user.profileImage ? (
                <img 
                  src={`http://localhost:9000/uploads/${user.profileImage}`} 
                  alt="Profile" 
                  className="profile-img"
                />
              ) : "👑"}
            </div>
            <br></br>
            <h2>{user.name}</h2>
            <p>{user.role?.toUpperCase()}</p>
          </div>

          <div className="details-section">
            <p>Email: {user.email}</p>
            <p>Joined: {new Date(user.createdAt).toDateString()}</p>
          </div>

          {!editMode && <button onClick={() => setEditMode(true)}>Edit Profile</button>}

          {editMode && (
            <form onSubmit={handleUpdate}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" />
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              <button type="submit">Save</button>
              <button type="button" onClick={() => { setEditMode(false); setImage(null); }} style={{ marginLeft: "10px", backgroundColor: "#ccc" }}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;