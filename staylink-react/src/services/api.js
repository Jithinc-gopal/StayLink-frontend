import axios from "axios";

// ========================================
// Base URLs
// ========================================

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL;

// ========================================
// Axios Instance
// ========================================

const API = axios.create({
  baseURL: API_BASE_URL,
});

// ========================================
// Request Interceptor
// ========================================

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ========================================
// Response Interceptor
// ========================================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refresh");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/accounts/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        localStorage.setItem(
          "access",
          data.access
        );

        if (data.refresh) {
          localStorage.setItem(
            "refresh",
            data.refresh
          );
        }

        originalRequest.headers.Authorization =
          `Bearer ${data.access}`;

        return API(originalRequest);

      } catch (refreshError) {

        localStorage.clear();

        window.location.href = "/login";

        return Promise.reject(refreshError);

      }
    }

    return Promise.reject(error);
  }
);

export default API;