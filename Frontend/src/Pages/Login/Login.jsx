import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { loading, error, user, token } = useSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // ================= VALIDATION =================
  const validate = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ================= REDIRECT AFTER LOGIN =================
  useEffect(() => {
    if (user && token) {
      navigate("/home");
    }
  }, [user, token, navigate]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginUser(formData));
  };

  return (
    <div className="login-wrapper">
      <div className="background-blobs"></div>

      <div className="login-card">
        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <label>Email</label>
            {formErrors.email && (
              <span className="error-text">{formErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <label>Password</label>
            {formErrors.password && (
              <span className="error-text">{formErrors.password}</span>
            )}
          </div>

          {/* Backend error */}
          {error && <p className="backend-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="bottom-text">
          New user?{" "}
          <span onClick={() => navigate("/register")}>Create Account</span>
        </p>
      </div>
    </div>
  );
}

export default Login;