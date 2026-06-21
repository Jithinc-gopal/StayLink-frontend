// src/pages/Broker/BrokerNotifications.jsx

import { useEffect, useMemo, useState } from "react";
import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";
import {
  getBrokerNotifications,
  markBrokerNotificationRead,
  markAllBrokerNotificationsRead,
} from "../../services/brokerService";

import {
  Bell,
  BellRing,
  CheckCheck,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Search,
  MailOpen,
  Clock,
  Info,
} from "lucide-react";

export default function BrokerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadFilter, setUnreadFilter] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const unread =
        unreadFilter === "" ? undefined : unreadFilter === "true";

      const res = await getBrokerNotifications(unread);
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [unreadFilter]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const text = `${item.title || ""} ${item.message || ""} ${
        item.notification_type || ""
      }`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [notifications, search]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.is_read && !item.read).length;
  }, [notifications]);

  const readCount = notifications.length - unreadCount;

  const handleMarkRead = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await markBrokerNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
      setError("Failed to mark notification as read.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkAllLoading(true);
      setError("");

      await markAllBrokerNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
      setError("Failed to mark all notifications as read.");
    } finally {
      setMarkAllLoading(false);
    }
  };

  const isRead = (item) => item.is_read || item.read;

  const getNotificationIcon = (type) => {
    const value = String(type || "").toLowerCase();

    if (value.includes("connection")) return <BellRing size={20} />;
    if (value.includes("review")) return <CheckCircle2 size={20} />;
    if (value.includes("property")) return <Info size={20} />;

    return <Bell size={20} />;
  };

  return (
    <BrokerLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Broker Notifications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track broker alerts, requests, reviews, and important updates.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleMarkAllRead}
              disabled={markAllLoading || unreadCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {markAllLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <CheckCheck size={16} />
              )}
              Mark All Read
            </button>

            <button
              onClick={fetchNotifications}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Notifications</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {notifications.length}
                </h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Bell size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Unread</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {unreadCount}
                </h3>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <BellRing size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Read</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {readCount}
                </h3>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <MailOpen size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Notification Center
                </h2>
                <p className="text-sm text-slate-500">
                  View and manage your latest broker notifications.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={unreadFilter}
                  onChange={(e) => setUnreadFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                >
                  <option value="">All Notifications</option>
                  <option value="true">Unread Only</option>
                  <option value="false">Read Only</option>
                </select>

                <div className="relative w-full sm:w-80">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="mx-auto mb-3 animate-spin text-slate-400" />
                  <p className="text-sm text-slate-500">
                    Loading notifications...
                  </p>
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                  <Bell size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  No notifications found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  You do not have any broker notifications for this filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((item) => {
                  const readStatus = isRead(item);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-5 transition hover:shadow-sm ${
                        readStatus
                          ? "border-slate-200 bg-white"
                          : "border-blue-200 bg-blue-50/40"
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="flex gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                              readStatus
                                ? "bg-slate-100 text-slate-500"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {getNotificationIcon(item.notification_type)}
                          </div>

                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-slate-900">
                                {item.title || "Notification"}
                              </h3>

                              {!readStatus && (
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                                  New
                                </span>
                              )}

                              {item.notification_type && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                                  {String(item.notification_type).replace(
                                    "_",
                                    " "
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="text-sm leading-6 text-slate-600">
                              {item.message || "No message provided."}
                            </p>

                            {item.created_at && (
                              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                <Clock size={14} />
                                {new Date(item.created_at).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {!readStatus && (
                          <button
                            onClick={() => handleMarkRead(item.id)}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                          >
                            {actionLoading === item.id ? (
                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2 size={15} />
                            )}
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </BrokerLayout>
  );
}