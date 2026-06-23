import { Route } from "react-router-dom";
import ProtectedRoute from
  "../pages/ProtectedRoute/protectedRoute";

/* OWNER PAGES */

import OwnerProfileSetup from
  "../pages/Auth/OwnerSetup";

import OwnerDashboard from
  "../pages/Owner/OwnerDashboard";

import OwnerProfile from
  "../pages/Owner/OwnerProfile";

import AddProperty from
  "../pages/Owner/AddProperty";

import MyProperties from
  "../pages/Owner/MyProperties";

import EditProperty from
  "../pages/Owner/EditProperty";

import OwnerPropertyCalendarPage from
  "../pages/Owner/OwnerPropertyCalendarPage";

import OwnerPropertyConversations from "../pages/Owner/OwnerPropertyConversations";
import OwnerBookings from "../pages/Owner/OwnerBookings";
import OwnerReviews from "../pages/Owner/OwnerReviews";




const OwnerRoutes = () => {

  return (

    <>

      {/* OWNER SETUP */}

      <Route
        path="/owner/setup"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <OwnerProfileSetup />
          </ProtectedRoute>
        }
      />

      {/* OWNER DASHBOARD */}

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* OWNER PROFILE */}

      <Route
        path="/owner/profile"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <OwnerProfile />
          </ProtectedRoute>
        }
      />

      {/* ADD PROPERTY */}

      <Route
        path="/owner/add-property"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <AddProperty />
          </ProtectedRoute>
        }
      />

      {/* MY PROPERTIES */}

      <Route
        path="/owner/my-properties"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <MyProperties />
          </ProtectedRoute>
        }
      />

      {/* EDIT PROPERTY */}

      <Route
        path="/owner/properties/edit/:propertyId"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <EditProperty />
          </ProtectedRoute>
        }
      />

      {/* OWNER PROPERTY CALENDAR */}

      <Route
        path="/owner/properties/calendar/:propertyId"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <OwnerPropertyCalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/properties/:propertyId/conversations"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerPropertyConversations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/bookings"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/reviews"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerReviews />
          </ProtectedRoute>
        }
      />

    </>
  );
};

export default OwnerRoutes;