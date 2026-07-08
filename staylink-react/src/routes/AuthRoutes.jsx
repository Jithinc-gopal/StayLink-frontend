import { Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyCode from "../pages/Auth/VerifyCode";

import PublicRoute from "../pages/ProtectedRoute/PublicRoute";
import MFASetup from "../pages/Auth/MFASetup";
import MFALoginVerify from "../pages/Auth/MFALoginVerify";

const AuthRoutes = () => {
  return (
    <>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/mfa/setup"
        element={<MFASetup />}
      />

      <Route
        path="/mfa/verify-login"
        element={<MFALoginVerify />}
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
    </>
  );
};

export default AuthRoutes;