import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  const storedToken = localStorage.getItem("token");

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectRoute;