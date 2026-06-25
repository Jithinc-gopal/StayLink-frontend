import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
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

export default PublicRoute;