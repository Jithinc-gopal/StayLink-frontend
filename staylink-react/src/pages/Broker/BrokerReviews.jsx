// src/pages/Broker/BrokerReviews.jsx

import { useEffect, useMemo, useState } from "react";
import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";
import { getBrokerReviews, createBrokerReview } from "../../services/brokerService";

import {
  Star,
  MessageSquareText,
  RefreshCw,
  AlertCircle,
  Search,
  Plus,
  Send,
  User,
  CalendarDays,
} from "lucide-react";

export default function BrokerReviews() {
  const [brokerId, setBrokerId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    if (!brokerId.trim()) {
      setReviews([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await getBrokerReviews(brokerId);
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load broker reviews. Please check the broker ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [brokerId]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const user = review.user || review.reviewer || {};
      const text = `${user.username || ""} ${user.email || ""} ${
        review.comment || ""
      }`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [reviews, search]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleCreateReview = async (e) => {
    e.preventDefault();

    if (!brokerId.trim()) {
      setError("Please enter a broker ID first.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment.");
      return;
    }

    try {
      setCreateLoading(true);
      setError("");

      await createBrokerReview(brokerId, {
        rating,
        comment,
      });

      setRating(5);
      setComment("");
      fetchReviews();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to create review. Please try again."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const renderStars = (value) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < Number(value)
            ? "fill-amber-400 text-amber-400"
            : "text-slate-300"
        }
      />
    ));
  };

  return (
    <BrokerLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Broker Reviews
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View feedback, ratings, and review history for brokers.
            </p>
          </div>

          <button
            onClick={fetchReviews}
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
                <p className="text-sm text-slate-500">Total Reviews</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {reviews.length}
                </h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <MessageSquareText size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Average Rating</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {averageRating}
                </h3>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Star size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-slate-500">Broker ID</p>
              <input
                value={brokerId}
                onChange={(e) => setBrokerId(e.target.value)}
                placeholder="Enter broker ID"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Review List
                    </h2>
                    <p className="text-sm text-slate-500">
                      All reviews related to selected broker.
                    </p>
                  </div>

                  <div className="relative w-full lg:w-80">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search reviews..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5">
                {!brokerId.trim() ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                      <Star size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Enter broker ID
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      Add a broker ID above to view reviews from the backend.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="flex min-h-[280px] items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="mx-auto mb-3 animate-spin text-slate-400" />
                      <p className="text-sm text-slate-500">
                        Loading reviews...
                      </p>
                    </div>
                  </div>
                ) : filteredReviews.length === 0 ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                      <MessageSquareText size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      No reviews found
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      No review records are available for this broker.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => {
                      const user = review.user || review.reviewer || {};

                      return (
                        <div
                          key={review.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                        >
                          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
                            <div className="flex items-start gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white">
                                <User size={20} />
                              </div>

                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {user.username || "Anonymous User"}
                                </h3>

                                {user.email && (
                                  <p className="text-sm text-slate-500">
                                    {user.email}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>

                          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                            {review.comment || "No comment provided."}
                          </p>

                          {review.created_at && (
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                              <CalendarDays size={14} />
                              {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Plus size={22} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Create Review
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add a new broker review.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Rating
                  </label>

                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Average</option>
                    <option value={1}>1 - Poor</option>
                  </select>

                  <div className="mt-3 flex gap-1">{renderStars(rating)}</div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Comment
                  </label>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="5"
                    placeholder="Write your review..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {createLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BrokerLayout>
  );
}