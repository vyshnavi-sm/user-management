import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Login/Signup";
import Profile from "./Pages/Profile/Profile";
import AdminLogin from "./Pages/Admin/Login/AdminLogin";
import AdminDashboard from "./Pages/Admin/Dashboard/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Keep root path for Login or redirect it */}
      <Route path="/" element={<Login />} />
      
      {/* ADD THIS LINE: Explicitly define /login */}
      <Route path="/login" element={<Login />} />
      
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;