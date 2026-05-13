import React, { useState, useEffect } from "react";
import TopNavbar from "../../components/OwnerDashboardCOmponents/TopNavbar";

import {
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  Home,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

import {
  getOwnerProfile,
} from "../../services/authService";

const OwnerDashboard = () => {

  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  const [loading, setLoading] = useState(true);

  const handleSearch = (value) => {
    console.log("Search:", value);
  };

  // =========================
  // Fetch Owner Profile
  // =========================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const response = await getOwnerProfile();

        console.log(response.data);

        setVerificationStatus(
          response.data.verification_status
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    fetchProfile();

  }, []);

  // =========================
  // Loading Screen
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl font-semibold text-gray-700">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <TopNavbar onSearch={handleSearch} />

      {/* Main Content */}
      <div className="pt-24 px-4 md:px-10 pb-10">

        {/* Welcome Section */}
        <div className="mb-8">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your properties, bookings and earnings
          </p>

        </div>

        {/* =========================
            Pending Banner
        ========================= */}

        {verificationStatus === "pending" && (

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">

            <div className="flex items-start gap-4">

              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock3
                  className="text-yellow-600"
                  size={28}
                />
              </div>

              <div>

                <h2 className="text-xl font-bold text-yellow-800">
                  Profile Verification Pending
                </h2>

                <p className="text-yellow-700 mt-2 max-w-2xl">
                  Your profile has been submitted successfully
                  and is currently under admin review.
                  Once approved, you will be able to add
                  properties, manage bookings and access all
                  owner features.
                </p>

                <button className="mt-4 bg-yellow-600 text-white px-5 py-2 rounded-lg font-medium cursor-not-allowed">
                  Verification In Progress
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =========================
            Rejected Banner
        ========================= */}

        {verificationStatus === "rejected" && (

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">

            <div className="flex items-start gap-4">

              <div className="bg-red-100 p-3 rounded-full">
                <XCircle
                  className="text-red-600"
                  size={28}
                />
              </div>

              <div>

                <h2 className="text-xl font-bold text-red-800">
                  Verification Rejected
                </h2>

                <p className="text-red-700 mt-2">
                  Your profile verification was rejected
                  by admin. Please update your details
                  and resubmit verification request.
                </p>

                <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition">
                  Update Profile
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =========================
            Approved Banner
        ========================= */}

        {verificationStatus === "approved" && (

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">

            <div className="flex items-start gap-4">

              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2
                  className="text-green-600"
                  size={28}
                />
              </div>

              <div>

                <h2 className="text-xl font-bold text-green-800">
                  Profile Approved
                </h2>

                <p className="text-green-700 mt-2">
                  Your account is verified successfully.
                  You can now manage properties,
                  bookings and earnings.
                </p>

              </div>
            </div>
          </div>
        )}

        {/* =========================
            Dashboard Cards
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Properties */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Properties
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  0
                </h2>

              </div>

              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 className="text-blue-600" />
              </div>

            </div>
          </div>

          {/* Bookings */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Bookings
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  0
                </h2>

              </div>

              <div className="bg-green-100 p-3 rounded-xl">
                <CalendarDays className="text-green-600" />
              </div>

            </div>
          </div>

          {/* Revenue */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  ₹0
                </h2>

              </div>

              <div className="bg-purple-100 p-3 rounded-xl">
                <IndianRupee className="text-purple-600" />
              </div>

            </div>
          </div>

          {/* Verification */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Verification
                </p>

                <h2 className="text-lg font-semibold mt-2 capitalize">
                  {verificationStatus}
                </h2>

              </div>

              <div className="bg-orange-100 p-3 rounded-xl">
                <ShieldCheck className="text-orange-600" />
              </div>

            </div>
          </div>
        </div>

        {/* =========================
            Quick Actions
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Add Property */}

              <button
                disabled={verificationStatus !== "approved"}
                className={`p-5 rounded-2xl border transition text-left ${
                  verificationStatus === "approved"
                    ? "hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              >

                <div className="bg-blue-100 w-fit p-3 rounded-xl mb-4">
                  <Home className="text-blue-600" />
                </div>

                <h3 className="font-bold text-lg">
                  Add Property
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Add new stays and rental properties
                </p>

              </button>

              {/* Manage Bookings */}

              <button
                disabled={verificationStatus !== "approved"}
                className={`p-5 rounded-2xl border transition text-left ${
                  verificationStatus === "approved"
                    ? "hover:border-green-500 hover:bg-green-50 cursor-pointer"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              >

                <div className="bg-green-100 w-fit p-3 rounded-xl mb-4">
                  <CalendarDays className="text-green-600" />
                </div>

                <h3 className="font-bold text-lg">
                  Manage Bookings
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  View and manage all customer bookings
                </p>

              </button>

            </div>
          </div>

          {/* Right */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Account Status
            </h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Profile Submitted
                </span>

                <CheckCircle2
                  className="text-green-500"
                  size={20}
                />

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Admin Verification
                </span>

                {verificationStatus === "approved" ? (

                  <CheckCircle2
                    className="text-green-500"
                    size={20}
                  />

                ) : (

                  <Clock3
                    className="text-yellow-500"
                    size={20}
                  />

                )}
              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Property Access
                </span>

                {verificationStatus === "approved" ? (

                  <CheckCircle2
                    className="text-green-500"
                    size={20}
                  />

                ) : (

                  <XCircle
                    className="text-red-400"
                    size={20}
                  />

                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;