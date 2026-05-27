import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  getPublicPropertyDetails,
} from "../../services/propertyService";

import {
  getPropertyCalendar,
} from "../../services/bookingService";

import {
  DateRange
} from "react-date-range";

import "react-date-range/dist/styles.css";

import "react-date-range/dist/theme/default.css";


const PropertyDetails = () => {

  const { id } = useParams();

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
            className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Reserve
          </button>

        </div>

      </div>

    </div>
  );
};

export default PropertyDetails;