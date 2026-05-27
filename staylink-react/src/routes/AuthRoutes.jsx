import { Route } from "react-router-dom";

/* AUTH PAGES */

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyCode from "../pages/Auth/VerifyCode";

const AuthRoutes = () => {

  return (

    <>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:uid/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/verify-code"
        element={<VerifyCode />}
      />
    </>
  );
};

export default AuthRoutes;