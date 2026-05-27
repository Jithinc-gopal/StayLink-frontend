import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Clock3,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  ShieldCheck,
} from "lucide-react";

import {
  getBrokerProfile,
} from "../../services/authService";

const BrokerDashboard = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  // =========================
  // FETCH BROKER PROFILE
  // =========================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const response = await getBrokerProfile();

        console.log(response.data);

        setVerificationStatus(
          response.data.verification_status
        );

      } catch (error) {

        console.log(error);

        // =========================
        // PROFILE NOT CREATED
        // =========================

        if (
          error.response &&
          error.response.status === 404
        ) {

          navigate("/broker/create-profile");

        }

      } finally {

        setLoading(false);

      }
    };

    fetchProfile();

  }, [navigate]);

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#f1f3ff]">

        <h1 className="text-xl font-semibold text-[#041b3c]">
          Loading Dashboard...
        </h1>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f1f3ff] p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-[#041b3c]">
          Broker Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your listings and clients
        </p>

      </div>

      {/* =========================
          PENDING BANNER
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
                Verification Pending
              </h2>

              <p className="text-yellow-700 mt-2 max-w-2xl">
                Your broker profile is under admin review.
                Once approved you can access all
                broker features.
              </p>

              <button className="mt-4 bg-yellow-600 text-white px-5 py-2 rounded-lg font-medium cursor-not-allowed">

                Verification In Progress

              </button>

            </div>
          </div>
        </div>
      )}

      {/* =========================
          APPROVED BANNER
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
                Your broker account is verified successfully.
                You can now access all broker features.
              </p>

            </div>
          </div>
        </div>
      )}

      {/* =========================
          REJECTED BANNER
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
                Your broker verification was rejected.
                Please update your profile and resubmit.
              </p>

              <button
                onClick={() =>
                  navigate("/broker/profile")
                }
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition"
              >

                Update Profile

              </button>

            </div>
          </div>
        </div>
      )}

      {/* =========================
          DASHBOARD CARDS
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* LISTINGS */}

        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                My Listings
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

        {/* CLIENTS */}

        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Clients
              </p>

              <h2 className="text-3xl font-bold mt-2">
                0
              </h2>

            </div>

            <div className="bg-green-100 p-3 rounded-xl">

              <Users className="text-green-600" />

            </div>
          </div>
        </div>

        {/* VERIFICATION */}

        <div className="bg-white p-6 rounded-2xl shadow-sm">

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
          QUICK STATUS
      ========================= */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-bold text-[#041b3c] mb-5">
          Account Status
        </h2>

        <div className="space-y-4">

          {/* PROFILE */}

          <div className="flex items-center justify-between">

            <span className="text-gray-500">
              Profile Submitted
            </span>

            <CheckCircle2
              className="text-green-500"
              size={20}
            />

          </div>

          {/* VERIFICATION */}

          <div className="flex items-center justify-between">

            <span className="text-gray-500">
              Admin Verification
            </span>

            {verificationStatus === "approved" ? (

              <CheckCircle2
                className="text-green-500"
                size={20}
              />

            ) : verificationStatus === "pending" ? (

              <Clock3
                className="text-yellow-500"
                size={20}
              />

            ) : (

              <XCircle
                className="text-red-500"
                size={20}
              />

            )}

          </div>

          {/* ACCESS */}

          <div className="flex items-center justify-between">

            <span className="text-gray-500">
              Broker Access
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
  );
};

export default BrokerDashboard;