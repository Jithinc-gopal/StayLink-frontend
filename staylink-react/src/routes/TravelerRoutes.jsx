import { Route } from "react-router-dom";

import Landing from "../pages/Traveler/Landing";
import TravelerProfile from "../pages/Traveler/TravelerProfile";
import CompleteProfile from "../pages/Traveler/CompleteProfile";
import StaysPage from "../pages/Traveler/StaysPage";
import PropertyDetails from "../pages/Traveler/PropertyDetails";
import BookingConfirmed from "../pages/Traveler/BookingConfirmed"; 
import ChatPage from "../pages/Traveler/ChatPage";


const TravelerRoutes = () => {
  return (
    <>
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/traveler/profile"
        element={<TravelerProfile />}
      />

      <Route
        path="/traveler/complete-profile"
        element={<CompleteProfile />}
      />

      {/* ================= STAYS PAGE ================= */}
      <Route
        path="/stays"
        element={<StaysPage />}
      />

      <Route
        path="/properties/:id"
        element={<PropertyDetails />}
      />

      {/* ================= BOOKING CONFIRMED ================= */}
      <Route
        path="/booking-confirmed/:bookingId"
        element={<BookingConfirmed />}
      />

      <Route
        path="/chat/property/:propertyId"
        element={<ChatPage />}
      />
    </>
  );
};

export default TravelerRoutes;