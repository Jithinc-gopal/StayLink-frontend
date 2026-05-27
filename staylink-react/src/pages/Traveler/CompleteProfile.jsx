import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../../components/LandingpageComponents/Navbar";

import {
  getCurrentUser,
  updateTravelerProfile,
} from "../../services/userService";

export default function CompleteProfile() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",

    phone: "",
    gender: "",
    date_of_birth: "",

    city: "",
    state: "",
    country: "",

    preferred_language: "",
    occupation: "",

    bio: "",

    profile_image: null,
  });

  // ================= FETCH USER =================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const response = await getCurrentUser();

        const user = response.data;

        const profile = user.traveler_profile || {};

        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",

          phone: profile.phone || "",
          gender: profile.gender || "",
          date_of_birth: profile.date_of_birth || "",

          city: profile.city || "",
          state: profile.state || "",
          country: profile.country || "",

          preferred_language:
            profile.preferred_language || "",

          occupation:
            profile.occupation || "",

          bio: profile.bio || "",

          profile_image: null,
        });

        setPreviewImage(
          user.profile_image || null
        );

      } catch (error) {

        console.error(
          "Failed to fetch profile:",
          error
        );

        setError(
          "Failed to load profile"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchUser();

  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    // image upload
    if (name === "profile_image") {

      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        profile_image: file,
      }));

      if (file) {

        setPreviewImage(
          URL.createObjectURL(file)
        );
      }

    } else {

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      setError("");

      const data = new FormData();

      // ================= PROFILE FIELDS =================

      data.append("phone", formData.phone);

      data.append("gender", formData.gender);

      data.append(
        "date_of_birth",
        formData.date_of_birth
      );

      data.append("city", formData.city);

      data.append("state", formData.state);

      data.append("country", formData.country);

      data.append(
        "preferred_language",
        formData.preferred_language
      );

      data.append(
        "occupation",
        formData.occupation
      );

      data.append("bio", formData.bio);

      // image
      if (formData.profile_image) {

        data.append(
          "profile_image",
          formData.profile_image
        );
      }

      await updateTravelerProfile(data);

      navigate("/traveler/profile");

    } catch (error) {

      console.error(
        "Profile update failed:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);

    }
  };

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <div className="flex justify-center items-center py-40">

          <p className="text-slate-500 text-lg">
            Loading Profile...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ================= HEADER ================= */}

          <div className="px-8 py-8 border-b border-slate-100">

            <h1 className="text-3xl font-bold text-slate-900">
              Complete Your Profile
            </h1>

            <p className="text-slate-500 mt-2">
              Finish setting up your StayLink traveler account
            </p>

          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8"
          >

            {/* ================= PROFILE IMAGE ================= */}

            <div className="flex flex-col items-center">

              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm">

                <img
                  src={
                    previewImage ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />

              </div>

              <label className="mt-5">

                <span className="cursor-pointer px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium transition">

                  Upload Profile Image

                </span>

                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

              </label>

            </div>

            {/* ================= ERROR ================= */}

            {error && (

              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">

                {error}

              </div>

            )}

            {/* ================= BASIC INFO ================= */}

            <div>

              <h2 className="text-lg font-semibold text-slate-800 mb-5">
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                {/* First Name */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={formData.first_name}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none"
                  />

                </div>

                {/* Last Name */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={formData.last_name}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none"
                  />

                </div>

                {/* Phone */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  />

                </div>

                {/* Gender */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>

                {/* DOB */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  />

                </div>

              </div>

            </div>

            {/* ================= LOCATION ================= */}

            <div>

              <h2 className="text-lg font-semibold text-slate-800 mb-5">
                Location
              </h2>

              <div className="grid md:grid-cols-3 gap-6">

                {/* City */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  />

                </div>

                {/* State */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  />

                </div>

                {/* Country */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  />

                </div>

              </div>

            </div>

            {/* ================= EXTRA INFO ================= */}

            <div>

              <h2 className="text-lg font-semibold text-slate-800 mb-5">
                Additional Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Language */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Preferred Language
                  </label>

                  <input
                    type="text"
                    name="preferred_language"
                    value={formData.preferred_language}
                    onChange={handleChange}
                    placeholder="English"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  />

                </div>

                {/* Occupation */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Occupation
                  </label>

                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                  />

                </div>

              </div>

            </div>

            {/* ================= BIO ================= */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bio
              </label>

              <textarea
                rows="5"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell other travelers something about yourself..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-900"
              />

            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-all duration-300 disabled:opacity-50"
            >

              {saving
                ? "Saving Profile..."
                : "Complete Profile"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}