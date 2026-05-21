import { Navigate, useLocation } from "react-router";
import { useAuth } from "../store/authStore";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin?message=please_login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;