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
    "/api/admin/auth/mfa-setup/"
  );
  return response.data;
};

export const adminVerifyMFASetup = async (data) => {
  const response = await API.post(
    "/api/admin/auth/mfa-verify-setup/",
    data
  );
  return response.data;
};

export const adminVerifyMFALogin = async (data) => {
  const response = await API.post(
    "/api/admin/auth/mfa-verify-login/",
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