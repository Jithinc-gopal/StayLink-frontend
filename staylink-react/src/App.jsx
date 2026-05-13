import { Routes, Route } from "react-router-dom";

/* ================= AUTH ================= */
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

/* ================= LANDING ================= */
import Landing from "./pages/Traveler/Landing";

/* ================= PARTNER ================= */
import JoinOurTeamPage from "./pages/Partner/JoinOurTeamPage";
import PartnerRegister from "./pages/Partner/PartnerRegister";

/* ================= OWNER ================= */
import OwnerProfileSetup from "./pages/Auth/OwnerSetup";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import OwnerProfile from "./pages/Owner/OwnerProfile";

/* ================= BROKER ================= */
import BrokerSetup from "./pages/Auth/BrokerSetup";
import BrokerDashboard from "./pages/Broker/BrokerDashboard";
import PendingApproval from "./pages/Auth/PendingApproval";

/* ================= PROTECTED ROUTE ================= */
import ProtectedRoute from "./pages/ProtectedRoute/protectedRoute";

function App() {
  return (
    <Routes>

      {/* ====================================================== */}
      {/* =================== PUBLIC ROUTES ==================== */}
      {/* ====================================================== */}

      {/* LANDING */}
      <Route path="/" element={<Landing />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:uid/:token"
        element={<ResetPassword />}
      />

      {/* ====================================================== */}
      {/* =================== PARTNER ROUTES =================== */}
      {/* ====================================================== */}

      {/* JOIN OUR TEAM */}
      <Route
        path="/join-our-team"
        element={<JoinOurTeamPage />}
      />

      {/* PARTNER REGISTER */}
      <Route
        path="/partner/register"
        element={<PartnerRegister />}
      />

      {/* ====================================================== */}
      {/* ==================== OWNER ROUTES ==================== */}
      {/* ====================================================== */}

      {/* OWNER SETUP */}
      <Route
        path="/owner/setup"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerProfileSetup />
          </ProtectedRoute>
        }
      />

      {/* OWNER DASHBOARD */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* OWNER PROFILE */}
      <Route
        path="/owner/profile"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerProfile />
          </ProtectedRoute>
        }
      />

      {/* ====================================================== */}
      {/* ==================== BROKER ROUTES =================== */}
      {/* ====================================================== */}

      {/* BROKER SETUP */}
      <Route
        path="/broker/setup"
        element={
          <ProtectedRoute allowedRoles={["broker"]}>
            <BrokerSetup />
          </ProtectedRoute>
        }
      />

      {/* BROKER PENDING APPROVAL */}
      <Route
        path="/broker/pending"
        element={
          <ProtectedRoute allowedRoles={["broker"]}>
            <PendingApproval />
          </ProtectedRoute>
        }
      />

      {/* BROKER DASHBOARD */}
      <Route
        path="/broker/dashboard"
        element={
          <ProtectedRoute allowedRoles={["broker"]}>
            <BrokerDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;