import { Routes } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import OwnerRoutes from "./OwnerRoutes";
import BrokerRoutes from "./BrokerRoutes";
import TravelerRoutes from "./TravelerRoutes";
import PartnerRoutes from "./PartnerRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>

      {TravelerRoutes()}

      {AuthRoutes()}

      {PartnerRoutes()}

      {OwnerRoutes()}

      {BrokerRoutes()}

      {AdminRoutes()}

    </Routes>
  );
};

export default AppRoutes;