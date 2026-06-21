import { Route } from "react-router-dom";
import ProtectedRoute from "../pages/ProtectedRoute/protectedRoute";

import BrokerDashboard from "../pages/Broker/BrokerDashboard";
import BrokerProfile from "../pages/Broker/BrokerProfile";
import BrokerProperties from "../pages/Broker/BrokerProperties";
import BrokerConnections from "../pages/Broker/BrokerConnections";
import BrokerReviews from "../pages/Broker/BrokerReviews";
import BrokerNotes from "../pages/Broker/BrokerNotes";
import BrokerNotifications from "../pages/Broker/BrokerNotifications";
import BrokerChatInbox from "../pages/Broker/BrokerChatInbox";
import BrokerChatPage from "../pages/Traveler/BrokerChatPage";

const BrokerRoutes = () => {
  return (
    <>
      <Route path="/broker/dashboard" element={<ProtectedRoute allowedRoles={["broker"]}><BrokerDashboard /></ProtectedRoute>} />
      <Route path="/broker/profile" element={<ProtectedRoute allowedRoles={["broker"]}><BrokerProfile /></ProtectedRoute>} />
      <Route path="/broker/properties" element={<ProtectedRoute allowedRoles={["broker"]}><BrokerProperties /></ProtectedRoute>} />
      <Route path="/broker/connections" element={<ProtectedRoute allowedRoles={["broker"]}><BrokerConnections /></ProtectedRoute>} />
      <Route path="/broker/reviews" element={<ProtectedRoute allowedRoles={["broker"]}><BrokerReviews /></ProtectedRoute>} />
      <Route path="/broker/notes" element={<ProtectedRoute allowedRoles={["broker"]}><BrokerNotes /></ProtectedRoute>} />
      <Route path="/broker/notifications" element={<ProtectedRoute allowedRoles={["broker"]}><BrokerNotifications /></ProtectedRoute>} />
      <Route
  path="/broker/chats"
  element={
    <ProtectedRoute allowedRoles={["broker"]}>
      <BrokerChatInbox />
    </ProtectedRoute>
  }
/>

<Route
  path="/broker/chat/:conversationId"
  element={
    <ProtectedRoute allowedRoles={["broker"]}>
      <BrokerChatPage />
    </ProtectedRoute>
  }
/>
    </>
  );
};

export default BrokerRoutes;