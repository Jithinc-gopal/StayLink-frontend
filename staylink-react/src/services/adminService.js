import API from "./api";

export const adminLogin = async (data) => {
  const response = await API.post(
    "/api/admin/auth/login/",
    data
  );
  return response.data;
};

export const adminMFASetup = async () => {
  const response = await API.post(
    "/api/admin/auth/mfa/setup/"
  );
  return response.data;
};

export const adminVerifyMFASetup = async (data) => {
  const response = await API.post(
    "/api/admin/auth/mfa/verify-setup/",
    data
  );
  return response.data;
};

export const adminVerifyMFALogin = async (data) => {
  const response = await API.post(
    "/api/admin/auth/mfa/verify-login/",
    data
  );
  return response.data;
};

export const adminLogout = async (refresh) => {
  const response = await API.post(
    "/api/admin/auth/logout/",
    { refresh }
  );
  return response.data;
};

export const adminChangePassword = async (data) => {
  const response = await API.post(
    "/api/admin/auth/change-password/",
    data
  );
  return response.data;
};


// Dashboard
export const getAdminDashboardStats = async () => {
  const response = await API.get(
    "/api/admin/dashboard/stats/"
  );
  return response.data;
};

// Owner approvals
export const getPendingOwners = async (search = "") => {
  const response = await API.get(
    `/api/admin/approvals/owners/?search=${search}`
  );
  return response.data;
};

export const approveOwner = async (ownerId) => {
  const response = await API.post(
    `/api/admin/approvals/owners/${ownerId}/approve/`
  );
  return response.data;
};

export const rejectOwner = async (ownerId, reason) => {
  const response = await API.post(
    `/api/admin/approvals/owners/${ownerId}/reject/`,
    { reason }
  );
  return response.data;
};

// Broker approvals
export const getPendingBrokers = async (search = "") => {
  const response = await API.get(
    `/api/admin/approvals/brokers/?search=${search}`
  );
  return response.data;
};

export const approveBroker = async (brokerId) => {
  const response = await API.post(
    `/api/admin/approvals/brokers/${brokerId}/approve/`
  );
  return response.data;
};

export const rejectBroker = async (brokerId, reason) => {
  const response = await API.post(
    `/api/admin/approvals/brokers/${brokerId}/reject/`,
    { reason }
  );
  return response.data;
};

// Users
export const getAdminUsers = async ({
  role = "",
  is_active = "",
  search = "",
} = {}) => {
  const params = new URLSearchParams();

  if (role) params.append("role", role);
  if (is_active !== "") params.append("is_active", is_active);
  if (search) params.append("search", search);

  const response = await API.get(
    `/api/admin/users/?${params.toString()}`
  );

  return response.data;
};

export const getAdminUserDetail = async (userId) => {
  const response = await API.get(
    `/api/admin/users/${userId}/`
  );

  return response.data;
};

export const toggleAdminUserBlock = async (userId) => {
  const response = await API.post(
    `/api/admin/users/${userId}/block/`
  );

  return response.data;
};



// Properties
export const getAdminProperties = async ({
  status = "",
  is_available = "",
  search = "",
} = {}) => {
  const params = new URLSearchParams();

  if (status) params.append("status", status);
  if (is_available !== "") {
    params.append("is_available", is_available);
  }
  if (search) params.append("search", search);

  const response = await API.get(
    `/api/admin/properties/?${params.toString()}`
  );

  return response.data;
};

export const getAdminPropertyDetail = async (propertyId) => {
  const response = await API.get(
    `/api/admin/properties/${propertyId}/`
  );

  return response.data;
};

export const updateAdminPropertyStatus = async (
  propertyId,
  data
) => {
  const response = await API.post(
    `/api/admin/properties/${propertyId}/status/`,
    data
  );

  return response.data;
};


// Bookings
export const getAdminBookingSummary = async () => {
  const response = await API.get(
    "/api/admin/bookings/summary/"
  );

  return response.data;
};

export const getAdminBookings = async ({
  status = "",
  payment_status = "",
  search = "",
} = {}) => {
  const params = new URLSearchParams();

  if (status) params.append("status", status);
  if (payment_status) {
    params.append("payment_status", payment_status);
  }
  if (search) params.append("search", search);

  const response = await API.get(
    `/api/admin/bookings/?${params.toString()}`
  );

  return response.data;
};

export const getAdminBookingDetail = async (bookingId) => {
  const response = await API.get(
    `/api/admin/bookings/${bookingId}/`
  );

  return response.data;
};