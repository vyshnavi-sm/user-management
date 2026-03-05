import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:9000/api/auth/login", formData);
      const { token, user } = res.data;

      if (user.role !== "admin") {
        setError("Access denied: Not an admin");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="teal-login-wrapper">
      <div className="login-card">
        <h2 className="title">Admin Login</h2>
        <p className="subtitle">Secure access portal</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>

          {error && <p className="backend-error">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <div className="bottom-text">
          Not admin? <span onClick={() => navigate("/")}>Go Back</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;