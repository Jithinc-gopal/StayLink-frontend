// pages/Owner/OwnerProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../../components/OwnerDashboardCOmponents/TopNavbar";
import { getOwnerProfile } from "../../services/authService";

const OwnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await getOwnerProfile();

      // ✅ Handle both response formats
      const data = res.data.data || res.data;
      setProfile(data);

    } catch (err) {
      console.error("Profile error:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <div className="pt-28 text-center text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <div className="pt-28 text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />

      <div className="pt-28 px-6 md:px-12 max-w-5xl mx-auto">

        {/* 🔙 Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* 🔷 PROFILE HEADER */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6">

          <img
            src={
              profile?.profile_image
                ? `http://127.0.0.1:8000${profile.profile_image}`
                : "https://i.pravatar.cc/150"
            }
            alt="profile"
            className="w-24 h-24 rounded-full border object-cover"
          />

          <div>
            <h2 className="text-2xl font-bold">
              {profile?.user?.first_name || "Owner"}
            </h2>

            <p className="text-gray-500">
              {profile?.user?.email || "No email"}
            </p>

            <p className="text-gray-400 text-sm">
              {profile?.phone || "No phone"}
            </p>
          </div>
        </div>

        {/* 🔷 DETAILS CARD */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6">

          <h3 className="text-lg font-semibold mb-6">
            Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Detail label="Phone" value={profile?.phone} />
            <Detail label="Address" value={profile?.address} />
            <Detail label="City" value={profile?.city} />
            <Detail label="District" value={profile?.district} />
            <Detail label="State" value={profile?.state} />
            <Detail label="Pincode" value={profile?.pincode} />

            <Detail
              label="Joined"
              value={
                profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"
              }
            />

          </div>

          {/* 🔘 ACTIONS */}
          <div className="flex gap-3 mt-8">

            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => alert("Next step: Edit Profile Page")}
            >
              Edit Profile
            </button>

            {profile?.id_proof && (
              <a
                href={`http://127.0.0.1:8000${profile.id_proof}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                View ID Proof
              </a>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

/* 🔹 Reusable Field Component */
const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium">
      {value || "Not provided"}
    </p>
  </div>
);

export default OwnerProfile;