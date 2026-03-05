import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.admin);

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default AdminProtectedRoute;