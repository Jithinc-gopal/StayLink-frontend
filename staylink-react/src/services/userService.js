import API from "./api";


// ================= GET CURRENT USER =================

export const getCurrentUser = () => {

  return API.get(
    "/api/traveler/profile/me/"
  );

};


// ================= UPDATE TRAVELER PROFILE =================

export const updateTravelerProfile = (data) => {

  return API.patch(
    "/api/traveler/profile/me/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

};