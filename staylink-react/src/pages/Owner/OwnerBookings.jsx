import { useEffect, useState } from "react";
import { getOwnerAllBookings } from "../../services/propertyService";
import TopNavbar from "../../components/OwnerDashboardComponents/TopNavbar";
import { CalendarDays, User, Home, IndianRupee } from "lucide-react";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getOwnerAllBookings();
      setBookings(data || []);
    } catch (error) {
      console.log("Owner bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />

      <div className="pt-24 px-6 md:px-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">
          All Bookings
        </h1>

        <p className="text-gray-500 mt-1">
          View bookings from all your properties in one place.
        </p>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="p-6 text-gray-500">No bookings found.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Booking #{booking.id}
                      </h2>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Home size={16} />
                          {booking.property_title}
                        </p>

                        <p className="flex items-center gap-2">
                          <User size={16} />
                          {booking.traveler_name} ({booking.traveler_email})
                        </p>

                        <p className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {booking.check_in} → {booking.check_out}
                        </p>

                        <p className="flex items-center gap-2">
                          <IndianRupee size={16} />
                          Total ₹{booking.total_amount} | Advance ₹{booking.advance_amount}
                        </p>
                      </div>

                      {booking.special_request && (
                        <p className="mt-3 text-sm text-gray-500">
                          Request: {booking.special_request}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                          {booking.status}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700">
                          {booking.payment_status}
                        </span>

                        {booking.has_review && (
                          <span className="px-3 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700">
                            Reviewed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-sm text-gray-500">
                        Remaining Amount
                      </p>

                      <p className="text-2xl font-bold text-gray-900">
                        ₹{booking.remaining_amount}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Guests: {booking.guests_count}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerBookings;