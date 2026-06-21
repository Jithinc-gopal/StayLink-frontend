import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPublicPropertyDetails,
} from "../../services/propertyService";
import {
  getPropertyCalendar,
  createBookingOrder,
  verifyPayment,
} from "../../services/bookingService";
import { startConversation } from "../../services/chatService";
import AIChatButton from "../../components/LandingpageComponents/AIChatButton";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import {
  MapPin,
  Home,
  BedDouble,
  Bath,
  Users,
  Wifi,
  Wind,
  Car,
  Dumbbell,
  Tv,
  Utensils,
  Flame,
  Snowflake,
  Shield,
  Star,
  Clock,
  Calendar,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // =====================================
  // STATE
  // =====================================
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockedDates, setBlockedDates] = useState([]);
  const [reservedDates, setReservedDates] = useState([]);
  const [holdDates, setHoldDates] = useState([]);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [isBooking, setIsBooking] = useState(false);
  const [guestsCount, setGuestsCount] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");

  // =====================================
  // LOAD ON MOUNT
  // =====================================
  useEffect(() => {
    fetchPropertyDetails();
    fetchCalendar();
    window.scrollTo(0, 0);

    // Refresh calendar every 30 seconds
    // so hold/reserved dates stay current
    const interval = setInterval(() => {
      fetchCalendar();
    }, 30000);

    return () => clearInterval(interval);
  }, [id]);

  // =====================================
  // FETCH PROPERTY DETAILS
  // =====================================
  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await getPublicPropertyDetails(id);
      setProperty(response.data);
    } catch (error) {
      console.log("Property fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FETCH CALENDAR
  // Reads blocked/reserved/hold dates
  // AND check-in/check-out times from API
  // =====================================
  const fetchCalendar = async () => {
    try {
      const data = await getPropertyCalendar(id);
      setBlockedDates(data.blocked_dates || []);
      setReservedDates(data.reserved_dates || []);
      setHoldDates(data.hold_dates || []);
      // Read times returned by TravelerCalendarService
      if (data.check_in_time) setCheckInTime(data.check_in_time);
      if (data.check_out_time) setCheckOutTime(data.check_out_time);
    } catch (error) {
      console.log("Calendar fetch error", error);
    }
  };

  // =====================================
  // DISABLED DATES FOR CALENDAR
  // blocked + reserved + hold → all disabled
  // checkout day is NOT in reserved_dates
  // (backend uses while current < checkout)
  // so checkout day stays selectable ✅
  // =====================================
  const disabledDates = [
    ...blockedDates,
    ...reservedDates,
    ...holdDates,
  ].map((date) => new Date(date));

  // =====================================
  // HELPERS
  // =====================================
  const calculateNights = () => {
    const start = selection[0].startDate;
    const end = selection[0].endDate;
    const diff = end - start;
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const calculateTotal = () => {
    if (!property) return 0;
    return calculateNights() * parseFloat(property.price);
  };

  const calculateAdvance = () => {
    if (!property) return 0;
    return calculateTotal() * (property.advance_percentage / 100);
  };

  // Formats date for API: "2026-06-18"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formats date for display: "Mon, Jun 18, 2026"
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Converts "14:00" → "2:00 PM" and "11:00" → "11:00 AM"
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour =
      hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // =====================================
  // HANDLERS
  // =====================================
  const handleReserveClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const startDate = selection[0].startDate;
    const endDate = selection[0].endDate;
    if (
      !startDate ||
      !endDate ||
      startDate.toDateString() === endDate.toDateString()
    ) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    setShowBookingModal(true);
  };

  const handleProceedToPayment = async () => {
    if (guestsCount < 1) {
      alert("Guests count must be at least 1.");
      return;
    }
    if (guestsCount > property.max_guest) {
      alert(`Maximum ${property.max_guest} guests allowed.`);
      return;
    }
    setShowBookingModal(false);
    setIsBooking(true);

    const startDate = selection[0].startDate;
    const endDate = selection[0].endDate;

    try {
      const orderData = await createBookingOrder({
        property: property.id,
        check_in: formatDate(startDate),
        check_out: formatDate(endDate),
        guests_count: guestsCount,
        special_request: specialRequest || "",
      });

      await fetchCalendar();

      const {
        booking_id,
        razorpay_order_id,
        razorpay_key_id,
        amount_paise,
        nights,
      } = orderData;

      const options = {
        key: razorpay_key_id,
        amount: amount_paise,
        currency: "INR",
        name: "StayLink",
        description: `${nights} night(s) at ${property.title}`,
        order_id: razorpay_order_id,
        handler: async function (razorpayResponse) {
          try {
            const verifyData = await verifyPayment({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });
            navigate(`/booking-confirmed/${verifyData.booking_id}`);
          } catch (verifyError) {
            console.error("Payment verify error:", verifyError);
            alert(
              `Payment verification failed. Please contact support.\nYour Booking ID: ${booking_id}`
            );
            setIsBooking(false);
          }
        },
        prefill: {
          name: user?.full_name || user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: async function () {
            await fetchCalendar();
            alert(
              `Payment cancelled. Your booking (ID: ${booking_id}) is on hold for 10 minutes.`
            );
            setIsBooking(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage =
        err.response?.data?.error || "Booking failed. Please try again.";
      alert(errorMessage);
      setIsBooking(false);
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const data = await startConversation(property.id);
      navigate(`/chat/${data.conversation_id}`);
    } catch (error) {
      console.error("Chat start error:", error);
      alert(error.response?.data?.error || "Unable to start chat");
    }
  };

  const handleLike = () => setIsLiked(!isLiked);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  // =====================================
  // LOADING / NOT FOUND STATES
  // =====================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600" />
          <p className="mt-6 text-gray-600 font-medium">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Property not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const amenitiesIcons = {
    WiFi: Wifi,
    AC: Wind,
    Parking: Car,
    Gym: Dumbbell,
    TV: Tv,
    Kitchen: Utensils,
    Heater: Flame,
    Pool: Snowflake,
    Security: Shield,
  };

  const startDate = selection[0].startDate;
  const endDate = selection[0].endDate;
  const hasValidDates =
    startDate &&
    endDate &&
    startDate.toDateString() !== endDate.toDateString();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================= */}
      {/* BOOKING DETAILS MODAL             */}
      {/* ================================= */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 transform animate-in zoom-in-95 duration-300">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirm Your Booking
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 space-y-3">

                {/* CHECK-IN ROW — with time */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check-in</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatDisplayDate(startDate)}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      from {formatTime(checkInTime)}
                    </div>
                  </div>
                </div>

                {/* CHECK-OUT ROW — with time */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check-out</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatDisplayDate(endDate)}
                    </div>
                    <div className="text-xs text-orange-600 font-medium">
                      by {formatTime(checkOutTime)}
                    </div>
                  </div>
                </div>

                {/* NIGHTS */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-semibold text-gray-900">
                    {calculateNights()}
                  </span>
                </div>

                {/* AMOUNTS */}
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹ {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Advance to Pay</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹ {calculateAdvance().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* GUESTS */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Guests
                  <span className="text-gray-400 font-normal ml-1">
                    (max {property.max_guest})
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={property.max_guest}
                  value={guestsCount}
                  onChange={(e) =>
                    setGuestsCount(
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* SPECIAL REQUEST */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Request
                  <span className="text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requests for the host..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToPayment}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================= */}
      {/* STICKY TOP NAVBAR                 */}
      {/* ================================= */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronRight size={20} className="rotate-180" />
              <span>Back</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Heart
                  size={20}
                  className={
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* MAIN CONTENT                      */}
      {/* ================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TITLE & LOCATION */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={18} />
            <span>
              {property.city}, {property.state},{" "}
              {property.country || "India"}
            </span>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <img
                src={
                  property.images?.[selectedImage]?.image ||
                  property.images?.[0]?.image
                }
                alt={property.title}
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {property.images?.slice(1, 5).map((image, idx) => (
                <img
                  key={image.id}
                  src={image.image}
                  alt={`${property.title} ${idx + 2}`}
                  className="w-full h-[190px] object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedImage(idx + 1)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ========================= */}
          {/* LEFT — Property Details   */}
          {/* ========================= */}
          <div className="space-y-8">

            {/* HOST INFO */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Hosted by{" "}
                    {property.host_name || "Professional Host"}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Superhost
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {property.host_name?.[0] || "H"}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About this place
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* AMENITIES */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(showAllAmenities
                  ? property.amenities
                  : property.amenities?.slice(0, 6)
                )?.map((amenity) => {
                  const IconComponent =
                    amenitiesIcons[amenity.name] || Home;
                  return (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <IconComponent
                        size={18}
                        className="text-gray-600"
                      />
                      <span className="text-sm text-gray-700">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              {property.amenities?.length > 6 && (
                <button
                  onClick={() =>
                    setShowAllAmenities(!showAllAmenities)
                  }
                  className="mt-4 text-blue-600 font-medium hover:text-blue-700 transition"
                >
                  {showAllAmenities
                    ? "Show less"
                    : `Show all ${property.amenities.length} amenities`}
                </button>
              )}
            </div>

            {/* PROPERTY DETAILS GRID */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <BedDouble className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">
                    {property.bedrooms} Bedrooms
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">
                    {property.bathrooms} Bathrooms
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">
                    {property.max_guest} Guests
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Home className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">
                    {property.property_type}
                  </div>
                </div>
              </div>
            </div>

            {/* RULES & POLICIES */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Things to know
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    House Rules
                  </h3>
                  <p className="text-gray-600">
                    {property.rules ||
                      "Standard house rules apply. Please respect the property and neighbors."}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Cancellation Policy
                  </h3>
                  <p className="text-gray-600">
                    {property.cancellation_policy ||
                      "Flexible: Full refund 5 days before check-in."}
                  </p>
                </div>
              </div>
            </div>
            {/* REVIEWS */}
{property.review_count > 0 && (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
    
    <div className="flex items-center gap-3 mb-6">
      <Star
        size={24}
        className="fill-yellow-400 text-yellow-400"
      />
      <h2 className="text-2xl font-bold text-gray-900">
        {property.avg_rating} · {property.review_count} Reviews
      </h2>
    </div>

    <div className="space-y-5">
      {property.reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-gray-100 pb-5 last:border-0"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">
                {review.user_name}
              </h3>

              <p className="text-xs text-gray-400">
                {new Date(
                  review.created_at
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>

          <p className="text-gray-600 mt-3 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
          </div>

          {/* ========================= */}
          {/* RIGHT — Calendar & Booking*/}
          {/* ========================= */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">

              {/* SELECTED DATES BANNER — shows after dates picked */}
              {hasValidDates && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 mb-5 text-white shadow-lg">
                  <h3 className="text-sm font-semibold opacity-90 mb-2">
                    Your Selected Dates
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold">
                        {formatDisplayDate(startDate)}
                      </div>
                      {/* CHECK-IN TIME */}
                      <div className="text-sm opacity-90">
                        Check-in · {formatTime(checkInTime)}
                      </div>
                    </div>
                    <Zap size={24} className="opacity-75" />
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatDisplayDate(endDate)}
                      </div>
                      {/* CHECK-OUT TIME */}
                      <div className="text-sm opacity-90">
                        Check-out · {formatTime(checkOutTime)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20 flex justify-between">
                    <span>{calculateNights()} nights</span>
                    <span className="font-bold">
                      Total: ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* CHECK-IN / CHECK-OUT TIME INFO CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  Check-in & Check-out Times
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      Check-in from
                    </p>
                    <p className="text-lg font-bold text-green-700">
                      {formatTime(checkInTime)}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      Check-out by
                    </p>
                    <p className="text-lg font-bold text-orange-700">
                      {formatTime(checkOutTime)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Same-day turnover — checkout {formatTime(checkOutTime)},
                  new check-in from {formatTime(checkInTime)}
                </p>
              </div>

              {/* DATE PICKER CALENDAR */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-5">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} />
                    <h3 className="font-semibold">Select Your Dates</h3>
                  </div>
                  <p className="text-xs opacity-75 mt-1">
                    Choose check-in and check-out dates
                  </p>
                </div>

                <div className="p-6 calendar-large">
                  <style jsx>{`
                    .calendar-large .rdrCalendarWrapper {
                      width: 100% !important;
                    }
                    .calendar-large .rdrDateRangeWrapper {
                      width: 100% !important;
                    }
                    .calendar-large .rdrMonthAndYearWrapper {
                      padding: 20px 0 !important;
                    }
                    .calendar-large .rdrMonth {
                      width: 100% !important;
                      font-size: 16px !important;
                    }
                    .calendar-large .rdrWeekDay {
                      font-size: 14px !important;
                      padding: 12px 0 !important;
                      font-weight: 600 !important;
                    }
                    .calendar-large .rdrDay {
                      height: 3.5em !important;
                    }
                    .calendar-large .rdrDayNumber span {
                      font-size: 15px !important;
                      font-weight: 500 !important;
                    }
                    .calendar-large .rdrDayToday .rdrDayNumber span:after {
                      background: #3b82f6 !important;
                    }
                    .calendar-large .rdrStartEdge,
                    .calendar-large .rdrEndEdge {
                      background: #3b82f6 !important;
                    }
                    .calendar-large .rdrInRange {
                      background: #dbeafe !important;
                    }
                  `}</style>
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setSelection([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={selection}
                    disabledDates={disabledDates}
                    minDate={new Date()}
                    rangeColors={["#3B82F6"]}
                    months={2}
                    direction="vertical"
                    showDateDisplay={false}
                    showPreview={true}
                  />
                </div>
              </div>

              {/* PRICE & BOOKING CARD */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{property.price?.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {" "}
                    /{property.price_unit}
                  </span>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4 mb-6">
                  {hasValidDates ? (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>
                          ₹{property.price} x {calculateNights()} nights
                        </span>
                        <span>₹{calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Service fee</span>
                        <span>FREE</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
                        <span>Total (incl. taxes)</span>
                        <span className="text-blue-600">
                          ₹{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 bg-green-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Wallet size={16} />
                          <span>Advance to pay now</span>
                        </div>
                        <span className="font-bold">
                          ₹{calculateAdvance().toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Calendar
                        size={40}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>Select dates to see price</p>
                    </div>
                  )}

                  {/* RESERVE BUTTON */}
                  <button
                    onClick={handleReserveClick}
                    disabled={isBooking || !hasValidDates}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 shadow-md mb-3"
                  >
                    {isBooking
                      ? "Processing..."
                      : hasValidDates
                      ? "Reserve Now"
                      : "Select Dates First"}
                  </button>

                  {/* CHAT BUTTON */}
                  <button
                    onClick={handleStartChat}
                    className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Chat with Host
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    You won't be charged yet
                  </p>
                </div>

                {/* TRUST INDICATORS */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      <span>Secure Booking</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      <span>Best Price</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>Verified Property</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <AIChatButton />

    </div>
  );
};

export default PropertyDetails;
