import API from "./api";


// =========================================
// GET PROPERTY CALENDAR
// =========================================
// GET:
// /api/booking/properties/:id/calendar/
// =========================================

export const getPropertyCalendar = async (
  propertyId
) => {

  const response = await API.get(

    `/api/booking/properties/${propertyId}/calendar/`

  );

  return response.data;
};


// =========================================
// CREATE BOOKING ORDER
// =========================================
// POST:
// /api/bookings/create-order/
// =========================================

export const createBookingOrder = async (
  bookingData
) => {

  const response = await API.post(

    `/api/booking/create-order/`,

    bookingData

  );

  return response.data;
};


// =========================================
// VERIFY PAYMENT
// =========================================
// POST:
// /api/payments/verify/
// =========================================

export const verifyPayment = async (
  paymentData
) => {

  const response = await API.post(

    `/api/payments/verify/`,

    paymentData

  );

  return response.data;
};


// =========================================
// GET MY BOOKINGS
// =========================================
// GET:
// /api/bookings/my-bookings/
// =========================================

export const getMyBookings = async () => {

  const response = await API.get(

    `/api/booking/my-bookings/`

  );

  return response.data;
};