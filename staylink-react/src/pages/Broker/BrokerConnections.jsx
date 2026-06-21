// src/pages/Broker/BrokerConnections.jsx

import { useEffect, useMemo, useState } from "react";
import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";
import {
  getBrokerConnections,
  sendBrokerConnectionRequest,
  removeBrokerConnection,
  getBrokerConnectionRequests,
  respondBrokerConnectionRequest,
} from "../../services/brokerService";

import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

export default function BrokerConnections() {
  const [activeTab, setActiveTab] = useState("accepted");
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError("");

      const [connectionsRes, requestsRes] = await Promise.all([
        getBrokerConnections(activeTab),
        getBrokerConnectionRequests(),
      ]);

      setConnections(connectionsRes.data || []);
      setRequests(requestsRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load broker connections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [activeTab]);

  const filteredConnections = useMemo(() => {
    return connections.filter((item) => {
      const user = item.connected_user || item.user || item.receiver || item.sender || {};
      const text = `${user.username || ""} ${user.email || ""} ${user.phone || ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [connections, search]);

  const pendingRequests = useMemo(() => {
    return requests.filter((item) => item.status === "pending" || !item.status);
  }, [requests]);

  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!receiverId.trim()) {
      setError("Please enter a valid user ID.");
      return;
    }

    try {
      setRequestLoading(true);
      setError("");

      await sendBrokerConnectionRequest({
        receiver: receiverId,
        message,
      });

      setReceiverId("");
      setMessage("");
      fetchConnections();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to send connection request. Please check the user ID."
      );
    } finally {
      setRequestLoading(false);
    }
  };

  const handleRespondRequest = async (id, status) => {
    try {
      setActionLoading(id);
      setError("");

      await respondBrokerConnectionRequest(id, { status });
      fetchConnections();
    } catch (err) {
      console.error(err);
      setError("Failed to update connection request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveConnection = async (id) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this connection?"
    );

    if (!confirmRemove) return;

    try {
      setActionLoading(id);
      setError("");

      await removeBrokerConnection(id);
      fetchConnections();
    } catch (err) {
      console.error(err);
      setError("Failed to remove connection.");
    } finally {
      setActionLoading(null);
    }
  };

  const getUser = (item) => {
    return item.connected_user || item.user || item.receiver || item.sender || {};
  };

  return (
    <BrokerLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Broker Connections
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your connected users, incoming requests, and broker network.
            </p>
          </div>

          <button
            onClick={fetchConnections}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
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
                <p className="text-sm text-slate-500">Total Connections</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {connections.length}
                </h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Requests</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {pendingRequests.length}
                </h3>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Status</p>
                <h3 className="mt-2 text-lg font-semibold capitalize text-emerald-600">
                  {activeTab}
                </h3>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {["accepted", "pending", "rejected"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                          activeTab === tab
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full lg:w-80">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search connections..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="flex min-h-[260px] items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="mx-auto mb-3 animate-spin text-slate-400" />
                      <p className="text-sm text-slate-500">
                        Loading connections...
                      </p>
                    </div>
                  </div>
                ) : filteredConnections.length === 0 ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                      <Users size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      No connections found
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      There are no {activeTab} connections available right now.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredConnections.map((item) => {
                      const user = getUser(item);

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm md:flex-row md:items-center"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
                              {(user.username || user.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {user.username || "Unknown User"}
                              </h3>

                              <div className="mt-2 space-y-1 text-sm text-slate-500">
                                {user.email && (
                                  <p className="flex items-center gap-2">
                                    <Mail size={14} />
                                    {user.email}
                                  </p>
                                )}

                                {user.phone && (
                                  <p className="flex items-center gap-2">
                                    <Phone size={14} />
                                    {user.phone}
                                  </p>
                                )}

                                {item.property?.title && (
                                  <p className="flex items-center gap-2">
                                    <Building2 size={14} />
                                    {item.property.title}
                                  </p>
                                )}
                              </div>

                              {item.message && (
                                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                  {item.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                item.status === "accepted"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : item.status === "rejected"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {item.status || activeTab}
                            </span>

                            <button
                              onClick={() => handleRemoveConnection(item.id)}
                              disabled={actionLoading === item.id}
                              className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-60"
                              title="Remove connection"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <UserPlus size={22} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Send Connection Request
                  </h2>
                  <p className="text-sm text-slate-500">
                    Connect with users using their ID.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Receiver User ID
                  </label>
                  <input
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    placeholder="Enter user ID"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                    placeholder="Write a short message..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {requestLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Send Request
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="font-semibold text-slate-900">
                  Incoming Requests
                </h2>
                <p className="text-sm text-slate-500">
                  Accept or reject pending user requests.
                </p>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500">Loading requests...</p>
              ) : pendingRequests.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <Clock className="mx-auto mb-2 text-slate-400" size={24} />
                  <p className="text-sm text-slate-500">
                    No pending requests.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((item) => {
                    const user = item.sender || item.user || item.receiver || {};

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="mb-3 flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                            {(user.username || user.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              {user.username || "Unknown User"}
                            </h3>
                            {user.email && (
                              <p className="text-xs text-slate-500">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {item.message && (
                          <p className="mb-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                            {item.message}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              handleRespondRequest(item.id, "accepted")
                            }
                            disabled={actionLoading === item.id}
                            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            <CheckCircle2 size={15} />
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleRespondRequest(item.id, "rejected")
                            }
                            disabled={actionLoading === item.id}
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BrokerLayout>
  );
}