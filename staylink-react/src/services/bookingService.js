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