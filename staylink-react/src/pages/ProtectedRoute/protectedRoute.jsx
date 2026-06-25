import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "owner") {
      return <Navigate to="/owner/dashboard" replace />;
    }

    if (user.role === "broker") {
      return <Navigate to="/broker/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;