import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBrokerStatus } from "../../services/authService";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const token = localStorage.getItem("access");

  const user = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();

  const [status, setStatus] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ========================= */
  /* NOT LOGGED IN */
  /* ========================= */

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  /* ========================= */
  /* ROLE CHECK */
  /* ========================= */

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  /* ========================= */
  /* FETCH BROKER STATUS */
  /* ========================= */

  useEffect(() => {

    const fetchBrokerStatus = async () => {

      try {

        if (user.role === "broker") {

          const res = await getBrokerStatus();

          setStatus(res.data);
        }

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

    fetchBrokerStatus();

  }, [user.role]);

  /* ========================= */
  /* LOADING */
  /* ========================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ========================= */
  /* BROKER FLOW */
  /* ========================= */

  if (user.role === "broker") {

    /* PROFILE NOT COMPLETED */
    if (
      status &&
      !status.profile_completed &&
      location.pathname !== "/broker/setup"
    ) {

      return (
        <Navigate
          to="/broker/setup"
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;