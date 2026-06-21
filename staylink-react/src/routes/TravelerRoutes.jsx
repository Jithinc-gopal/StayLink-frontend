import { Route } from "react-router-dom";

import Landing from "../pages/Traveler/Landing";
import TravelerProfile from "../pages/Traveler/TravelerProfile";
import CompleteProfile from "../pages/Traveler/CompleteProfile";
import StaysPage from "../pages/Traveler/StaysPage";
import PropertyDetails from "../pages/Traveler/PropertyDetails";
import BookingConfirmed from "../pages/Traveler/BookingConfirmed";

import TravelerBrokers from "../pages/Traveler/TravelerBrokers";
import BrokerDetails from "../pages/Traveler/BrokerDetails";

import ChatPage from "../pages/Traveler/ChatPage";
import BrokerChatPage from "../pages/Traveler/BrokerChatPage";

import ProtectedRoute from "../pages/ProtectedRoute/protectedRoute";

import MyBookings from "../pages/Traveler/MyBookings";

const TravelerRoutes = () => {
  return (
    <>
      <Route path="/" element={<Landing />} />

      <Route
        path="/traveler/profile"
        element={<TravelerProfile />}
      />

      <Route
        path="/traveler/complete-profile"
        element={<CompleteProfile />}
      />

      <Route
        path="/stays"
        element={<StaysPage />}
      />

      <Route
        path="/properties/:id"
        element={<PropertyDetails />}
      />

      <Route
        path="/traveler/brokers"
        element={<TravelerBrokers />}
      />

      <Route
        path="/traveler/brokers/:brokerId"
        element={<BrokerDetails />}
      />

      <Route
        path="/booking-confirmed/:bookingId"
        element={<BookingConfirmed />}
      />

      {/* Broker chat must be above normal chat */}
      <Route
        path="/chat/broker/:conversationId"
        element={
          <ProtectedRoute allowedRoles={["user", "broker", "owner"]}>
            <BrokerChatPage />
          </ProtectedRoute>
        }
      />

      <Route
  path="/chat/:conversationId"
  element={
    <ProtectedRoute allowedRoles={["user", "owner"]}>
      <ChatPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/traveler/bookings"
  element={
    <ProtectedRoute allowedRoles={["user"]}>
      <MyBookings />
    </ProtectedRoute>
  }
/>
    </>
  );
};

export default TravelerRoutes;