import API from "./api";

/* ================= DASHBOARD ================= */

export const getBrokerDashboardStats = () => {
  return API.get("/api/broker/dashboard/stats/");
};

/* ================= PROFILE ================= */

export const getBrokerProfile = () => {
  return API.get("/api/broker/profile/");
};

export const updateBrokerProfile = (data) => {
  return API.put("/api/broker/profile/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ================= CONNECTIONS ================= */

export const getBrokerConnections = (status = "") => {
  const query = status ? `?status=${status}` : "";
  return API.get(`/api/broker/connections/${query}`);
};

export const sendBrokerConnectionRequest = (data) => {
  return API.post("/api/broker/connections/", data);
};

export const removeBrokerConnection = (id) => {
  return API.delete(`/api/broker/connections/${id}/`);
};

/* ================= CONNECTION REQUESTS ================= */

export const getBrokerConnectionRequests = () => {
  return API.get("/api/broker/connection-requests/");
};

export const respondBrokerConnectionRequest = (id, data) => {
  return API.put(`/api/broker/connection-requests/${id}/`, data);
};

export const updateBrokerConnectionRequest = respondBrokerConnectionRequest;

/* ================= PUBLIC BROKERS ================= */

export const getPublicBrokers = () => {
  return API.get("/api/broker/list/");
};

export const getApprovedBrokers = (place = "") => {
  return API.get(`/api/broker/list/?place=${place}`);
};

export const getBrokerDetail = (brokerId) => {
  return API.get(`/api/broker/detail/${brokerId}/`);
};

/* ================= REVIEWS ================= */

export const getBrokerReviews = (brokerId) => {
  return API.get(`/api/broker/${brokerId}/reviews/`);
};

export const createBrokerReview = (brokerId, data) => {
  return API.post(`/api/broker/${brokerId}/reviews/`, data);
};

/* ================= UNLISTED PROPERTIES ================= */

export const getBrokerProperties = (active = "") => {
  const query = active !== "" ? `?active=${active}` : "";
  return API.get(`/api/broker/properties/${query}`);
};

export const createBrokerProperty = (data) => {
  return API.post("/api/broker/properties/", data);
};

export const getBrokerPropertyDetail = (id) => {
  return API.get(`/api/broker/properties/${id}/`);
};

export const updateBrokerProperty = (id, data) => {
  return API.put(`/api/broker/properties/${id}/`, data);
};

export const deleteBrokerProperty = (id) => {
  return API.delete(`/api/broker/properties/${id}/`);
};

/* ================= BOOKING RECORDS ================= */

export const getBrokerBookingRecords = (propertyId = "", status = "") => {
  const params = new URLSearchParams();

  if (propertyId) params.append("property_id", propertyId);
  if (status) params.append("status", status);

  const query = params.toString() ? `?${params.toString()}` : "";

  return API.get(`/api/broker/booking-records/${query}`);
};

export const createBrokerBookingRecord = (data) => {
  return API.post("/api/broker/booking-records/", data);
};

export const getBrokerBookingRecordDetail = (id) => {
  return API.get(`/api/broker/booking-records/${id}/`);
};

export const updateBrokerBookingRecord = (id, data) => {
  return API.put(`/api/broker/booking-records/${id}/`, data);
};

export const deleteBrokerBookingRecord = (id) => {
  return API.delete(`/api/broker/booking-records/${id}/`);
};

/* ================= NOTES ================= */

export const getBrokerNotes = ({
  category = "",
  pinned = "",
  propertyId = "",
} = {}) => {
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (pinned !== "") params.append("pinned", pinned);
  if (propertyId) params.append("property_id", propertyId);

  const query = params.toString() ? `?${params.toString()}` : "";

  return API.get(`/api/broker/notes/${query}`);
};

export const createBrokerNote = (data) => {
  return API.post("/api/broker/notes/", data);
};

export const getBrokerNoteDetail = (id) => {
  return API.get(`/api/broker/notes/${id}/`);
};

export const updateBrokerNote = (id, data) => {
  return API.put(`/api/broker/notes/${id}/`, data);
};

export const deleteBrokerNote = (id) => {
  return API.delete(`/api/broker/notes/${id}/`);
};

export const toggleBrokerNotePin = (id) => {
  return API.put(`/api/broker/notes/${id}/toggle-pin/`);
};

/* ================= NOTIFICATIONS ================= */

export const getBrokerNotifications = (unread = "") => {
  const query = unread !== "" ? `?unread=${unread}` : "";
  return API.get(`/api/broker/notifications/${query}`);
};

export const markBrokerNotificationRead = (id) => {
  return API.put(`/api/broker/notifications/${id}/read/`);
};

export const markAllBrokerNotificationsRead = () => {
  return API.put("/api/broker/notifications/mark-all-read/");
};