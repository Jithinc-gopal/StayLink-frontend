import { Navigate } from "react-router-dom";
import Landing from "../pages/Traveler/Landing";

const RoleBasedHome = () => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user?.role === "owner") {
    return <Navigate to="/owner/dashboard" replace />;
  }

  if (token && user?.role === "broker") {
    return <Navigate to="/broker/dashboard" replace />;
  }

  return <Landing />;
};

export default RoleBasedHome;