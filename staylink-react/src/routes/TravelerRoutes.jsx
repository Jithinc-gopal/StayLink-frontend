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
import RoleBasedHome from "../routes/RoleBasedHome";

const TravelerRoutes = () => {
  return (
    <>
      <Route path="/" element={<RoleBasedHome />} />
      <Route path="/stays" element={<StaysPage />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />

      <Route
        path="/traveler/profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <TravelerProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/traveler/complete-profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/traveler/my-bookings"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking-confirmed"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <BookingConfirmed />
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
        path="/chat/broker/:conversationId"
        element={
          <ProtectedRoute allowedRoles={["user", "broker"]}>
            <BrokerChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/traveler/brokers/:brokerId"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <BrokerDetails />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default TravelerRoutes;