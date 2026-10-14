import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthService";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/signin" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
