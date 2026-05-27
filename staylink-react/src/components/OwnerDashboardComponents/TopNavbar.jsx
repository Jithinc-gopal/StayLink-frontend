import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getOwnerProfile } from "../../services/authService";

const TopNavbar = ({ onSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) await logoutUser(refresh);
    } catch (err) {
      console.error("Logout error:", err?.response?.data);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 md:px-8 py-3 w-full">
        {/* LEFT */}
        <div
          className="text-xl font-bold text-slate-800 cursor-pointer hover:text-slate-600 transition-colors"
          onClick={() => navigate("/owner/dashboard")}
        >
          StayLink
        </div>

        {/* SEARCH */}
        <div className="flex-1 px-6 max-w-md mx-auto">
          <div className="flex items-center w-full bg-slate-50 rounded-full px-4 py-2.5 shadow-sm border border-slate-200 focus-within:border-slate-400 focus-within:shadow-md transition-all">
            <span className="material-symbols-outlined text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search properties..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-transparent outline-none ml-3 w-full text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-xl">
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
              className="h-10 w-10 rounded-full cursor-pointer border-2 border-slate-200 object-cover hover:border-slate-400 transition-all"
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {showDropdown && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-[2000] overflow-hidden">
                <button
                  onClick={() => navigate("/owner/profile")}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/owner/settings")}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors border-t border-slate-100"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm font-medium text-red-600 transition-colors border-t border-slate-100"
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