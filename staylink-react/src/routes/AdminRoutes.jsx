import { Route } from "react-router-dom";

import ProtectedRoute from "../pages/ProtectedRoute/ProtectedRoute";

import AdminMFASetup from "../pages/Admin/AdminMFASetup";
import AdminMFAVerify from "../pages/Admin/AdminMFAVerify";
import AdminDashboard from "../pages/Admin/AdminDashboard";

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
    </>
  );
};

export default AdminRoutes;