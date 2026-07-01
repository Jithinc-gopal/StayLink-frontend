import { Route } from "react-router-dom";

import ProtectedRoute from "../pages/ProtectedRoute/ProtectedRoute";

import AdminMFASetup from "../pages/Admin/AdminMFASetup";
import AdminMFAVerify from "../pages/Admin/AdminMFAVerify";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminOwnerApprovals from "../pages/Admin/AdminOwnerApprovals";
import AdminBrokerApprovals from "../pages/Admin/AdminBrokerApprovals";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminUserDetails from "../pages/Admin/AdminUserDetails";
import AdminProperties from "../pages/Admin/AdminProperties";
import AdminPropertyDetails from "../pages/Admin/AdminPropertyDetails";
import AdminBookings from "../pages/Admin/AdminBookings";
import AdminBookingDetails from "../pages/Admin/AdminBookingDetails";


const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/mfa-verify"
        element={<AdminMFAVerify />}
      />

      <Route
        path="/admin/mfa-setup"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminMFASetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/approvals/owners"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOwnerApprovals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/approvals/brokers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBrokerApprovals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUserDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/properties"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProperties />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/properties/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPropertyDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBookingDetails />
          </ProtectedRoute>
        }
      />


    </>
  );
};

export default AdminRoutes;