import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import {
  useNavigate,
  NavLink,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { logoutUser } from "../../services/authService";
import { getCurrentUser } from "../../services/userService";

export default function Navbar() {
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ================= AUTH CHECK =================

  const isLoggedIn = !!localStorage.getItem("access");

  // ================= FETCH USER =================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!isLoggedIn) {
          setLoading(false);
          return;
        }

        const response = await getCurrentUser();

        setCurrentUser(response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.error(
          "Failed to fetch current user:",
          error
        );

        // token expired
        if (error.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");

          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, navigate]);

  // ================= OUTSIDE CLICK =================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ================= LOGOUT =================

  const handleLogout = async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    if (refresh && refresh !== "undefined" && refresh !== "null") {
      await logoutUser({
        refresh: refresh,
      });
    }
  } catch (error) {
    console.error(
      "Logout error:",
      error.response?.data || error
    );
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoged");

    setCurrentUser(null);
    setOpen(false);

    navigate("/login");
  }
};

  // ================= PROFILE IMAGE =================

  const profileImage =
    currentUser?.profile_image ||
    `https://ui-avatars.com/api/?name=${
      currentUser?.first_name || "User"
    }&background=0052CC&color=fff&bold=true`;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="h-20 flex items-center justify-between">

          {/* ================= LEFT ================= */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer group"
            >
              <h1 className="text-2xl font-headline font-bold tracking-wide text-[#172B4D] group-hover:text-[#0052CC] transition-colors duration-300">
                StayLink
              </h1>
              <div className="h-0.5 w-0 group-hover:w-full bg-[#0052CC] transition-all duration-300"></div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative font-body tracking-wide transition-all duration-300 font-medium ${
                    isActive
                      ? "text-[#0052CC]"
                      : "text-[#4A5568] hover:text-[#172B4D]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Discover
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0052CC] rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/stays"
                className={({ isActive }) =>
                  `relative font-body tracking-wide transition-all duration-300 font-medium ${
                    isActive
                      ? "text-[#0052CC]"
                      : "text-[#4A5568] hover:text-[#172B4D]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Stays
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0052CC] rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/experiences"
                className={({ isActive }) =>
                  `relative font-body tracking-wide transition-all duration-300 font-medium ${
                    isActive
                      ? "text-[#0052CC]"
                      : "text-[#4A5568] hover:text-[#172B4D]"
                  }`
                }
              >
                
                {({ isActive }) => (
                  <>
                    Experiences
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0052CC] rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
  to="/traveler/bookings"
  className={({ isActive }) =>
    `relative font-body tracking-wide transition-all duration-300 font-medium ${
      isActive
        ? "text-[#0052CC]"
        : "text-[#4A5568] hover:text-[#172B4D]"
    }`
  }
>
  {({ isActive }) => (
    <>
      My Bookings
      {isActive && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0052CC] rounded-full"></span>
      )}
    </>
  )}
</NavLink>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button className="relative p-2.5 rounded-full hover:bg-[#E8EDFF] transition-all duration-300 group">
              <Bell
                size={20}
                className="text-[#4A5568] group-hover:text-[#0052CC] transition-colors"
              />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#36B37E] ring-2 ring-white"></span>
            </button>

            {/* ================= USER ================= */}
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 hover:bg-[#E8EDFF] rounded-full px-3 py-1.5 transition-all duration-300 border border-[#C3C6D6] hover:border-[#0052CC]"
                >
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-[#0052CC]/10 to-[#0052CC]/20 ring-2 ring-[#0052CC]/20">
                    <img
                      src={profileImage}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* User Info */}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-body font-semibold text-[#172B4D] leading-none">
                      {loading
                        ? "Loading..."
                        : currentUser?.first_name || "Traveler"}
                    </span>
                    <span className="text-xs text-[#737685] mt-0.5">Guest</span>
                  </div>

                  {/* Dropdown Icon */}
                  <ChevronDown
                    size={16}
                    className={`text-[#737685] transition-all duration-300 ${
                      open ? "rotate-180 text-[#0052CC]" : ""
                    }`}
                  />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2.5 rounded-full bg-[#0052CC] text-white text-sm font-body font-semibold hover:bg-[#0041A3] transition-all duration-300 shadow-md"
                >
                  Login
                </button>
              )}

              {/* ================= DROPDOWN ================= */}
              {open && isLoggedIn && (
                <div className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-[#C3C6D6]">
                  {/* User Info */}
                  <div className="px-5 py-4 border-b border-[#E8EDFF] bg-[#F9F9FF]">
                    <h3 className="font-headline font-semibold text-[#172B4D]">
                      {currentUser?.first_name}{" "}
                      {currentUser?.last_name}
                    </h3>
                    <p className="text-sm text-[#737685] mt-1">
                      {currentUser?.email}
                    </p>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    {/* Profile */}
                    <button
                      onClick={() => {
                        navigate("/traveler/profile");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#434654] hover:bg-[#E8EDFF] hover:text-[#0052CC] transition-all duration-200"
                    >
                      <User size={16} className="text-[#0052CC]" />
                      Profile
                    </button>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#434654] hover:bg-[#E8EDFF] hover:text-[#0052CC] transition-all duration-200"
                    >
                      <Settings size={16} className="text-[#0052CC]" />
                      Settings
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#BA1A1A] hover:bg-[#FFDAD6] transition-all duration-200"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}