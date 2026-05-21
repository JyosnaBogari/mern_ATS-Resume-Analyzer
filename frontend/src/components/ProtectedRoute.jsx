import { Navigate } from "react-router";
import { useAuth } from "../store/authStore";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);

  // while checking auth on refresh
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // not logged in
  if (!isAuthenticated) {
    return <Navigate to="/signin?message=please_login" replace />;
  }

  // logged in
  return children;
}

export default ProtectedRoute;