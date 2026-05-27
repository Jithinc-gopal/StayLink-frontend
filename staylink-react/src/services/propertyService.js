import API from "./api";


// =========================================
// OWNER PROPERTY APIs
// =========================================


// =========================
// ADD PROPERTY
// POST: /api/owner/properties/
// =========================

export const addProperty = (
  formData
) => {

  return API.post(
    "/api/owner/properties/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};


// =========================
// GET OWNER PROPERTIES
// GET: /api/owner/properties/
// =========================

export const getMyProperties = () => {

  return API.get(
    "/api/owner/properties/"
  );
};


// =========================
// GET SINGLE OWNER PROPERTY
// GET: /api/owner/properties/:id/
// =========================

export const getSingleProperty = (
  propertyId
) => {

  return API.get(
    `/api/owner/properties/${propertyId}/`
  );
};


// =========================
// UPDATE PROPERTY
// PUT: /api/owner/properties/:id/
// =========================

export const updateProperty = (
  propertyId,
  formData
) => {

  return API.put(
    `/api/owner/properties/${propertyId}/`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};


// =========================
// DELETE PROPERTY
// DELETE: /api/owner/properties/:id/
// =========================

export const deleteProperty = (
  propertyId
) => {

  return API.delete(
    `/api/owner/properties/${propertyId}/`
  );
};


// =========================================
// AMENITIES
// =========================================


// =========================
// GET AMENITIES
// GET: /api/owner/amenities/
// =========================

export const getAmenities = () => {

  return API.get(
    "/api/owner/amenities/"
  );
};


// =========================================
// PROPERTY IMAGE APIs
// =========================================


// =========================
// UPLOAD PROPERTY IMAGES
// POST: /api/owner/properties/:id/images/
// =========================

export const uploadPropertyImages = (
  propertyId,
  formData
) => {

  return API.post(
    `/api/owner/properties/${propertyId}/images/`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};


// =========================
// DELETE PROPERTY IMAGE
// DELETE: /api/owner/properties/images/:id/
// =========================

export const deletePropertyImage = (
  imageId
) => {

  return API.delete(
    `/api/owner/properties/images/${imageId}/`
  );
};


// =========================================
// OWNER CALENDAR APIs
// =========================================


// =========================
// GET OWNER PROPERTY CALENDAR
// GET: /api/owner/properties/:id/calendar/
// =========================

export const getOwnerPropertyCalendar = async (
  propertyId
) => {

  const response = await API.get(
    `/api/owner/properties/${propertyId}/calendar/`
  );

  return response.data;
};


// =========================
// BLOCK PROPERTY DATES
// POST: /api/owner/properties/block-dates/
// =========================

export const blockPropertyDates = async (
  data
) => {

  const response = await API.post(
    "/api/owner/properties/block-dates/",
    data
  );

  return response.data;
};


// =========================
// UPDATE BLOCKED DATES
// PUT: /api/owner/properties/blocked-dates/update/
// =========================

export const updateBlockedDate = async (
  availability_ids,
  data
) => {

  const response = await API.put(

    "/api/owner/properties/blocked-dates/update/",

    {
      availability_ids,
      ...data,
    }
  );

  return response.data;
};


// =========================
// UNBLOCK DATES
// DELETE: /api/owner/properties/blocked-dates/unblock/
// =========================

export const unblockDate = async (
  availability_ids
) => {

  const response = await API.delete(

    "/api/owner/properties/blocked-dates/unblock/",

    {
      data: {
        availability_ids,
      },
    }
  );

  return response.data;
};


// =========================================
// TRAVELER PROPERTY APIs
// =========================================


// =========================
// SEARCH PROPERTIES
// GET: /api/traveler/search/properties/
// =========================

export const searchProperties = (
  params
) => {

  return API.get(
    "/api/traveler/search/properties/",
    {
      params,
    }
  );
};


// =========================
// GET PUBLIC PROPERTY DETAILS
// GET: /api/properties/:id/
// =========================

export const getPublicPropertyDetails = (
  propertyId
) => {

  return API.get(

    `/api/traveler/properties/${propertyId}/`

  );
};