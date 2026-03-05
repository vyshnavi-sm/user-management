// src/pages/Register/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Validate input fields
  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "At least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const res = await axios.post("http://localhost:9000/api/auth/register", formData);

    console.log("Backend Response:", res.data);

    // ⚡ Save the JWT token in localStorage
    localStorage.setItem("token", res.data.token);

    // Optionally, you can also store user info
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // Redirect to home (or profile) after registration
    navigate("/home");
  } catch (err) {
    console.error("Registration Error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div className="input-group" key={field}>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
              <label>
                {field === "name" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {errors[field] && <span className="error-text">{errors[field]}</span>}
            </div>
          ))}
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;