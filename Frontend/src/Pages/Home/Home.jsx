import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // 1. Clear Redux state and LocalStorage
    dispatch(logout());
    // 2. Redirect to login page
    navigate("/");
  };

  return (
    <div className="home-wrapper">

      <nav className="navbar">
        <h2 className="logo">RoyalSpace</h2>

        <div className="nav-right">
          <div 
            className="profile-icon"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            👤
          </div>

          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="hero">
        <h1>Welcome Back 🌿</h1>
        <p>Your elegant digital sanctuary awaits.</p>
      </section>

      <section className="content-grid">
        <div className="info-card">
          <h3>Profile Overview</h3>
          <p>Manage your personal details and account settings.</p>
        </div>

        <div className="info-card">
          <h3>Activity</h3>
          <p>Track your recent actions and interactions.</p>
        </div>

        <div className="info-card">
          <h3>Settings</h3>
          <p>Customize your experience and preferences.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;