import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

const ProtectedRoute = ({ adminOnly = false }) => {
  const location = useLocation();

  const {
    user,
    loading,
    isAuthenticated,
    isLoggingOut,
  } = useAuth();

  /* =========================================
     AUTHENTICATION LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================
     NOT AUTHENTICATED
  ========================================= */

  if (!isAuthenticated || !user) {
  if (isLoggingOut) {
    return null;
  }

  return (
    <Navigate
      to="/sign-in"
      replace
      state={{ from: location }}
    />
  );
}

  /* =========================================
     ADMIN ONLY
  ========================================= */

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  /* =========================================
     AUTHORIZED
  ========================================= */

  return <Outlet />;
};

export default ProtectedRoute;