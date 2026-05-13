import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getOwnerProfile } from "../../services/authService";

const TopNavbar = ({ onSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const dropdownRef = useRef(); // ✅ reference

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getOwnerProfile();
        const data = res.data.data || res.data;
        setProfile(data);
      } catch (err) {
        console.error("Navbar profile error:", err);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        await logoutUser(refresh);
      }
    } catch (err) {
      console.error("Logout error:", err?.response?.data);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200">

      <div className="flex items-center justify-between px-6 md:px-12 py-4 w-full">

        {/* LEFT */}
        <div
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/owner/dashboard")}
        >
          StayLink
        </div>

        {/* SEARCH */}
        <div className="flex-1 px-6">
          <div className="flex items-center w-full bg-gray-100 rounded-full px-5 py-3 shadow-sm">
            <span className="material-symbols-outlined text-gray-500">
              search
            </span>

            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-transparent outline-none ml-3 w-full text-sm"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {/* Notification */}
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <span className="material-symbols-outlined text-gray-700">
              notifications
            </span>
          </button>

          {/* Profile + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={
                profile?.profile_image
                  ? `http://127.0.0.1:8000${profile.profile_image}`
                  : "https://i.pravatar.cc/100"
              }
              alt="profile"
              className="h-10 w-10 rounded-full cursor-pointer border object-cover"
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {showDropdown && (
              <div className="absolute right-0 top-14 w-44 bg-white border rounded-xl shadow-xl z-[2000]">

                <button
                  onClick={() => navigate("/owner/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Profile
                </button>

                <button
                  onClick={() => navigate("/owner/settings")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
                >
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopNavbar;