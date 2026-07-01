import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notificationService";
import { WS_BASE_URL } from "../../services/api";

export default function AdminNotifications() {
  const notificationRef = useRef(null);
  const socketRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const isLoggedIn = !!localStorage.getItem("access");

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
          "Admin notification fetch error:",
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

  socketRef.current = socket;

  socket.onopen = () => {
    console.log("Admin notification socket connected");
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
      "Admin notification socket error:",
      error
    );
  };

  socket.onclose = () => {
    console.log("Admin notification socket closed");
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
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
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
        "Mark admin notification read error:",
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
        "Mark all admin notifications read error:",
        error.response?.data || error
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-3 rounded-full bg-slate-100 hover:bg-blue-50 transition"
      >
        <Bell size={20} className="text-[#003d9b]" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-[#003d9b]">
              Admin Notifications
            </h3>

            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-5 text-sm text-gray-500">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() =>
                    handleMarkOneRead(notification.id)
                  }
                  className={`w-full text-left p-4 border-b hover:bg-slate-50 ${
                    !notification.is_read
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    {!notification.is_read && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                    )}

                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {notification.title}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
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
  );
}