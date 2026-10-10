import { Navigate } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, requireAdmin = false, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/shop/home" replace />;
  }

  if (!requireAdmin && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default CheckAuth;
