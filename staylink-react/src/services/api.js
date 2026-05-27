import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach access token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle token expiry — refresh and retry automatically
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if it's a 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        // No refresh token — force logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/accounts/token/refresh/`,
          { refresh: refreshToken }
        );

        // Save the new access token (and refresh token if rotated)
        localStorage.setItem("access", data.access);
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
        }

        // Retry the original failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return API(originalRequest);

      } catch (refreshError) {
        // Refresh failed — token is invalid or expired, force logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;