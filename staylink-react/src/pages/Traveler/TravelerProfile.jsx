import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../../components/LandingpageComponents/Navbar";

import {
  getCurrentUser,
} from "../../services/userService";

export default function TravelerProfile() {

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ================= FETCH USER =================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const response = await getCurrentUser();

        setCurrentUser(response.data);

      } catch (error) {

        console.error(
          "Profile fetch error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchUser();

  }, []);

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <div className="flex justify-center items-center h-[70vh]">

          <p className="text-slate-500 text-lg">
            Loading Profile...
          </p>

        </div>

      </div>
    );
  }

  // ================= NO USER =================

  if (!currentUser) {

    return (

      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <div className="flex justify-center items-center h-[70vh]">

          <p className="text-red-500 text-lg">
            Failed to load profile
          </p>

        </div>

      </div>
    );
  }

  // ================= PROFILE DATA =================

  const profile =
    currentUser.traveler_profile || {};

  // ================= PROFILE STATUS =================

  const isProfileCompleted =
    profile.is_profile_completed;

  // ================= PROFILE IMAGE =================

  const profileImage =
    currentUser.profile_image ||
    `https://ui-avatars.com/api/?name=${currentUser.first_name}`;

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ================= COVER ================= */}

          <div className="h-40 bg-gradient-to-r from-blue-900 to-blue-700" />

          {/* ================= CONTENT ================= */}

          <div className="px-8 pb-8">

            {/* ================= TOP SECTION ================= */}

            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 gap-6">

              {/* LEFT */}

              <div className="flex flex-col md:flex-row items-start md:items-end gap-5">

                {/* IMAGE */}

                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">

                  <img
                    src={profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* USER INFO */}

                <div className="pb-2">

                  <h1 className="text-3xl font-bold text-slate-900">

                    {currentUser.first_name}{" "}
                    {currentUser.last_name}

                  </h1>

                  <p className="text-slate-500 mt-1">
                    {currentUser.email}
                  </p>

                  {/* PROFILE STATUS */}

                  <div className="mt-3">

                    {isProfileCompleted ? (

                      <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">

                        Profile Completed

                      </span>

                    ) : (

                      <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">

                        Profile Incomplete

                      </span>

                    )}

                  </div>

                </div>

              </div>

              {/* BUTTON */}

              <div>

                <button
                  onClick={() =>
                    navigate(
                      "/traveler/complete-profile"
                    )
                  }
                  className="px-6 py-3 rounded-2xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-all duration-300"
                >

                  {isProfileCompleted
                    ? "Edit Profile"
                    : "Complete Profile"}

                </button>

              </div>

            </div>

            {/* ================= INCOMPLETE PROFILE ================= */}

            {!isProfileCompleted && (

              <div className="mt-10 bg-amber-50 border border-amber-200 rounded-3xl p-8">

                <h2 className="text-2xl font-bold text-amber-700">

                  Complete Your Traveler Profile

                </h2>

                <p className="text-slate-600 mt-3 leading-relaxed">

                  Complete your profile to start booking stays,
                  save wishlists, write reviews, and build trust
                  with hosts on StayLink.

                </p>

                <button
                  onClick={() =>
                    navigate(
                      "/traveler/complete-profile"
                    )
                  }
                  className="mt-6 px-8 py-3 rounded-2xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-all duration-300"
                >

                  Complete Profile

                </button>

              </div>

            )}

            {/* ================= COMPLETED PROFILE ================= */}

            {isProfileCompleted && (

              <div className="mt-10 space-y-10">

                {/* ================= ABOUT ================= */}

                <div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-5">
                    About
                  </h2>

                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                    <p className="text-slate-700 leading-relaxed">

                      {profile.bio ||
                        "No bio added yet."}

                    </p>

                  </div>

                </div>

                {/* ================= PROFILE DETAILS ================= */}

                <div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-5">
                    Profile Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* PHONE */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        Phone Number
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {profile.phone || "N/A"}

                      </h3>

                    </div>

                    {/* GENDER */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        Gender
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800 capitalize">

                        {profile.gender || "N/A"}

                      </h3>

                    </div>

                    {/* DOB */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        Date of Birth
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {profile.date_of_birth ||
                          "N/A"}

                      </h3>

                    </div>

                    {/* CITY */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        City
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {profile.city || "N/A"}

                      </h3>

                    </div>

                    {/* STATE */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        State
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {profile.state || "N/A"}

                      </h3>

                    </div>

                    {/* COUNTRY */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        Country
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {profile.country || "N/A"}

                      </h3>

                    </div>

                    {/* LANGUAGE */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        Preferred Language
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {profile.preferred_language ||
                          "N/A"}

                      </h3>

                    </div>

                    {/* OCCUPATION */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        Occupation
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {profile.occupation ||
                          "N/A"}

                      </h3>

                    </div>

                    {/* MEMBER SINCE */}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

                      <p className="text-sm text-slate-500">
                        Member Since
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-800">

                        {new Date(
                          profile.created_at
                        ).toLocaleDateString()}

                      </h3>

                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}