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

import {
  DateRange
} from "react-date-range";

import "react-date-range/dist/styles.css";

import "react-date-range/dist/theme/default.css";


const PropertyDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // =====================================
  // STATE
  // =====================================

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [blockedDates, setBlockedDates] =
    useState([]);

  const [reservedDates, setReservedDates] =
    useState([]);

  const [holdDates, setHoldDates] =
    useState([]);

  const [selection, setSelection] =
    useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);

  const [isBooking, setIsBooking] =
    useState(false);

  const [guestsCount, setGuestsCount] =
    useState(1);

  const [specialRequest, setSpecialRequest] =
    useState("");

  // =====================================
  // BOOKING MODAL STATE
  // showBookingModal: controls the guest
  // details modal visibility before payment
  // =====================================

  const [showBookingModal, setShowBookingModal] =
    useState(false);


  // =====================================
  // LOAD PROPERTY
  // =====================================

  useEffect(() => {

    fetchPropertyDetails();

    fetchCalendar();

  }, [id]);


  // =====================================
  // PROPERTY DETAILS
  // =====================================

  const fetchPropertyDetails = async () => {

    try {

      setLoading(true);

      const response =
        await getPublicPropertyDetails(id);

      setProperty(response.data);

    } catch (error) {

      console.log(
        "Property fetch error",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================
  // CALENDAR
  // =====================================

  const fetchCalendar = async () => {

    try {

      const data =
        await getPropertyCalendar(id);

      setBlockedDates(
        data.blocked_dates || []
      );

      setReservedDates(
        data.reserved_dates || []
      );

      setHoldDates(
        data.hold_dates || []
      );

    } catch (error) {

      console.log(
        "Calendar fetch error",
        error
      );
    }
  };


  // =====================================
  // DISABLED DATES
  // =====================================

  const disabledDates = [

    ...blockedDates,

    ...reservedDates,

    ...holdDates,

  ].map(
    (date) => new Date(date)
  );


  // =====================================
  // PRICE CALCULATION
  // =====================================

  const calculateNights = () => {

    const start =
      selection[0].startDate;

    const end =
      selection[0].endDate;

    const diff =
      end - start;

    const nights =
      Math.ceil(
        diff / (1000 * 60 * 60 * 24)
      );

    return nights > 0
      ? nights
      : 1;
  };


  const calculateTotal = () => {

    if (!property) return 0;

    return (
      calculateNights() *
      parseFloat(property.price)
    );
  };


  const calculateAdvance = () => {

    if (!property) return 0;

    return (
      calculateTotal() *
      (
        property.advance_percentage / 100
      )
    );
  };


  // =====================================
  // FORMAT DATE → "YYYY-MM-DD"
  // =====================================

  const formatDate = (date) => {

    const year = date.getFullYear();

    const month =
      String(date.getMonth() + 1).padStart(2, "0");

    const day =
      String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // =====================================
  // STEP 1 — RESERVE BUTTON CLICKED
  // Validates login + dates, then opens
  // the booking details modal
  // =====================================

  const handleReserveClick = () => {

    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login");
      return;
    }

    // Validate dates are actually selected
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

    // ✅ Dates valid — open the booking details modal
    setShowBookingModal(true);
  };


  // =====================================
  // STEP 2 — CONFIRM BOOKING MODAL
  // Called when traveler clicks
  // "Proceed to Payment" inside the modal
  // =====================================

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

      // ── STEP 2: Create hold booking + Razorpay order ──────────────────
      const orderData = await createBookingOrder({
        property: property.id,
        check_in: formatDate(startDate),
        check_out: formatDate(endDate),
        guests_count: guestsCount,
        special_request: specialRequest || "",
      });

      const {
        booking_id,
        razorpay_order_id,
        razorpay_key_id,
        amount_paise,
        nights,
      } = orderData;

      // ── STEP 3: Open Razorpay payment popup ───────────────────────────
      const options = {

        key: razorpay_key_id,

        amount: amount_paise,

        currency: "INR",

        name: "StayLink",

        description: `${nights} night(s) at ${property.title}`,

        order_id: razorpay_order_id,

        handler: async function (razorpayResponse) {

          // ── STEP 4: Verify payment signature on backend ──────────────
          try {

            const verifyData = await verifyPayment({
              razorpay_order_id:
                razorpayResponse.razorpay_order_id,
              razorpay_payment_id:
                razorpayResponse.razorpay_payment_id,
              razorpay_signature:
                razorpayResponse.razorpay_signature,
            });

            // ✅ Success — navigate to confirmation page
            navigate(
              `/booking-confirmed/${verifyData.booking_id}`
            );

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

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
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
        err.response?.data?.error ||
        "Booking failed. Please try again.";

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
    const res = await startConversation(property.id);

    const conversationId = res.data.conversation_id;

    navigate(`/chat/${conversationId}`);
  } catch (error) {
    console.log("Chat start error:", error);
    alert("Unable to start chat");
  }
};


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="p-10 text-center text-lg">

        Loading Property...

      </div>
    );
  }


  // =====================================
  // PROPERTY NOT FOUND
  // =====================================

  if (!property) {

    return (

      <div className="p-10 text-center text-red-500">

        Property not found

      </div>
    );
  }


  // =====================================
  // UI
  // =====================================

  return (

    <div className="max-w-7xl mx-auto p-6">

      {/* ================================= */}
      {/* BOOKING DETAILS MODAL */}
      {/* Shows between Reserve click and  */}
      {/* Razorpay popup                   */}
      {/* ================================= */}

      {showBookingModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">

                Booking Details

              </h2>

              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>

            </div>


            {/* BOOKING SUMMARY */}

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span className="font-semibold">
                  {formatDate(selection[0].startDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Check-out</span>
                <span className="font-semibold">
                  {formatDate(selection[0].endDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Nights</span>
                <span className="font-semibold">
                  {calculateNights()}
                </span>
              </div>

              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold">
                  ₹ {calculateTotal()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Advance to Pay (now)</span>
                <span className="font-bold text-black">
                  ₹ {calculateAdvance()}
                </span>
              </div>

            </div>


            {/* GUESTS COUNT */}

            <div className="mb-4">

              <label className="block text-sm font-semibold mb-2">

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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />

            </div>


            {/* SPECIAL REQUEST */}

            <div className="mb-6">

              <label className="block text-sm font-semibold mb-2">

                Special Request

                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>

              </label>

              <textarea
                rows={3}
                placeholder="Any special requests for the owner..."
                value={specialRequest}
                onChange={(e) =>
                  setSpecialRequest(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />

            </div>


            {/* MODAL BUTTONS */}

            <div className="flex gap-3">

              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleProceedToPayment}
                className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Proceed to Payment
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ================================= */}
      {/* PROPERTY TITLE */}
      {/* ================================= */}

      <h1 className="text-4xl font-bold mb-4">

        {property.title}

      </h1>


      {/* ================================= */}
      {/* PROPERTY IMAGES */}
      {/* ================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

        {
          property.images?.map((image) => (

            <img
              key={image.id}
              src={image.image}
              alt={property.title}
              className="w-full h-[350px] object-cover rounded-xl"
            />
          ))
        }
      </div>


      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ================================= */}
        {/* LEFT SIDE */}
        {/* ================================= */}

        <div className="lg:col-span-2 space-y-8">

          {/* DESCRIPTION */}

          <div>

            <h2 className="text-2xl font-semibold mb-3">

              Description

            </h2>

            <p className="text-gray-700 leading-7">

              {property.description}

            </p>
          </div>


          {/* PROPERTY INFO */}

          <div>

            <h2 className="text-2xl font-semibold mb-3">

              Property Details

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              <div className="border p-4 rounded-lg">
                Bedrooms:
                {" "}
                {property.bedrooms}
              </div>

              <div className="border p-4 rounded-lg">
                Bathrooms:
                {" "}
                {property.bathrooms}
              </div>

              <div className="border p-4 rounded-lg">
                Guests:
                {" "}
                {property.max_guest}
              </div>

              <div className="border p-4 rounded-lg">
                Furnished:
                {" "}
                {property.is_furnished
                  ? "Yes"
                  : "No"}
              </div>

              <div className="border p-4 rounded-lg">
                Ambience:
                {" "}
                {property.ambience}
              </div>

              <div className="border p-4 rounded-lg">
                Privacy:
                {" "}
                {property.privacy_level}/5
              </div>

            </div>
          </div>


          {/* AMENITIES */}

          <div>

            <h2 className="text-2xl font-semibold mb-3">

              Amenities

            </h2>

            <div className="flex flex-wrap gap-3">

              {
                property.amenities?.map(
                  (amenity) => (

                    <div
                      key={amenity.id}
                      className="px-4 py-2 bg-gray-100 rounded-full"
                    >
                      {amenity.name}
                    </div>
                  )
                )
              }
            </div>
          </div>


          {/* RULES */}

          <div>

            <h2 className="text-2xl font-semibold mb-3">

              Rules

            </h2>

            <p className="text-gray-700">

              {property.rules}
            </p>
          </div>


          {/* CANCELLATION */}

          <div>

            <h2 className="text-2xl font-semibold mb-3">

              Cancellation Policy

            </h2>

            <p className="text-gray-700">

              {property.cancellation_policy}
            </p>
          </div>

        </div>


        {/* ================================= */}
        {/* RIGHT SIDE BOOKING CARD */}
        {/* ================================= */}

        <div className="border rounded-2xl shadow-lg p-6 h-fit sticky top-24">

          <h2 className="text-3xl font-bold mb-4">

            ₹ {property.price}

            <span className="text-lg font-normal">
              /{property.price_unit}
            </span>

          </h2>


          {/* CALENDAR */}

          <div className="mb-6">

            <DateRange

              editableDateInputs={true}

              onChange={(item) =>
                setSelection([
                  item.selection,
                ])
              }

              moveRangeOnFirstSelection={false}

              ranges={selection}

              disabledDates={
                disabledDates
              }

              minDate={new Date()}
            />
          </div>


          {/* PRICE DETAILS */}

          <div className="space-y-3 border-t pt-4">

            <div className="flex justify-between">

              <span>Nights</span>

              <span>
                {calculateNights()}
              </span>
            </div>

            <div className="flex justify-between">

              <span>Total</span>

              <span>
                ₹ {calculateTotal()}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg">

              <span>
                Advance Amount
              </span>

              <span>
                ₹ {calculateAdvance()}
              </span>
            </div>
          </div>


          {/* RESERVE BUTTON */}

          <button
            onClick={handleReserveClick}
            disabled={isBooking}
            className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBooking ? "Processing..." : "Reserve"}
          </button>

          {/* CHAT WITH OWNER BUTTON */}
         <button
  onClick={handleStartChat}
  className="w-full mt-3 border-2 border-black text-black py-3 rounded-xl hover:bg-gray-50 transition font-semibold"
>
  💬 Chat with Owner
</button>

        </div>

      </div>

    </div>
  );
};

export default PropertyDetails;