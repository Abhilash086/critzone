import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Loader from "./Loader";
import { hasRoleAccess } from "../utils/routingUtils";

const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { user, isAuthenticated, loading } = useUser();

  if (loading) {
    return <Loader />;
  }

  // Not authenticated - redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !hasRoleAccess(user, allowedRoles)) {
    // User doesn't have required role - redirect to their appropriate dashboard
    const dashboardRoute = user?.role === 'host' 
      ? `/host/${user._id}/dashboard`
      : `/player/${user._id}/dashboard`;
    
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
