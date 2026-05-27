import { Routes } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import OwnerRoutes from "./OwnerRoutes";
import BrokerRoutes from "./BrokerRoutes";
import TravelerRoutes from "./TravelerRoutes";
import PartnerRoutes from "./PartnerRoutes";

const AppRoutes = () => {

  return (

    <Routes>

      {TravelerRoutes()}

      {AuthRoutes()}

      {PartnerRoutes()}

      {OwnerRoutes()}

      {BrokerRoutes()}

    </Routes>
  );
};

export default AppRoutes;