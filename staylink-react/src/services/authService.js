import API from "./api";


export const registerUser = (data) => {
  return API.post("api/accounts/register/", data);
};


export const verifyCode = (data) => {
  return API.post("api/accounts/verify-code/", data);
};

export const registerPartner = (data) => {
   return API.post("/api/accounts/partner/register/", data);
};

export const loginUser = (data) => {
  return API.post("api/accounts/login/", data);
};

export const verifyMFALogin = (data) => {
  return API.post("/api/accounts/mfa/verify-login/", data);
};

export const logoutUser = (refresh) => {
  return API.post("api/accounts/logout/", { refresh });
};


export const createOwnerProfile = (formData) => {
  return API.post("api/accounts/owner/profile/", formData);
};

export const createBrokerProfile = (formData) => {
  return API.post("api/accounts/broker/profile/", formData);
};

export const getOwnerProfile = () => {
  return API.get("api/accounts/owner/profile/");
};

/* ✅ ADD THIS (for update later) */
export const updateOwnerProfile = (data) => {
  return API.put("api/accounts/owner/profile/", data);
};

export const forgotPassword = (email) => {
  return API.post("api/accounts/forgot-password/", { email });
};

export const resetPassword = (data) => {
  return API.post("api/accounts/reset-password/", data);
};
export const getBrokerStatus = () => {
  return API.get("api/accounts/broker/status/");
};

export const getBrokerProfile = () => {
  return API.get("api/accounts/broker/profile/");
};

export const setupMFA = () => {
  return API.post("/api/accounts/mfa/setup/");
};

export const verifyMFASetup = (code) => {
  return API.post("/api/accounts/mfa/verify-setup/", {
    code,
  });
};

export const disableMFA = (code) => {
  return API.post("/api/accounts/mfa/disable/", {
    code,
  });
};