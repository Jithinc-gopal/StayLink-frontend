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

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notificationService";

import { WS_BASE_URL } from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const notificationSocketRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const isLoggedIn = !!localStorage.getItem("access");

  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!isLoggedIn) {
          setCurrentUser(null);
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

        if (error.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          localStorage.removeItem("isLoged");

          localStorage.removeItem("rzp_checkout_anon_id");
          localStorage.removeItem("rzp_device_id");
          localStorage.removeItem("rzp_stored_checkout_id");
          localStorage.removeItem("staylink_ai_chat_guest");

          setCurrentUser(null);
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!isLoggedIn) return;

      const res = await getNotifications();

      setNotifications(
        res.data.notifications || []
      );
      } catch (error) {
        console.error(
          "Notification fetch error:",
          error.response?.data || error
        );
      }
    };

    fetchNotifications();
  }, [isLoggedIn]);

  useEffect(() => {
      if (!isLoggedIn) return;

      const token = localStorage.getItem("access");

      if (!token) return;

      const socket = new WebSocket(
        `${WS_BASE_URL}/ws/notifications/?token=${token}`
      );

      notificationSocketRef.current = socket;

       // ===== ADD HERE =====
  socket.onopen = () => {
    console.log(
      "Notification WebSocket connected"
    );
  };

  socket.onclose = (event) => {
    console.log(
      "Notification WebSocket closed",
      event.code
    );
  };

  // ====================

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "notification") {
          setNotifications((prev) => [
            data.notification,
            ...prev,
          ]);
        }
      };

      socket.onerror = (error) => {
        console.error("Notification WebSocket error:", error);
      };

      return () => {
          if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
          ) {
            socket.close();
          }
    };
}, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
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

  const handleLogout = async () => {
    // FIX: capture the current user's AI chat storage key BEFORE
    // clearing "access" below — otherwise we lose the ability to
    // identify which user's chat history to remove.
    let aiChatKeyToRemove = "staylink_ai_chat_guest";
    try {
      const token = localStorage.getItem("access");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        aiChatKeyToRemove = `staylink_ai_chat_${payload.user_id}`;
      }
    } catch {}

    try {
      const refresh = localStorage.getItem("refresh");

      if (
        refresh &&
        refresh !== "undefined" &&
        refresh !== "null"
      ) {
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

      localStorage.removeItem("rzp_checkout_anon_id");
      localStorage.removeItem("rzp_device_id");
      localStorage.removeItem("rzp_stored_checkout_id");

      // FIX: clear this user's AI chat history on logout so it
      // never bleeds into the next person who logs in on this device.
      localStorage.removeItem(aiChatKeyToRemove);
      localStorage.removeItem("staylink_ai_chat_guest");

      setCurrentUser(null);
      setOpen(false);
      setNotificationOpen(false);

      navigate("/login");
    }
  };

  const handleMarkOneRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error.response?.data || error
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error.response?.data || error
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const profileImage =
    currentUser?.profile_image ||
    `https://ui-avatars.com/api/?name=${
      currentUser?.first_name || "User"
    }&background=0052CC&color=fff&bold=true`;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer group"
            >
              <h1 className="text-2xl font-headline font-bold tracking-wide text-[#172B4D] group-hover:text-[#0052CC] transition-colors duration-300">
                StayLink
              </h1>
              <div className="h-0.5 w-0 group-hover:w-full bg-[#0052CC] transition-all duration-300"></div>
            </div>

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

              {isLoggedIn && (
                <NavLink
                  to="/traveler/my-bookings"
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
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() =>
                    setNotificationOpen((prev) => !prev)
                  }
                  className="relative p-2.5 rounded-full hover:bg-[#E8EDFF] transition-all duration-300 group"
                >
                  <Bell
                    size={20}
                    className="text-[#4A5568] group-hover:text-[#0052CC] transition-colors"
                  />

                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 top-14 w-96 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-[#C3C6D6] z-[2000]">
                    <div className="px-5 py-4 border-b border-[#E8EDFF] bg-[#F9F9FF] flex items-center justify-between">
                      <h3 className="font-headline font-semibold text-[#172B4D]">
                        Notifications
                      </h3>

                      {notifications.length > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs font-semibold text-[#0052CC] hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                          <p className="text-sm text-[#737685]">
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() =>
                              handleMarkOneRead(notification.id)
                            }
                            className={`w-full text-left px-5 py-4 border-b border-[#E8EDFF] hover:bg-[#E8EDFF] transition-all duration-200 ${
                              !notification.is_read
                                ? "bg-[#F4F7FF]"
                                : "bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.is_read && (
                                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#0052CC] flex-shrink-0"></span>
                              )}

                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-[#172B4D]">
                                  {notification.title}
                                </h4>

                                <p className="text-xs text-[#737685] mt-1 leading-relaxed">
                                  {notification.message}
                                </p>

                                <p className="text-[10px] text-[#9AA0B5] mt-2 uppercase">
                                  {notification.notification_type}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 hover:bg-[#E8EDFF] rounded-full px-3 py-1.5 transition-all duration-300 border border-[#C3C6D6] hover:border-[#0052CC]"
                >
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-[#0052CC]/10 to-[#0052CC]/20 ring-2 ring-[#0052CC]/20">
                    <img
                      src={profileImage}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-body font-semibold text-[#172B4D] leading-none">
                      {loading
                        ? "Loading..."
                        : currentUser?.first_name || "Traveler"}
                    </span>
                    <span className="text-xs text-[#737685] mt-0.5">
                      Guest
                    </span>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-[#737685] transition-all duration-300 ${
                      open ? "rotate-180 text-[#0052CC]" : ""
                    }`}
                  />
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2.5 rounded-full bg-[#0052CC] text-white text-sm font-body font-semibold hover:bg-[#0041A3] transition-all duration-300 shadow-md"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-2.5 rounded-full border border-[#0052CC] text-[#0052CC] text-sm font-body font-semibold hover:bg-[#E8EDFF] transition-all duration-300"
                  >
                    Register
                  </button>
                </div>
              )}

              {open && isLoggedIn && (
                <div className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-[#C3C6D6]">
                  <div className="px-5 py-4 border-b border-[#E8EDFF] bg-[#F9F9FF]">
                    <h3 className="font-headline font-semibold text-[#172B4D]">
                      {currentUser?.first_name}{" "}
                      {currentUser?.last_name}
                    </h3>
                    <p className="text-sm text-[#737685] mt-1">
                      {currentUser?.email}
                    </p>
                  </div>

                  <div className="py-2">
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