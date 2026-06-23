// src/services/notificationService.js

import API from "./api";

export const getNotifications = () => {
  return API.get("/api/notifications/");
};

export const markNotificationRead = (id) => {
  return API.post(`/api/notifications/${id}/read/`);
};

export const markAllNotificationsRead = () => {
  return API.post("/api/notifications/read-all/");
};