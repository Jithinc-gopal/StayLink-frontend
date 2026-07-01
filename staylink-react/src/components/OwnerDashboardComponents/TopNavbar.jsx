import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  logoutUser,
  getOwnerProfile,
} from "../../services/authService";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notificationService";

import {
  API_BASE_URL,
  WS_BASE_URL,
} from "../../services/api";

const TopNavbar = ({ onSearch }) => {
  const [showDropdown, setShowDropdown] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [profile, setProfile] = useState(null);

  const [notifications, setNotifications] =
    useState([]);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const notificationSocketRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("access");

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
    const fetchNotifications = async () => {
      try {
        if (!isLoggedIn) return;

        const res = await getNotifications();

        setNotifications(
          res.data.notifications || []
        );
      } catch (error) {
        console.error(
          "Owner notification fetch error:",
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

    socket.onopen = () => {
      console.log(
        "Owner Notification WebSocket connected"
      );
    };

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
      console.error(
        "Owner Notification WebSocket error:",
        error
      );
    };

    socket.onclose = (event) => {
      console.log(
        "Owner Notification WebSocket closed",
        event.code
      );
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
        setShowDropdown(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = async () => {
    try {
      const refresh =
        localStorage.getItem("refresh");

      if (
        refresh &&
        refresh !== "undefined" &&
        refresh !== "null"
      ) {
        await logoutUser({
          refresh: refresh,
        });
      }
    } catch (err) {
      console.error(
        "Logout error:",
        err?.response?.data || err
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

      setShowDropdown(false);
      setShowNotifications(false);

      navigate("/login", { replace: true });
    }
  };

  const openPage = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  const handleMarkOneRead = async (
    notificationId
  ) => {
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
        "Owner mark notification read error:",
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
        "Owner mark all notifications read error:",
        error.response?.data || error
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 md:px-8 py-3 w-full">
        {/* LEFT */}
        <div
          className="text-xl font-bold text-slate-800 cursor-pointer hover:text-slate-600 transition-colors"
          onClick={() =>
            navigate("/owner/dashboard")
          }
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
              onChange={(e) =>
                onSearch?.(e.target.value)
              }
              className="bg-transparent outline-none ml-3 w-full text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <div
            className="relative"
            ref={notificationRef}
          >
            <button
              onClick={() =>
                setShowNotifications(
                  (prev) => !prev
                )
              }
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-600 text-xl">
                notifications
              </span>

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-[2000] overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm">
                    Notifications
                  </h3>

                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          onClick={() =>
                            handleMarkOneRead(
                              notification.id
                            )
                          }
                          className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            !notification.is_read
                              ? "bg-blue-50"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!notification.is_read && (
                              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                            )}

                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-slate-800">
                                {notification.title}
                              </h4>

                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {notification.message}
                              </p>

                              <p className="text-[10px] text-slate-400 mt-2 uppercase">
                                {
                                  notification.notification_type
                                }
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chat Inbox */}
          <button
            onClick={() =>
              navigate("/owner/chats")
            }
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            title="Chats"
          >
            <span className="material-symbols-outlined text-slate-600 text-xl">
              chat
            </span>
          </button>

          {/* Profile + Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
          >
            <img
              src={
                profile?.profile_image
                  ? `${API_BASE_URL}${profile.profile_image}`
                  : "https://i.pravatar.cc/100"
              }
                            alt="profile"
              className="h-10 w-10 rounded-full cursor-pointer border-2 border-slate-200 object-cover hover:border-slate-400 transition-all"
              onClick={() =>
                setShowDropdown(
                  (prev) => !prev
                )
              }
            />

            {showDropdown && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-[2000] overflow-hidden">
                <button
                  onClick={() =>
                    openPage("/owner/profile")
                  }
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                >
                  Profile
                </button>

                <button
                  onClick={() =>
                    openPage("/owner/settings")
                  }
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors border-t border-slate-100"
                >
                  Settings
                </button>

                <button
                  onClick={() =>
                    openPage("/mfa/setup")
                  }
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors border-t border-slate-100"
                >
                  Security / MFA
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