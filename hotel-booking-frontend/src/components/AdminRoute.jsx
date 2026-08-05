import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.is_superuser) {
    return <h2 style={{ textAlign: "center" }}>Access Denied 🚫</h2>;
  }

  return children;
};

export default AdminRoute;
