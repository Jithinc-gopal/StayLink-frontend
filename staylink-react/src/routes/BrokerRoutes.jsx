import { Route } from "react-router-dom";

import ProtectedRoute from
  "../pages/ProtectedRoute/protectedRoute";

import BrokerSetup from
  "../pages/Auth/BrokerSetup";

import BrokerDashboard from
  "../pages/Broker/BrokerDashboard";

const BrokerRoutes = () => {

  return (

    <>
      {/* BROKER SETUP */}

      <Route
        path="/broker/setup"
        element={
          <ProtectedRoute
            allowedRoles={["broker"]}
          >
            <BrokerSetup />
          </ProtectedRoute>
        }
      />

      {/* BROKER DASHBOARD */}

      <Route
        path="/broker/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["broker"]}
          >
            <BrokerDashboard />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default BrokerRoutes;