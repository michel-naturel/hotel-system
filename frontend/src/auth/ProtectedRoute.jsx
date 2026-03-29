import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const safeAllowedRoles = Array.isArray(allowedRoles) ? allowedRoles : [];

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (safeAllowedRoles.length > 0 && !safeAllowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
