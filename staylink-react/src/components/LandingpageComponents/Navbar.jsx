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

      if (refresh) {
        await logoutUser(refresh);
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data
      );
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  // ================= PROFILE IMAGE =================

  const profileImage =
    currentUser?.profile_image ||
    `https://ui-avatars.com/api/?name=${
      currentUser?.first_name || "User"
    }&background=0F172A&color=fff`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">

        <div className="h-20 flex items-center justify-between">

          {/* ================= LEFT ================= */}

          <div className="flex items-center gap-10">

            {/* Logo */}

            <div
              onClick={() => navigate("/")}
              className="cursor-pointer"
            >
              <h1 className="text-2xl font-black tracking-tight text-blue-900">
                StayLink
              </h1>
            </div>

            {/* Nav Links */}

            <div className="hidden md:flex items-center gap-8">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-blue-900"
                      : "text-slate-500 hover:text-blue-800"
                  }`
                }
              >
                Discover
              </NavLink>

              <NavLink
                to="/stays"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-blue-900"
                      : "text-slate-500 hover:text-blue-800"
                  }`
                }
              >
                Stays
              </NavLink>

              <NavLink
                to="/experiences"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-blue-900"
                      : "text-slate-500 hover:text-blue-800"
                  }`
                }
              >
                Experiences
              </NavLink>

            </div>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="flex items-center gap-4">

            {/* Notification */}

            <button className="relative p-2 rounded-full hover:bg-slate-100 transition">

              <Bell
                size={22}
                className="text-slate-600"
              />

              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>

            </button>

            {/* ================= USER ================= */}

            <div
              className="relative"
              ref={dropdownRef}
            >

              {isLoggedIn ? (

                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 hover:bg-slate-100 rounded-2xl px-3 py-2 transition"
                >

                  {/* Avatar */}

                  <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">

                    <img
                      src={profileImage}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* User Info */}

                  <div className="hidden sm:flex flex-col items-start">

                    <span className="text-sm font-semibold text-slate-800 leading-none">

                      {loading
                        ? "Loading..."
                        : currentUser?.first_name || "Traveler"}

                    </span>

                  </div>

                  {/* Dropdown Icon */}

                  <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />

                </button>

              ) : (

                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition"
                >
                  Login
                </button>

              )}

              {/* ================= DROPDOWN ================= */}

              {open && isLoggedIn && (

                <div className="absolute right-0 top-16 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">

                  {/* User Info */}

                  <div className="px-5 py-4 border-b border-slate-100">

                    <h3 className="font-semibold text-slate-800">

                      {currentUser?.first_name}{" "}
                      {currentUser?.last_name}

                    </h3>

                    <p className="text-sm text-slate-500 mt-1">

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
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >

                      <User size={18} />

                      Profile

                    </button>

                    {/* Settings */}

                    <button
                      onClick={() => {
                        navigate("/settings");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >

                      <Settings size={18} />

                      Settings

                    </button>

                    {/* Logout */}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >

                      <LogOut size={18} />

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