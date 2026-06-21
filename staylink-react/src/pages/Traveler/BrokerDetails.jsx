// src/pages/Traveler/BrokerDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getApprovedBrokers,
  getBrokerReviews,
} from "../../services/brokerService";

import {
  startBrokerConversation,
} from "../../services/chatService";

import {
  Phone,
  MessageCircle,
  Star,
  MapPin,
  Building2,
  Briefcase,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Mail,
} from "lucide-react";

export default function BrokerDetails() {
  const { brokerId } = useParams();
  const navigate = useNavigate();

  const [broker, setBroker] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBrokerData = async () => {
    try {
      setLoading(true);
      setError("");

      const brokerRes = await getApprovedBrokers();

      const brokerList = Array.isArray(brokerRes.data)
        ? brokerRes.data
        : brokerRes.data?.results || [];

      const selectedBroker = brokerList.find(
        (item) => String(item.id) === String(brokerId)
      );

      if (!selectedBroker) {
        setBroker(null);
        setError("Broker not found.");
        return;
      }

      setBroker(selectedBroker);

      const reviewRes = await getBrokerReviews(brokerId);

      setReviews(
        Array.isArray(reviewRes.data)
          ? reviewRes.data
          : reviewRes.data?.results || []
      );
    } catch (err) {
      console.error("Broker details error:", err);
      setError("Failed to load broker details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokerData();
  }, [brokerId]);

  const getBrokerName = () => {
    return (
      broker?.first_name ||
      broker?.user?.first_name ||
      broker?.user?.username ||
      broker?.username ||
      broker?.agency_name ||
      "Broker"
    );
  };

  // IMPORTANT:
  // broker.id = BrokerProfile id
  // broker.user = actual CustomUser id
  // Chat backend needs CustomUser id.
  const getBrokerUserId = () => {
    return broker?.user?.id || broker?.user || null;
  };

  const handleStartBrokerChat = async () => {
  try {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    const brokerUserId = getBrokerUserId();

    if (!brokerUserId) {
      alert("Broker user id not found.");
      return;
    }

    setChatLoading(true);

    const data = await startBrokerConversation(brokerUserId);

    const conversationId = data?.conversation_id;

    if (!conversationId) {
      alert("Conversation id not returned from backend.");
      return;
    }

    navigate(`/chat/broker/${conversationId}`);
  } catch (err) {
    console.error("Broker chat start error:", err.response?.data || err);

    alert(
      err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to start chat with broker."
    );
  } finally {
    setChatLoading(false);
  }
};

  const getWhatsAppNumber = () => {
    if (!broker?.phone) return "";

    const cleanPhone = String(broker.phone).replace(/\D/g, "");

    if (cleanPhone.startsWith("91")) {
      return cleanPhone;
    }

    return `91${cleanPhone}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">
            Loading broker details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !broker) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />

          <h2 className="text-lg font-semibold text-slate-900">
            Broker Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Unable to load this broker."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <img
              src={
                broker.profile_image ||
                broker.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  getBrokerName()
                )}&background=0f172a&color=fff`
              }
              alt={getBrokerName()}
              className="h-40 w-40 rounded-full border-4 border-slate-100 object-cover"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {getBrokerName()}
              </h1>

              <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p className="flex items-center gap-3">
                  <Building2 size={18} />
                  {broker.agency_name || "Agency not added"}
                </p>

                <p className="flex items-center gap-3">
                  <MapPin size={18} />
                  {[broker.city, broker.district, broker.state]
                    .filter(Boolean)
                    .join(", ") || "Location not added"}
                </p>

                <p className="flex items-center gap-3">
                  <Briefcase size={18} />
                  {broker.experience || 0} Years Experience
                </p>

                <p className="flex items-center gap-3">
                  <Star size={18} className="text-amber-500" />
                  {broker.average_rating || "No Rating"} (
                  {broker.total_reviews || reviews.length || 0} Reviews)
                </p>

                {broker.email && (
                  <p className="flex items-center gap-3">
                    <Mail size={18} />
                    {broker.email}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {broker.phone && (
                  <>
                    <a
                      href={`tel:${broker.phone}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <Phone size={18} />
                      Call
                    </a>

                    <a
                      href={`https://wa.me/${getWhatsAppNumber()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600"
                    >
                      WhatsApp
                    </a>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleStartBrokerChat}
                  disabled={chatLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {chatLoading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <MessageCircle size={18} />
                  )}
                  {chatLoading ? "Opening Chat..." : "Chat"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <h3 className="font-semibold text-slate-900">
                      {review.reviewer_name ||
                        review.user?.username ||
                        review.reviewer?.username ||
                        "Anonymous User"}
                    </h3>

                    <div className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star size={16} fill="currentColor" />
                      {review.rating}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {review.comment || "No comment provided."}
                  </p>

                  {review.created_at && (
                    <p className="mt-3 text-xs text-slate-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}