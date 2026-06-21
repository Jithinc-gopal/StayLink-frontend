import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyBookings,
  createReview,
} from "../../services/bookingService";

import {
  Star,
  MapPin,
  CalendarDays,
  Users,
  IndianRupee,
  CheckCircle,
  Clock,
  X,
  MessageSquareText,
  Home,
  Eye,
} from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (error) {
      console.log("Bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      await createReview(selectedBooking.id, {
        rating,
        comment,
      });

      alert("Review submitted successfully");

      setSelectedBooking(null);
      setRating(5);
      setComment("");

      loadBookings();
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Failed to submit review"
      );
    }
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "confirmed") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "cancelled") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-lg">
          Loading your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900">
            My Bookings
          </h1>
          <p className="text-slate-500 mt-2">
            View your stays, booking status, payments, and reviews.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border rounded-3xl p-14 text-center">
            <Home size={44} className="mx-auto text-slate-300" />
            <h2 className="text-xl font-bold mt-4">
              No bookings yet
            </h2>
            <p className="text-slate-500 mt-2">
              Your reserved stays will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const remaining =
                Number(booking.total_amount || 0) -
                Number(booking.advance_amount || 0);

              return (
                <div
                  key={booking.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div
                      onClick={() =>
                        navigate(`/properties/${booking.property_id}`)
                      }
                      className="relative h-64 lg:h-full cursor-pointer bg-slate-100"
                    >
                      <img
                        src={booking.property_image || fallbackImage}
                        alt={booking.property_title}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-2 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h2
                            onClick={() =>
                              navigate(`/properties/${booking.property_id}`)
                            }
                            className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-blue-600"
                          >
                            {booking.property_title}
                          </h2>

                          <p className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                            <MapPin size={15} />
                            {booking.property_location ||
                              `${booking.property_city}, ${booking.property_state}`}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/properties/${booking.property_id}`)
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold"
                        >
                          <Eye size={15} />
                          View Stay
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <InfoBox
                          icon={CalendarDays}
                          label="Stay Dates"
                          value={`${booking.check_in} → ${booking.check_out}`}
                        />

                        <InfoBox
                          icon={Users}
                          label="Guests"
                          value={booking.guests_count}
                        />

                        <InfoBox
                          icon={IndianRupee}
                          label="Total Amount"
                          value={`₹${booking.total_amount}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <InfoBox
                          icon={CheckCircle}
                          label="Advance Paid"
                          value={`₹${booking.advance_amount}`}
                        />

                        <InfoBox
                          icon={Clock}
                          label="Remaining"
                          value={`₹${remaining}`}
                        />

                        <InfoBox
                          icon={IndianRupee}
                          label="Payment"
                          value={booking.payment_status}
                        />
                      </div>

                      {booking.special_request && (
                        <div className="mt-5 bg-slate-50 border rounded-2xl p-4">
                          <p className="text-xs font-semibold text-slate-400 uppercase">
                            Special Request
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {booking.special_request}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {booking.can_review && (
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-500 text-white text-sm font-bold hover:bg-yellow-600"
                          >
                            <Star size={17} />
                            Write Review
                          </button>
                        )}

                        {booking.has_review && (
                          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-semibold">
                            <CheckCircle size={16} />
                            Review Submitted
                          </span>
                        )}

                        {!booking.can_review && !booking.has_review && (
                          <span className="text-slate-400 text-sm">
                            Review available after completed full-paid stay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Rate Your Stay
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedBooking.property_title}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl overflow-hidden h-44 bg-slate-100">
              <img
                src={selectedBooking.property_image || fallbackImage}
                alt={selectedBooking.property_title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={34}
                    className={
                      num <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Share your stay experience..."
              className="w-full border border-slate-200 rounded-2xl mt-5 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 border rounded-2xl py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="flex-1 bg-slate-900 text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquareText size={17} />
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const InfoBox = ({ icon: Icon, label, value }) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-xs font-semibold uppercase">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-slate-800">
        {value || "-"}
      </p>
    </div>
  );
};