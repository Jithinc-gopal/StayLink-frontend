import { Route } from "react-router-dom";

import JoinOurTeamPage from
  "../pages/Partner/JoinOurTeamPage";

import PartnerRegister from
  "../pages/Partner/PartnerRegister";

const PartnerRoutes = () => {

  return (

    <>
      <Route
        path="/join-our-team"
        element={<JoinOurTeamPage />}
      />

      <Route
        path="/partner/register"
        element={<PartnerRegister />}
      />
    </>
  );
};

export default PartnerRoutes;